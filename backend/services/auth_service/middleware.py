from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import SECRET_KEY, ALGORITHM
from models import User, Seller

# Define OAuth2 scheme with the correct token URL for Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        User: The authenticated user
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
        # Import here to avoid circular imports
        from services.user_service.service import UserService
        
        # Token valid, get user
        user = UserService.get_user_by_email(db, email=email)
        if user is None:
            raise credentials_exception
            
        return user
        
    except JWTError:
        raise credentials_exception

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to get the current user and verify they are active
    Can be extended to check for account disabled status
    
    Args:
        current_user: The authenticated user
        
    Returns:
        User: The active authenticated user
        
    Raises:
        HTTPException: If user is inactive/disabled
    """
    # Example check (extend based on your User model)
    # if current_user.disabled:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Inactive user"
    #     )
    return current_user

def get_current_seller(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Seller:
    """
    Dependency to verify the current user has a seller profile.
    This checks both the JWT token for seller role and the database
    for the seller profile.
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        Seller: The seller profile of the authenticated user
        
    Raises:
        HTTPException: If user is not a seller
    """
    # First, authenticate the user
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    forbidden_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Seller profile required"
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        roles: list = payload.get("roles", [])
        
        if email is None:
            raise credentials_exception
            
        # Check if seller role is in the token
        if "seller" not in roles:
            raise forbidden_exception
            
        # Import here to avoid circular imports
        from services.user_service.service import UserService
        
        # Get user
        user = UserService.get_user_by_email(db, email=email)
        if user is None:
            raise credentials_exception
            
        # Get seller profile
        seller = db.query(Seller).filter(Seller.user_id == user.user_id).first()
        if not seller:
            raise forbidden_exception
            
        return seller
        
    except JWTError:
        raise credentials_exception

def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to verify the current user has admin privileges
    
    Args:
        current_user: The authenticated user
        
    Returns:
        User: The authenticated admin user
        
    Raises:
        HTTPException: If user is not an admin
    """
    # We need to implement this when the is_admin field is added to User model
    # For now, it's just a placeholder
    # if not current_user.is_admin:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Insufficient permissions"
    #     )
    return current_user