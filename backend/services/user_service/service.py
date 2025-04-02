from sqlalchemy.orm import Session
from typing import Optional, Union, List

from models import User
from core.security import get_password_hash
from .schemas import UserCreate, UserUpdate

class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get a user by their email address"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get a user by their ID"""
        return db.query(User).filter(User.user_id == user_id).first()
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user with hashed password"""
        hashed_password = get_password_hash(user.password)
        
        db_user = User(
            email=user.email,
            password_hash=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            address=user.address
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Union[User, bool]:
        """
        Update user information
        
        Args:
            db: Database session
            user_id: ID of the user to update
            user_data: New user data
            
        Returns:
            Updated user object if successful, False if user not found
        """
        db_user = db.query(User).filter(User.user_id == user_id).first()
        if not db_user:
            return False
        
        # Create a copy of the update data without the email field
        # Email changes are not allowed
        update_data = user_data.dict(exclude_unset=True, exclude={"email"})
        
        # Handle password update
        if "password" in update_data:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
        
        for key, value in update_data.items():
            if hasattr(db_user, key):
                setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """
        Delete a user by ID
        
        Args:
            db: Database session
            user_id: ID of the user to delete
            
        Returns:
            True if successful, False if user not found
        """
        db_user = db.query(User).filter(User.user_id == user_id).first()
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        
        return True