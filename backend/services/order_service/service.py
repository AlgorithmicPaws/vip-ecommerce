from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Union, Any
from fastapi import HTTPException, status
from decimal import Decimal
import json
import re

from models import Order, OrderItem, User, Product
from .schemas import OrderCreate, OrderUpdate, OrderItemUpdate, PaymentStatus, OrderStatus

class OrderService:
    @staticmethod
    def create_order(db: Session, order_data: OrderCreate, user_id: Optional[int] = None) -> Order:
        """
        Create a new order - compatible with existing database schema
        
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
        
        # Append billing address to notes if it's provided
        notes = order_data.notes or ""
        if order_data.billing_address:
            billing_address_str = (
                f"\nBilling Address: {order_data.billing_address.street}, "
                f"{order_data.billing_address.city}, {order_data.billing_address.state}, "
                f"{order_data.billing_address.zip_code}, {order_data.billing_address.country}"
            )
            notes += billing_address_str
        
        # Add payment status to notes
        payment_status_value = order_data.payment_status.value if hasattr(order_data, 'payment_status') and order_data.payment_status else "pending"
        notes += f"\nPayment Status: {payment_status_value}"
        
        # Create the order with ONLY the fields that exist in the database
        db_order = Order(
            user_id=effective_user_id,
            order_date=func.now(),
            total_amount=total_amount,
            shipping_address=order_data.shipping_address.dict(),  # Pass as dict, SQLAlchemy will convert
            payment_method=order_data.payment_method.value,
            order_status=OrderStatus.pending.value,
            notes=notes
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
        
        # Add required fields for response
        # Add payment_status attribute for the response
        setattr(db_order, 'payment_status', payment_status_value)
        
        # Ensure shipping_address is a dict (if it's stored as JSON string)
        if hasattr(db_order, 'shipping_address') and isinstance(db_order.shipping_address, str):
            try:
                db_order.shipping_address = json.loads(db_order.shipping_address)
            except:
                # If parsing fails, create a default dict
                db_order.shipping_address = {"address": db_order.shipping_address}
        
        # Add billing_address attribute for the response
        if order_data.billing_address:
            setattr(db_order, 'billing_address', order_data.billing_address.dict())
        
        return db_order
    
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
            
        order = query.first()
        
        # Add additional attributes needed for response
        if order:
            # Extract payment status from notes
            payment_status_match = re.search(r'Payment Status: (\w+)', order.notes or '')
            if payment_status_match:
                setattr(order, 'payment_status', payment_status_match.group(1))
            else:
                setattr(order, 'payment_status', "pending")
                
            # Ensure shipping_address is a dict
            if hasattr(order, 'shipping_address') and isinstance(order.shipping_address, str):
                try:
                    order.shipping_address = json.loads(order.shipping_address)
                except:
                    # If parsing fails, create a default dict
                    order.shipping_address = {"address": order.shipping_address}
                
            # Extract billing address from notes if present
            billing_address_match = re.search(r'Billing Address: (.+?)(?=\n|$)', order.notes or '')
            if billing_address_match:
                # Simple extraction, in a real app you'd parse this better
                billing_info = billing_address_match.group(1).split(',')
                if len(billing_info) >= 5:
                    billing_address = {
                        "street": billing_info[0].strip(),
                        "city": billing_info[1].strip(),
                        "state": billing_info[2].strip(),
                        "zip_code": billing_info[3].strip(),
                        "country": billing_info[4].strip()
                    }
                    setattr(order, 'billing_address', billing_address)
                    
        return order
        
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
        orders = db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
        
        # Process each order to add required attributes
        for order in orders:
            # Extract payment status from notes
            payment_status_match = re.search(r'Payment Status: (\w+)', order.notes or '')
            if payment_status_match:
                setattr(order, 'payment_status', payment_status_match.group(1))
            else:
                setattr(order, 'payment_status', "pending")
                
            # Ensure shipping_address is a dict
            if hasattr(order, 'shipping_address') and isinstance(order.shipping_address, str):
                try:
                    order.shipping_address = json.loads(order.shipping_address)
                except:
                    # If parsing fails, create a default dict
                    order.shipping_address = {"address": order.shipping_address}
        
        return orders