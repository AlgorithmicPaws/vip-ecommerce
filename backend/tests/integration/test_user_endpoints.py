import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import User
from core.security import get_password_hash

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
            "password": "Password123",
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
    
    def test_get_current_user(self, client: TestClient, test_db: Session):
        """Test getting the current user's profile"""
        # Create a user
        user_data = {
            "email": "currentuser@example.com",
            "password": "Password123",
            "first_name": "Current",
            "last_name": "User"
        }
        
        # Register the user
        response = client.post("/users/", json=user_data)
        assert response.status_code == 201
        
        # Login to get token
        response = client.post("/auth/token", data={
            "username": user_data["email"],
            "password": user_data["password"]
        })
        
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Get current user profile with authorization
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/users/me", headers=headers)
        
        # Verify successful response
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["first_name"] == user_data["first_name"]
        assert data["last_name"] == user_data["last_name"]
    
    def test_update_current_user(self, client: TestClient, test_db: Session):
        """Test updating the current user's profile"""
        # Create a user
        user_data = {
            "email": "updateme@example.com",
            "password": "Password123",
            "first_name": "Update",
            "last_name": "Me"
        }
        
        # Register the user
        response = client.post("/users/", json=user_data)
        assert response.status_code == 201
        
        # Login to get token
        response = client.post("/auth/token", data={
            "username": user_data["email"],
            "password": user_data["password"]
        })
        
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Update current user profile with authorization
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "first_name": "Updated",
            "last_name": "User",
            "phone": "9876543210"
        }
        
        response = client.put("/users/me", json=update_data, headers=headers)
        
        # Verify successful response
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == update_data["first_name"]
        assert data["last_name"] == update_data["last_name"]
        assert data["phone"] == update_data["phone"]
        assert data["email"] == user_data["email"]  # Email should remain unchanged
    
    def test_update_email_forbidden(self, client: TestClient, test_db: Session):
        """Test updating email is prohibited"""
        # Create a user
        user_data = {
            "email": "noemail@example.com",
            "password": "Password123",
            "first_name": "No",
            "last_name": "Email"
        }
        
        # Register the user
        response = client.post("/users/", json=user_data)
        assert response.status_code == 201
        
        # Login to get token
        response = client.post("/auth/token", data={
            "username": user_data["email"],
            "password": user_data["password"]
        })
        
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Try to update email
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "email": "newemail@example.com"
        }
        
        response = client.put("/users/me", json=update_data, headers=headers)
        
        # Verify it fails with appropriate error
        assert response.status_code == 400
        assert "email address cannot be changed" in response.json()["detail"].lower()
    
    def test_delete_current_user(self, client: TestClient, test_db: Session):
        """Test deleting the current user's account"""
        # Create a user
        user_data = {
            "email": "deleteme@example.com",
            "password": "Password123",
            "first_name": "Delete",
            "last_name": "Me"
        }
        
        # Register the user
        response = client.post("/users/", json=user_data)
        assert response.status_code == 201
        
        # Login to get token
        response = client.post("/auth/token", data={
            "username": user_data["email"],
            "password": user_data["password"]
        })
        
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Delete current user with authorization
        headers = {"Authorization": f"Bearer {token}"}
        response = client.delete("/users/me", headers=headers)
        
        # Verify successful deletion
        assert response.status_code == 204
        
        # Try to login again - should fail
        response = client.post("/auth/token", data={
            "username": user_data["email"],
            "password": user_data["password"]
        })
        
        assert response.status_code == 401  # Unauthorized
    
    def test_protected_routes_unauthorized(self, client: TestClient):
        """Test accessing protected routes without authentication"""
        # Try to access me endpoint without token
        response = client.get("/users/me")
        assert response.status_code == 401
        
        # Try to update current user without token
        response = client.put("/users/me", json={"first_name": "Unauthorized"})
        assert response.status_code == 401
        
        # Try to delete current user without token
        response = client.delete("/users/me")
        assert response.status_code == 401