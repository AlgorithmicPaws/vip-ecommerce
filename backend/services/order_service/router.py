from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from services.auth_service.middleware import get_current_user, get_current_active_user
from models import User, Order
from .schemas import (
    OrderCreate, OrderResponse, OrderUpdate, OrderStatus, PaymentStatus,
    OrderItemUpdate, PaymentReceiptInfo, OrderCancellation
)
from .service import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

# User endpoints (require authentication)

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new order.
    Requires authentication.
    """
    try:
        order = OrderService.create_order(
            db=db,
            order_data=order_data,
            user_id=current_user.user_id
        )
        
        # The response is already prepared in the service layer
        return order
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )

@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all orders for the authenticated user.
    Requires authentication.
    """
    orders = OrderService.get_user_orders(
        db=db,
        user_id=current_user.user_id,
        skip=skip,
        limit=limit
    )
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific order by ID.
    Requires authentication and order ownership.
    """
    order = OrderService.get_order_by_id(
        db=db,
        order_id=order_id,
        user_id=current_user.user_id
    )
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
        
    return order

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an order.
    Requires authentication and order ownership.
    Note: Only pending orders can be updated.
    """
    updated_order = OrderService.update_order(
        db=db,
        order_id=order_id,
        order_data=order_data,
        user_id=current_user.user_id
    )
    
    if not updated_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
        
    # Get the order with all the response fields
    return OrderService.get_order_by_id(db=db, order_id=order_id, user_id=current_user.user_id)

@router.put("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    cancellation_data: OrderCancellation,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancel an order.
    Requires authentication and order ownership.
    Note: Only orders that haven't been delivered can be cancelled.
    """
    cancelled_order = OrderService.cancel_order(
        db=db,
        order_id=order_id,
        reason=cancellation_data.reason,
        user_id=current_user.user_id
    )
    
    if not cancelled_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
        
    # Get the order with all the response fields
    return OrderService.get_order_by_id(db=db, order_id=order_id, user_id=current_user.user_id)