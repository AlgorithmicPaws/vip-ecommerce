# backend/tests/integration/test_auth_endpoints.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import User
from core.security import get_password_hash

class TestAuthEndpoints:
    def test_login_success(self, client: TestClient, test_db: Session):
        """Test successful login with valid credentials"""
        # Create a test user
        hashed_password = get_password_hash("testpassword123")
        test_user = User(
            email="auth.test@example.com",
            password_hash=hashed_password,
            first_name="Auth",
            last_name="Test",
            phone="1234567890",
            address="123 Auth Test St"
        )
        test_db.add(test_user)
        test_db.commit()
        
        # Test login
        login_data = {
            "username": "auth.test@example.com",
            "password": "testpassword123"
        }
        
        response = client.post("/auth/token", data=login_data)
        
        # Check successful response
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials"""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        response = client.post("/auth/token", data=login_data)
        
        # Should return 401 Unauthorized
        assert response.status_code == 401
        
    def test_protected_endpoint_with_token(self, client: TestClient, test_db: Session):
        """Test accessing a protected endpoint with a valid token"""
        # Create a test user
        hashed_password = get_password_hash("testpassword123")
        test_user = User(
            email="protected.test@example.com",
            password_hash=hashed_password,
            first_name="Protected",
            last_name="Test"
        )
        test_db.add(test_user)
        test_db.commit()
        
        # Login to get token
        login_data = {
            "username": "protected.test@example.com",
            "password": "testpassword123"
        }
        
        login_response = client.post("/auth/token", data=login_data)
        token = login_response.json()["access_token"]
        
        # Access protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/users/me", headers=headers)
        
        # Check successful response
        assert response.status_code == 200
        user_data = response.json()
        assert user_data["email"] == "protected.test@example.com"
    
    def test_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing a protected endpoint without a token"""
        response = client.get("/users/me")
        
        # Should return 401 Unauthorized
        assert response.status_code == 401
    
    def test_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing a protected endpoint with an invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/users/me", headers=headers)
        
        # Should return 401 Unauthorized
        assert response.status_code == 401