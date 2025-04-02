from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from typing import Optional, Dict, Any

from models import User, Seller
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
    def get_token_data(db: Session, user: User) -> Dict[str, Any]:
        """
        Get token data including user roles
        
        Args:
            db: Database session
            user: User object
            
        Returns:
            Dictionary with token claims including roles
        """
        # Basic token data
        token_data = {"sub": user.email}
        
        # Check if user is a seller
        seller = db.query(Seller).filter(Seller.user_id == user.user_id).first()
        
        # Add roles to token data
        roles = ["user"]
        if seller:
            roles.append("seller")
            
        # Add is_admin if we implement it later
        # if user.is_admin:
        #     roles.append("admin")
            
        token_data["roles"] = roles
        
        return token_data
    
    @staticmethod
    def create_token(db: Session, user: User) -> str:
        """
        Create an access token for a user with role information
        
        Args:
            db: Database session
            user: User object
            
        Returns:
            JWT access token
        """
        # Get token data with roles
        token_data = AuthService.get_token_data(db, user)
        
        # Create token with expiration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            data=token_data,
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
        
        # Create access token with role information
        access_token = AuthService.create_token(db, user)
        
        # Get role information
        token_data = AuthService.get_token_data(db, user)
        roles = token_data.get("roles", ["user"])
        is_seller = "seller" in roles
        
        # Return token with user info and roles
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user,
            roles=roles,
            is_seller=is_seller
        )