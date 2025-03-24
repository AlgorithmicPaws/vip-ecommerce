import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from core.database import get_db
from models import Base

# Create in-memory SQLite database for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db():
    """
    Create a fresh database for each test.
    """
    # Create in-memory SQLite engine
    engine = create_engine(
        TEST_SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Connect and yield the database
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def client(test_db):
    """
    Create a test client using the test database session.
    """
    # Override the get_db dependency
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    # Apply the dependency override
    app.dependency_overrides[get_db] = override_get_db
    
    # Create and return the test client
    with TestClient(app) as c:
        yield c
    
    # Clear dependency overrides after test is done
    app.dependency_overrides = {}