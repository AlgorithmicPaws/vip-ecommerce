from pydantic import BaseModel, Field
from typing import Optional
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