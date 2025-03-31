from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from services.auth_service.middleware import get_current_user, get_current_seller
from models import User, Seller
from .schemas import (
    ProductCreate, ProductResponse, ProductUpdate,
    ProductImageCreate, ProductImageResponse
)
from .service import ProductService

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

# Public endpoints (no authentication required)

@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    seller_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all products with optional filtering.
    """
    products = ProductService.get_products(
        db=db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        seller_id=seller_id
    )
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific product by ID.
    """
    product = ProductService.get_product_by_id(db=db, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# Seller-only endpoints (require seller authentication)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Create a new product.
    Requires seller authentication.
    """
    try:
        return ProductService.create_product(
            db=db,
            seller_id=seller.seller_id,
            product_data=product_data
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create product: {str(e)}"
        )

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Update a product.
    Requires seller authentication and ownership of the product.
    """
    updated_product = ProductService.update_product(
        db=db,
        product_id=product_id,
        seller_id=seller.seller_id,
        product_data=product_data
    )
    
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or you don't have permission to update it"
        )
    
    return updated_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Delete a product.
    Requires seller authentication and ownership of the product.
    """
    result = ProductService.delete_product(
        db=db,
        product_id=product_id,
        seller_id=seller.seller_id
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or you don't have permission to delete it"
        )

@router.post("/{product_id}/images", response_model=ProductImageResponse)
def add_product_image(
    product_id: int,
    image_data: ProductImageCreate,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Add an image to a product.
    Requires seller authentication and ownership of the product.
    """
    result = ProductService.add_product_image(
        db=db,
        product_id=product_id,
        seller_id=seller.seller_id,
        image_data=image_data
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or you don't have permission to modify it"
        )
    
    return result

@router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image(
    product_id: int,
    image_id: int,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Delete an image from a product.
    Requires seller authentication and ownership of the product.
    """
    result = ProductService.delete_product_image(
        db=db,
        image_id=image_id,
        seller_id=seller.seller_id
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found or you don't have permission to delete it"
        )

# Seller management routes - get seller's own products

@router.get("/seller/my-products", response_model=List[ProductResponse])
def get_seller_products(
    skip: int = 0,
    limit: int = 100,
    seller: Seller = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """
    Get all products for the authenticated seller.
    Requires seller authentication.
    """
    products = ProductService.get_products(
        db=db,
        skip=skip,
        limit=limit,
        seller_id=seller.seller_id
    )
    return products