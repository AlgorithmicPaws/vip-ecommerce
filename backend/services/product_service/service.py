from sqlalchemy.orm import Session
from typing import List, Optional, Union
from fastapi import HTTPException, status

from models import Product, Category, ProductImage, Seller
from .schemas import ProductCreate, ProductUpdate, ProductImageCreate

class ProductService:
    @staticmethod
    def get_products(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        seller_id: Optional[int] = None,
        category_id: Optional[int] = None
    ) -> List[Product]:
        """
        Get products with optional filters
        
        Args:
            db: Database session
            skip: Number of records to skip (pagination)
            limit: Max number of records to return
            seller_id: Filter by seller_id
            category_id: Filter by category_id
            
        Returns:
            List of products
        """
        query = db.query(Product)
        
        if seller_id is not None:
            query = query.filter(Product.seller_id == seller_id)
            
        if category_id is not None:
            query = query.join(Product.categories).filter(Category.category_id == category_id)
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
        """Get a product by ID"""
        return db.query(Product).filter(Product.product_id == product_id).first()
    
    @staticmethod
    def create_product(db: Session, seller_id: int, product_data: ProductCreate) -> Product:
        """
        Create a new product for a seller
        
        Args:
            db: Database session
            seller_id: ID of the seller creating the product
            product_data: Product data
            
        Returns:
            Created product
        """
        # Verify seller exists
        seller = db.query(Seller).filter(Seller.seller_id == seller_id).first()
        if not seller:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seller not found"
            )
        
        # Create product
        db_product = Product(
            seller_id=seller_id,
            name=product_data.name,
            description=product_data.description,
            price=product_data.price,
            stock_quantity=product_data.stock_quantity
        )
        
        # Add categories
        if product_data.category_ids:
            categories = db.query(Category).filter(
                Category.category_id.in_(product_data.category_ids)
            ).all()
            
            # Check if all categories exist
            if len(categories) != len(product_data.category_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more categories not found"
                )
                
            db_product.categories = categories
        
        # Add to session
        db.add(db_product)
        db.flush()  # Flush to get product_id
        
        # Add images
        for img_data in product_data.images:
            db_image = ProductImage(
                product_id=db_product.product_id,
                image_url=img_data.image_url,
                is_primary=img_data.is_primary,
                display_order=img_data.display_order
            )
            db.add(db_image)
        
        # Commit changes
        db.commit()
        db.refresh(db_product)
        
        return db_product
    
    @staticmethod
    def update_product(
        db: Session,
        product_id: int,
        seller_id: int,
        product_data: ProductUpdate
    ) -> Union[Product, bool]:
        """
        Update a product
        
        Args:
            db: Database session
            product_id: ID of the product to update
            seller_id: ID of the seller (for authorization)
            product_data: Updated product data
            
        Returns:
            Updated product if successful, False if product not found
        """
        # Get product and verify ownership
        db_product = db.query(Product).filter(
            Product.product_id == product_id,
            Product.seller_id == seller_id
        ).first()
        
        if not db_product:
            return False
        
        # Update basic fields
        update_data = product_data.dict(exclude_unset=True)
        
        # Handle category_ids separately
        category_ids = update_data.pop('category_ids', None)
        
        for key, value in update_data.items():
            if hasattr(db_product, key):
                setattr(db_product, key, value)
        
        # Update categories if provided
        if category_ids is not None:
            categories = db.query(Category).filter(
                Category.category_id.in_(category_ids)
            ).all()
            
            # Check if all categories exist
            if len(categories) != len(category_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more categories not found"
                )
                
            db_product.categories = categories
        
        # Commit changes
        db.commit()
        db.refresh(db_product)
        
        return db_product
    
    @staticmethod
    def delete_product(db: Session, product_id: int, seller_id: int) -> bool:
        """
        Delete a product
        
        Args:
            db: Database session
            product_id: ID of the product to delete
            seller_id: ID of the seller (for authorization)
            
        Returns:
            True if successful, False if product not found
        """
        # Get product and verify ownership
        db_product = db.query(Product).filter(
            Product.product_id == product_id,
            Product.seller_id == seller_id
        ).first()
        
        if not db_product:
            return False
        
        # Delete product
        db.delete(db_product)
        db.commit()
        
        return True
    
    @staticmethod
    def add_product_image(
        db: Session,
        product_id: int,
        seller_id: int,
        image_data: ProductImageCreate
    ) -> Union[ProductImage, bool]:
        """
        Add an image to a product
        
        Args:
            db: Database session
            product_id: ID of the product
            seller_id: ID of the seller (for authorization)
            image_data: Image data
            
        Returns:
            Created image if successful, False if product not found
        """
        # Verify product exists and belongs to seller
        db_product = db.query(Product).filter(
            Product.product_id == product_id,
            Product.seller_id == seller_id
        ).first()
        
        if not db_product:
            return False
        
        # Create image
        db_image = ProductImage(
            product_id=product_id,
            image_url=image_data.image_url,
            is_primary=image_data.is_primary,
            display_order=image_data.display_order
        )
        
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        
        return db_image
    
    @staticmethod
    def delete_product_image(
        db: Session,
        image_id: int,
        seller_id: int
    ) -> bool:
        """
        Delete a product image
        
        Args:
            db: Database session
            image_id: ID of the image to delete
            seller_id: ID of the seller (for authorization)
            
        Returns:
            True if successful, False if image not found
        """
        # Find image and verify product belongs to seller
        db_image = db.query(ProductImage).join(Product).filter(
            ProductImage.image_id == image_id,
            Product.seller_id == seller_id
        ).first()
        
        if not db_image:
            return False
        
        # Delete image
        db.delete(db_image)
        db.commit()
        
        return True