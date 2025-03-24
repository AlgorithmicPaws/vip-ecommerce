from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: int
    created_at: datetime
    
    class Config:
        # Updated to use from_orm - but we're not using it directly in our implementation
        # Keeping this for future reference if you want to use .from_orm() method
        from_attributes = True  # In newer Pydantic versions, replace orm_mode=True