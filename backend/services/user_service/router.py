from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Updated import path
from core.database import get_db
from models import User
from .schemas import UserCreate, UserResponse
from .service import UserService

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user with the given details.
    """
    # Check if user with this email already exists
    db_user = UserService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create the new user
    return UserService.create_user(db=db, user=user)    