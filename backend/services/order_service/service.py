from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Union
from fastapi import HTTPException, status
from decimal import Decimal

from models import Order, OrderItem, User, Product
from .schemas import OrderCreate, OrderUpdate, OrderItemUpdate, PaymentStatus, OrderStatus

class OrderService:
    @staticmethod
    def get_order_by_id(db: Session, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        """
        Get an order by ID. If user_id is provided, ensure it belongs to that user.
        
        Args:
            db: Database session
            order_id: Order ID
            user_id: Optional user ID to verify ownership
            
        Returns:
            Order object if found, None otherwise
        """
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        return query.first()
    
    @staticmethod
    def get_user_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
        """
        Get all orders for a specific user
        
        Args:
            db: Database session
            user_id: User ID
            skip: Number of records to skip (pagination)
            limit: Max number of records to return
            
        Returns:
            List of orders
        """
        return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_order(db: Session, order_data: OrderCreate, user_id: Optional[int] = None) -> Order:
        """
        Create a new order
        
        Args:
            db: Database session
            order_data: Order creation data
            user_id: User ID (can override the one in order_data)
            
        Returns:
            Created order
        """
        # Use provided user_id or the one from order_data
        effective_user_id = user_id if user_id is not None else order_data.user_id
        
        if effective_user_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User ID is required"
            )
        
        # Verify user exists
        user = db.query(User).filter(User.user_id == effective_user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify and get all products for inventory check
        product_ids = [item.product_id for item in order_data.items]
        products = db.query(Product).filter(Product.product_id.in_(product_ids)).all()
        
        # Create a dictionary of product_id -> Product for easy lookup
        product_map = {product.product_id: product for product in products}
        
        # Check if all products exist and have sufficient stock
        for item in order_data.items:
            product = product_map.get(item.product_id)
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID {item.product_id} not found"
                )
                
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name} (ID: {product.product_id})"
                )
        
        # Calculate total amount
        total_amount = sum(
            item.price_per_unit * item.quantity 
            for item in order_data.items
        )
        
        # Convert billing address to dict if available
        billing_address = None
        if order_data.billing_address:
            billing_address = order_data.billing_address.dict()
        
        # Create the order
        db_order = Order(
            user_id=effective_user_id,
            order_date=func.now(),
            total_amount=total_amount,
            shipping_address=order_data.shipping_address.dict(),
            billing_address=billing_address,
            payment_method=order_data.payment_method.value,
            order_status=OrderStatus.pending.value,
            payment_status=order_data.payment_status.value,
            notes=order_data.notes
        )
        
        db.add(db_order)
        db.flush()  # Get order_id without committing transaction
        
        # Create order items
        for item_data in order_data.items:
            db_order_item = OrderItem(
                order_id=db_order.order_id,
                product_id=item_data.product_id,
                quantity=item_data.quantity,
                price_per_unit=item_data.price_per_unit,
                subtotal=item_data.price_per_unit * item_data.quantity
            )
            db.add(db_order_item)
            
            # Update product stock
            product = product_map[item_data.product_id]
            product.stock_quantity -= item_data.quantity
        
        # Commit the transaction
        db.commit()
        db.refresh(db_order)
        
        return db_order
    
    @staticmethod
    def update_order(db: Session, order_id: int, order_data: OrderUpdate, user_id: Optional[int] = None) -> Union[Order, bool]:
        """
        Update an order
        
        Args:
            db: Database session
            order_id: ID of the order to update
            order_data: Updated order data
            user_id: Optional user ID to verify ownership
            
        Returns:
            Updated order if successful, False if order not found
        """
        # Find order
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        db_order = query.first()
        
        if not db_order:
            return False
            
        # Update fields if provided
        update_data = order_data.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            # Convert enum to string value if needed
            if isinstance(value, (OrderStatus, PaymentStatus)):
                value = value.value
                
            setattr(db_order, key, value)
            
        # Special handling: if status changed to cancelled, restore stock
        if (order_data.order_status == OrderStatus.cancelled and 
            db_order.order_status != OrderStatus.cancelled.value):
            # Restore stock for all items
            for item in db_order.order_items:
                product = db.query(Product).filter(Product.product_id == item.product_id).first()
                if product:
                    product.stock_quantity += item.quantity
        
        db.commit()
        db.refresh(db_order)
        
        return db_order
    
    @staticmethod
    def delete_order(db: Session, order_id: int, user_id: Optional[int] = None) -> bool:
        """
        Delete an order - only if it's in 'pending' status
        
        Args:
            db: Database session
            order_id: ID of the order to delete
            user_id: Optional user ID to verify ownership
            
        Returns:
            True if successful, False if order not found or cannot be deleted
        """
        # Find order
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        db_order = query.first()
        
        if not db_order:
            return False
            
        # Can only delete if order is pending
        if db_order.order_status != OrderStatus.pending.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only delete orders in 'pending' status"
            )
            
        # Restore stock for all items
        for item in db_order.order_items:
            product = db.query(Product).filter(Product.product_id == item.product_id).first()
            if product:
                product.stock_quantity += item.quantity
        
        # Delete order (cascade will delete order items)
        db.delete(db_order)
        db.commit()
        
        return True
    
    @staticmethod
    def update_order_item(db: Session, order_id: int, order_item_id: int, 
                         item_data: OrderItemUpdate, user_id: Optional[int] = None) -> Union[OrderItem, bool]:
        """
        Update an order item
        
        Args:
            db: Database session
            order_id: ID of the order
            order_item_id: ID of the order item to update
            item_data: Updated item data
            user_id: Optional user ID to verify ownership
            
        Returns:
            Updated order item if successful, False if order or item not found
        """
        # Find order (for ownership verification)
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        db_order = query.first()
        
        if not db_order:
            return False
            
        # Can only update if order is pending
        if db_order.order_status != OrderStatus.pending.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only update items for orders in 'pending' status"
            )
        
        # Find order item
        db_item = db.query(OrderItem).filter(
            OrderItem.order_item_id == order_item_id,
            OrderItem.order_id == order_id
        ).first()
        
        if not db_item:
            return False
            
        # Get associated product
        product = db.query(Product).filter(Product.product_id == db_item.product_id).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {db_item.product_id} not found"
            )
        
        # Calculate quantity difference
        if item_data.quantity is not None:
            quantity_diff = item_data.quantity - db_item.quantity
            
            # Check if enough stock for increase
            if quantity_diff > 0 and product.stock_quantity < quantity_diff:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name} (ID: {product.product_id})"
                )
                
            # Update product stock
            product.stock_quantity -= quantity_diff
            
            # Update order item
            db_item.quantity = item_data.quantity
            db_item.subtotal = db_item.price_per_unit * db_item.quantity
            
            # Update order total
            db_order.total_amount = sum(item.subtotal for item in db_order.order_items)
        
        db.commit()
        db.refresh(db_item)
        
        return db_item
    
    @staticmethod
    def update_payment_status(db: Session, order_id: int, payment_status: PaymentStatus, 
                              payment_details: Optional[Dict] = None, user_id: Optional[int] = None) -> Union[Order, bool]:
        """
        Update the payment status of an order
        
        Args:
            db: Database session
            order_id: ID of the order
            payment_status: New payment status
            payment_details: Optional details about the payment
            user_id: Optional user ID to verify ownership
            
        Returns:
            Updated order if successful, False if order not found
        """
        # Find order
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        db_order = query.first()
        
        if not db_order:
            return False
        
        # Update payment status
        db_order.payment_status = payment_status.value
        
        # Store payment details if provided
        if payment_details:
            # Assuming we have a JSON column for payment_details
            # If not, you might need to create a separate table
            db_order.payment_details = payment_details
            
        # If payment is now confirmed, update order status to processing
        if payment_status == PaymentStatus.paid and db_order.order_status == OrderStatus.pending.value:
            db_order.order_status = OrderStatus.processing.value
        
        db.commit()
        db.refresh(db_order)
        
        return db_order
    
    @staticmethod
    def cancel_order(db: Session, order_id: int, reason: str, user_id: Optional[int] = None) -> Union[Order, bool]:
        """
        Cancel an order
        
        Args:
            db: Database session
            order_id: ID of the order to cancel
            reason: Reason for cancellation
            user_id: Optional user ID to verify ownership
            
        Returns:
            Updated order if successful, False if order not found
        """
        # Find order
        query = db.query(Order).filter(Order.order_id == order_id)
        
        if user_id is not None:
            query = query.filter(Order.user_id == user_id)
            
        db_order = query.first()
        
        if not db_order:
            return False
            
        # Can only cancel if not already delivered
        if db_order.order_status == OrderStatus.delivered.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel an order that has been delivered"
            )
        
        # Update order status
        db_order.order_status = OrderStatus.cancelled.value
        db_order.notes = f"{db_order.notes or ''}\nCancellation reason: {reason}".strip()
        
        # Restore stock for all items
        for item in db_order.order_items:
            product = db.query(Product).filter(Product.product_id == item.product_id).first()
            if product:
                product.stock_quantity += item.quantity
        
        db.commit()
        db.refresh(db_order)
        
        return db_order