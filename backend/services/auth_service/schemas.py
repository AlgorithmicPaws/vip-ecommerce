from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from services.user_service.schemas import UserResponse

class TokenData(BaseModel):
    """Schema for JWT token payload data"""
    email: Optional[str] = None
    roles: Optional[List[str]] = None
    exp: Optional[datetime] = None

class UserRoleInfo(BaseModel):
    """Schema for user with role information"""
    user: UserResponse
    roles: List[str]
    is_seller: bool

class Token(BaseModel):
    """Schema for authentication response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    roles: List[str] = []
    is_seller: bool = False

class LoginRequest(BaseModel):
    """Schema for JSON login request"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password", min_length=1)