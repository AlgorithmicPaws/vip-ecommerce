import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import User

class TestUserEndpoints:
    def test_create_user_success(self, client: TestClient, test_db: Session):
        """Test successful user creation"""
        # Define test user data
        user_data = {
            "email": "test@example.com",
            "password": "securepassword123",
            "first_name": "Test",
            "last_name": "User",
            "phone": "1234567890",
            "address": "123 Test St, Test City"
        }
        
        # Make POST request to create user
        response = client.post("/users/", json=user_data)
        
        # Check response
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["first_name"] == user_data["first_name"]
        assert data["last_name"] == user_data["last_name"]
        assert data["phone"] == user_data["phone"]
        assert data["address"] == user_data["address"]
        assert "user_id" in data
        assert "created_at" in data
        assert "password" not in data  # Password should not be returned
        
        # Verify user is in database
        db_user = test_db.query(User).filter(User.email == user_data["email"]).first()
        assert db_user is not None
        assert db_user.email == user_data["email"]
        assert db_user.password_hash != user_data["password"]  # Password should be hashed
    
    def test_create_user_duplicate_email(self, client: TestClient, test_db: Session):
        """Test user creation with duplicate email"""
        # Create a user first
        user_data = {
            "email": "duplicate@example.com",
            "password": "password123",
            "first_name": "Duplicate",
            "last_name": "User",
            "phone": "1234567890",
            "address": "123 Test St"
        }
        
        # Create first user
        response = client.post("/users/", json=user_data)
        assert response.status_code == 201
        
        # Try to create user with same email
        response = client.post("/users/", json=user_data)
        
        # Check that it fails with 400 Bad Request
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    def test_create_user_invalid_data(self, client: TestClient):
        """Test user creation with invalid data"""
        # Missing required fields
        user_data = {
            "email": "invalid@example.com",
            # Missing password, first_name, last_name
        }
        
        response = client.post("/users/", json=user_data)
        assert response.status_code == 422  # Unprocessable Entity