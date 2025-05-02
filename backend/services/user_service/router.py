from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models import User
from .schemas import UserCreate, UserResponse, UserUpdate, PasswordChangeRequest
from .service import UserService
from services.auth_service.middleware import get_current_user, get_current_active_user
from core.security import verify_password

router = APIRouter(
    prefix="/users",
    tags=["users"]
)
# Add a specific OPTIONS handler for the registration endpoint
@router.options("/", include_in_schema=False)
async def options_user_create():
    return {}

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
    Note: Email address cannot be changed.
    """
    # Check if trying to change email
    if user_data.email is not None and user_data.email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address cannot be changed"
        )
    
    result = UserService.update_user(db=db, user_id=current_user.user_id, user_data=user_data)
    
    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return result

@router.put("/me/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change the currently authenticated user's password.
    Requires a valid JWT token in the Authorization header and current password.
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    user_data = UserUpdate(password=password_data.new_password)
    
    result = UserService.update_user(db=db, user_id=current_user.user_id, user_data=user_data)
    
    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Password updated successfully"}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete the currently authenticated user's account.
    Requires a valid JWT token in the Authorization header.
    """
    result = UserService.delete_user(db=db, user_id=current_user.user_id)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting user account"
        )
