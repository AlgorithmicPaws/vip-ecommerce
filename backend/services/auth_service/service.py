from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from typing import Optional

from models import User
from core.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from .schemas import Token, LoginRequest

class AuthService:
    """Service for handling authentication operations"""
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password
        
        Args:
            db: Database session
            email: User email
            password: Plain password
            
        Returns:
            User object if authentication succeeds, None otherwise
        """
        # Importing here to avoid circular imports
        from services.user_service.service import UserService
        
        # Get user by email
        user = UserService.get_user_by_email(db, email)
        
        # Check if user exists and password is correct
        if not user or not verify_password(password, user.password_hash):
            return None
            
        return user
    
    @staticmethod
    def create_token(user: User) -> str:
        """
        Create an access token for a user
        
        Args:
            user: User object
            
        Returns:
            JWT access token
        """
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
    
    @staticmethod
    def login(db: Session, login_data: LoginRequest) -> Token:
        """
        Process login request and create an access token
        
        Args:
            db: Database session
            login_data: Login credentials
            
        Returns:
            Token with access token and user info
            
        Raises:
            HTTPException: If authentication fails
        """
        # Authenticate the user
        user = AuthService.authenticate_user(db, login_data.email, login_data.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token = AuthService.create_token(user)
        
        # Return token with user info
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user
        )