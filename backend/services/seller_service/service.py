from sqlalchemy.orm import Session
from typing import Optional, Union

from models import Seller, User
from .schemas import SellerCreate, SellerUpdate

class SellerService:
    @staticmethod
    def get_seller_by_user_id(db: Session, user_id: int) -> Optional[Seller]:
        """Get a seller by user ID"""
        return db.query(Seller).filter(Seller.user_id == user_id).first()
    
    @staticmethod
    def get_seller_by_id(db: Session, seller_id: int) -> Optional[Seller]:
        """Get a seller by seller ID"""
        return db.query(Seller).filter(Seller.seller_id == seller_id).first()
    
    @staticmethod
    def create_seller(db: Session, user_id: int, seller_data: SellerCreate) -> Seller:
        """Create a new seller profile for an existing user"""
        # Check if user exists
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Check if seller profile already exists
        existing_seller = db.query(Seller).filter(Seller.user_id == user_id).first()
        if existing_seller:
            raise ValueError("Seller profile already exists for this user")
        
        # Create new seller
        db_seller = Seller(
            user_id=user_id,
            business_name=seller_data.business_name,
            business_description=seller_data.business_description,
            id_type=seller_data.id_type,
            number_id=seller_data.number_id
        )
        
        db.add(db_seller)
        db.commit()
        db.refresh(db_seller)
        
        return db_seller
    
    @staticmethod
    def update_seller(db: Session, seller_id: int, seller_data: SellerUpdate) -> Union[Seller, bool]:
        """Update seller information"""
        db_seller = db.query(Seller).filter(Seller.seller_id == seller_id).first()
        if not db_seller:
            return False
        
        # Update fields that are present in the update data
        update_data = seller_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(db_seller, key):
                setattr(db_seller, key, value)
        
        db.commit()
        db.refresh(db_seller)
        
        return db_seller
    
    @staticmethod
    def delete_seller(db: Session, seller_id: int) -> bool:
        """Delete a seller profile"""
        db_seller = db.query(Seller).filter(Seller.seller_id == seller_id).first()
        if not db_seller:
            return False
        
        db.delete(db_seller)
        db.commit()
        
        return True