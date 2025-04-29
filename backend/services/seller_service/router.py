from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi import Query
from core.database import get_db
from models import User, Seller
from .schemas import SellerCreate, SellerResponse, SellerUpdate, SellerFilterItem
from .service import SellerService
from services.auth_service.middleware import get_current_user, get_current_active_user

router = APIRouter(
    prefix="/sellers",
    tags=["sellers"]
)

@router.post("/", response_model=SellerResponse, status_code=status.HTTP_201_CREATED)
def create_seller(
    seller_data: SellerCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Register as a seller (for existing users).
    Requires authentication.
    """
    try:
        seller = SellerService.create_seller(
            db=db,
            user_id=current_user.user_id,
            seller_data=seller_data
        )
        return seller
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
@router.get("/{seller_id}", response_model=SellerResponse)
def read_seller(
    seller_id: int, # Path parameter for the seller ID
    db: Session = Depends(get_db)
):
    """
    Retrieve details for a specific seller by their unique seller ID.
    This endpoint is publicly accessible.
    - Raises HTTP 404 if the seller with the given ID is not found.
    """
    seller = SellerService.get_seller_by_id(db=db, seller_id=seller_id)
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Seller with ID {seller_id} not found"
        )
    # Use SellerResponse which includes business_name etc.
    return seller
@router.get("/", response_model=List[SellerFilterItem])
def read_sellers(
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records to return (max 500)"), # Added limit with validation
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of sellers (ID and Business Name) primarily for filtering purposes.
    This endpoint is publicly accessible.
    Supports pagination using 'skip' and 'limit' query parameters.
    """
    try:
        sellers = SellerService.get_sellers(db=db, skip=skip, limit=limit)
        return sellers
    except Exception as e: # Catch unexpected errors
        print(f"Unexpected error reading sellers list: {e}") # Log the error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the list of sellers."
        )

@router.get("/me", response_model=SellerResponse)
def get_current_seller(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's seller profile.
    Requires authentication and seller role.
    """
    seller = SellerService.get_seller_by_user_id(db=db, user_id=current_user.user_id)
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller profile not found"
        )
    return seller

@router.put("/me", response_model=SellerResponse)
def update_current_seller(
    seller_data: SellerUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's seller profile.
    Requires authentication and seller role.
    """
    seller = SellerService.get_seller_by_user_id(db=db, user_id=current_user.user_id)
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller profile not found"
        )
    
    updated_seller = SellerService.update_seller(
        db=db,
        seller_id=seller.seller_id,
        seller_data=seller_data
    )
    
    if not updated_seller:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update seller profile"
        )
    
    return updated_seller

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_seller(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete current user's seller profile.
    Requires authentication and seller role.
    """
    seller = SellerService.get_seller_by_user_id(db=db, user_id=current_user.user_id)
    if not seller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seller profile not found"
        )
    
    result = SellerService.delete_seller(db=db, seller_id=seller.seller_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete seller profile"
        )