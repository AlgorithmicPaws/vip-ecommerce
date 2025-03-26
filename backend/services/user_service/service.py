from sqlalchemy.orm import Session

from models import User
from core.security import get_password_hash
from .schemas import UserCreate

class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        """Get a user by their email address"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create_user(db: Session, user: UserCreate):
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