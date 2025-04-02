from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from services.auth_service.middleware import get_current_seller
from models import Category, Seller
from .schemas import CategoryCreate, CategoryResponse

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

# Public endpoint to get all categories
@router.get("/", response_model=List[CategoryResponse])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all product categories.
    """
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific category by ID.
    """
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

# Seller/Admin only endpoints
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate,
    seller: Seller = Depends(get_current_seller),  # Requires seller role
    db: Session = Depends(get_db)
):
    """
    Create a new product category.
    Requires seller authentication (could be restricted to admin in the future).
    """
    # Check if category with this name already exists
    existing_category = db.query(Category).filter(
        Category.name == category_data.name
    ).first()
    
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    # Create new category
    db_category = Category(name=category_data.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryCreate,
    seller: Seller = Depends(get_current_seller),  # Requires seller role
    db: Session = Depends(get_db)
):
    """
    Update a category.
    Requires seller authentication (could be restricted to admin in the future).
    """
    # Find category
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if new name already exists
    if category_data.name != category.name:
        existing_category = db.query(Category).filter(
            Category.name == category_data.name
        ).first()
        
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )
    
    # Update category
    category.name = category_data.name
    db.commit()
    db.refresh(category)
    
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    seller: Seller = Depends(get_current_seller),  # Requires seller role
    db: Session = Depends(get_db)
):
    """
    Delete a category.
    Requires seller authentication (could be restricted to admin in the future).
    """
    # Find category
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Check if category is in use
    if category.products:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category that is assigned to products"
        )
    
    # Delete category
    db.delete(category)
    db.commit()