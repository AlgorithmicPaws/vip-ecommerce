from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from models import User
from .schemas import UserCreate, UserResponse, UserUpdate
from .service import UserService
from services.auth_service.middleware import get_current_user, get_current_active_user

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

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_active_user)):
    """
    Get the currently authenticated user's information.
    Requires a valid JWT token in the Authorization header.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update the currently authenticated user's details.
    Requires a valid JWT token in the Authorization header.
    """
    result = UserService.update_user(db=db, user_id=current_user.user_id, user_data=user_data)
    
    if result is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered by another user"
        )
    
    return result