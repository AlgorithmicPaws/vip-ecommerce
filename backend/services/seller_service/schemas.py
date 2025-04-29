from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SellerBase(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=255)
    business_description: Optional[str] = None
    id_type: str = Field(..., min_length=1, max_length=50)
    number_id: str = Field(..., min_length=1, max_length=100)

class SellerCreate(SellerBase):
    """Schema for registering a new seller (for existing users)"""
    pass

class SellerResponse(SellerBase):
    """Schema for seller response with additional fields from database"""
    seller_id: int
    user_id: int
    
    class Config:
        from_attributes = True

class SellerUpdate(BaseModel):
    """Schema for updating seller information"""
    business_name: Optional[str] = Field(None, min_length=1, max_length=255)
    business_description: Optional[str] = None
    id_type: Optional[str] = Field(None, min_length=1, max_length=50)
    number_id: Optional[str] = Field(None, min_length=1, max_length=100)
    
    class Config:
        from_attributes = True

class SellerFilterItem(BaseModel):
    """Schema specifically for listing sellers in filters (ID and Name)."""
    seller_id: int
    business_name: str

    class Config:
        orm_mode = True # or from_attributes = True in newer Pydantic V1 versions
