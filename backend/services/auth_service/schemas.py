from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from services.user_service.schemas import UserResponse

class TokenData(BaseModel):
    """Schema for JWT token payload data"""
    email: Optional[str] = None
    exp: Optional[datetime] = None

class Token(BaseModel):
    """Schema for authentication response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    """Schema for JSON login request"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password", min_length=1)