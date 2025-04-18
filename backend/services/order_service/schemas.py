from pydantic import BaseModel, Field, field_validator, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from enum import Enum

class OrderStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class PaymentMethod(str, Enum):
    credit_card = "credit_card"
    bank_transfer = "bank_transfer"
    cash_on_delivery = "cash_on_delivery"
    paypal = "paypal"

class PaymentStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    refunded = "refunded"
    cancelled = "cancelled"

class AddressBase(BaseModel):
    street: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    zip_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field(..., min_length=1, max_length=100)

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)
    price_per_unit: Decimal = Field(..., ge=0)

    @field_validator('price_per_unit')
    @classmethod
    def validate_price(cls, v):
        return Decimal(str(v)).quantize(Decimal('0.01'))

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    order_item_id: int
    order_id: int
    subtotal: Decimal

    class Config:
        from_attributes = True

class BankTransferInfo(BaseModel):
    bank_name: Optional[str] = None
    account_holder: Optional[str] = None
    account_number: Optional[str] = None
    account_type: Optional[str] = None
    reference: Optional[str] = None

class OrderCreate(BaseModel):
    user_id: Optional[int] = None  # Optional if available through auth token
    items: List[OrderItemCreate]
    shipping_address: AddressBase
    billing_address: Optional[AddressBase] = None
    payment_method: PaymentMethod
    notes: Optional[str] = None
    
    # Payment-specific fields
    payment_status: Optional[PaymentStatus] = PaymentStatus.pending
    bank_transfer_info: Optional[BankTransferInfo] = None

    @field_validator('items')
    @classmethod
    def validate_items(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one item is required')
        return v

class OrderUpdate(BaseModel):
    order_status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    payment_status: Optional[PaymentStatus] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    order_id: int
    user_id: int
    order_date: datetime
    total_amount: Decimal
    shipping_address: Dict[str, str]
    billing_address: Optional[Dict[str, str]] = None
    payment_method: str
    order_status: str
    payment_status: str
    tracking_number: Optional[str] = None
    notes: Optional[str] = None
    order_items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, ge=1)
    
    class Config:
        from_attributes = True

class PaymentReceiptInfo(BaseModel):
    payment_date: Optional[datetime] = None
    payment_reference: Optional[str] = None
    amount: Optional[Decimal] = None
    payer_name: Optional[str] = None
    notes: Optional[str] = None

class OrderCancellation(BaseModel):
    reason: str = Field(..., min_length=1)