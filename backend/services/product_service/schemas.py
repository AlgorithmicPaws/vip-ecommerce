from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    category_id: int
    
    class Config:
        from_attributes = True

class ProductImageBase(BaseModel):
    image_url: str = Field(..., min_length=1)
    is_primary: bool = False
    display_order: Optional[int] = None

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    image_id: int
    product_id: int
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    stock_quantity: int = Field(..., ge=0)

class ProductCreate(ProductBase):
    category_ids: List[int] = []
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    category_ids: Optional[List[int]] = None
    
    @field_validator('price')
    @classmethod
    def validate_price(cls, v):
        if v is not None:
            return Decimal(str(v)).quantize(Decimal('0.01'))
        return v

class ProductResponse(ProductBase):
    product_id: int
    seller_id: int
    created_at: datetime
    updated_at: datetime
    categories: List[CategoryResponse] = []
    images: List[ProductImageResponse] = []
    
    class Config:
        from_attributes = True