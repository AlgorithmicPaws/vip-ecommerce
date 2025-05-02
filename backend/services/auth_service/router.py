from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from core.database import get_db
from models import User
from .schemas import LoginRequest, Token
from .service import AuthService
from .middleware import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)
# Add a specific OPTIONS handler for the registration endpoint
@router.options("/", include_in_schema=False)
async def options_user_create():
    return {}

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login_json(
    login_data: LoginRequest, 
    db: Session = Depends(get_db)
):
    """
    Authenticate a user using JSON request and return an access token.
    
    - **email**: User email address
    - **password**: User password
    
    Returns a token that can be used in the Authorization header
    for protected endpoints.
    """
    return AuthService.login(db=db, login_data=login_data)

@router.post("/token", response_model=Token, status_code=status.HTTP_200_OK)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token endpoint.
    
    This endpoint is primarily for Swagger UI authentication.
    For API integrations, consider using the /login endpoint.
    
    - **username**: User email address (sent as username in form)
    - **password**: User password
    
    Returns a token that can be used in the Authorization header
    for protected endpoints.
    """
    # Convert the form data to our expected login format
    login_data = LoginRequest(
        email=form_data.username,  # Use username field as email
        password=form_data.password
    )
    
    return AuthService.login(db=db, login_data=login_data)

@router.get("/me", response_model=dict)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Requires a valid JWT token in the Authorization header.
    """
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name
    }

@router.post("/verify", response_model=dict)
def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verify if a token is valid.
    
    Requires a valid JWT token in the Authorization header.
    Returns user_id if token is valid.
    """
    return {"valid": True, "user_id": current_user.user_id}
