from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from services.auth_service.middleware import get_current_user
from models import User, Seller
from services.auth_service.schemas import UserRoleInfo

router = APIRouter(
    prefix="/user-info",
    tags=["user information"]
)

@router.get("/me", response_model=UserRoleInfo)
def get_user_with_roles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user information including roles.
    Requires authentication.
    """
    # Check if user is a seller
    seller = db.query(Seller).filter(Seller.user_id == current_user.user_id).first()
    
    # Define roles
    roles = ["user"]
    if seller:
        roles.append("seller")
        
    # Add admin role if needed in the future
    # if current_user.is_admin:
    #     roles.append("admin")
    
    return UserRoleInfo(
        user=current_user,
        roles=roles,
        is_seller=seller is not None
    )   