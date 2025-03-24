import pytest
from sqlalchemy.orm import Session

from services.user_service.service import UserService
from services.user_service.schemas import UserCreate
from models import User
from core.security import verify_password

class TestUserService:
    def test_create_user(self, test_db: Session):
        """Test user creation through service layer"""
        # Create user data
        user_data = UserCreate(
            email="service.test@example.com",
            password="testpassword123",
            first_name="Service",
            last_name="Test",
            phone="1234567890",
            address="123 Service Test St"
        )
        
        # Create user via service
        user = UserService.create_user(db=test_db, user=user_data)
        
        # Verify user was created
        assert user is not None
        assert user.email == user_data.email
        assert user.first_name == user_data.first_name
        assert user.last_name == user_data.last_name
        assert user.phone == user_data.phone
        assert user.address == user_data.address
        
        # Verify password was hashed
        assert user.password_hash != user_data.password
        assert verify_password(user_data.password, user.password_hash)
    
    def test_get_user_by_email(self, test_db: Session):
        """Test retrieving user by email"""
        # Create test user
        email = "get.by.email@example.com"
        user = User(
            email=email,
            password_hash="hashed_password",
            first_name="Get",
            last_name="Email",
            phone="1234567890",
            address="123 Get Email St"
        )
        test_db.add(user)
        test_db.commit()
        
        # Retrieve user by email
        db_user = UserService.get_user_by_email(db=test_db, email=email)
        
        # Verify correct user was retrieved
        assert db_user is not None
        assert db_user.email == email
        assert db_user.first_name == "Get"
        assert db_user.last_name == "Email"
        
        # Test with non-existent email
        non_existent = UserService.get_user_by_email(
            db=test_db, 
            email="nonexistent@example.com"
        )
        assert non_existent is None