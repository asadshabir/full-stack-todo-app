from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select
from datetime import datetime

from utils.database import get_session
from utils.auth import hash_password, verify_password, create_access_token
from models.user import User
from schemas.user import UserSignup, UserSignin, UserResponse, Token
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Cookie settings for JWT token
COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 24 * 60 * 60  # 24 hours in seconds


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Create a new user account.

    Args:
        user_data: User registration data (email, password, optional name)
        response: FastAPI response object to set cookies
        session: Database session

    Returns:
        Token: JWT access token and user information

    Raises:
        HTTPException: 400 if email already exists
    """
    try:
        # Check if user already exists
        statement = select(User).where(User.email == user_data.email)
        existing_user = session.exec(statement).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash password
        password_hash = hash_password(user_data.password)

        # Create new user
        new_user = User(
            email=user_data.email,
            password_hash=password_hash,
            name=user_data.name
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Generate JWT token
        access_token = create_access_token(data={"sub": str(new_user.id)})

        # Set JWT token as HTTP-only cookie
        response.set_cookie(
            key=COOKIE_NAME,
            value=access_token,
            httponly=True,
            max_age=COOKIE_MAX_AGE,
            samesite="lax",
            secure=True
        )

        # Return token and user data
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(new_user)
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[AUTH ERROR] Signup failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )


@router.post("/signin", response_model=Token)
async def signin(
    user_data: UserSignin,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and generate JWT token.

    Args:
        user_data: User login credentials (email, password)
        response: FastAPI response object to set cookies
        session: Database session

    Returns:
        Token: JWT access token and user information

    Raises:
        HTTPException: 401 if credentials are invalid
    """
    try:
        # Find user by email
        statement = select(User).where(User.email == user_data.email)
        user = session.exec(statement).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not verify_password(user_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Update last login timestamp
        user.updated_at = datetime.utcnow()
        session.add(user)
        session.commit()
        session.refresh(user)

        # Generate JWT token
        access_token = create_access_token(data={"sub": str(user.id)})

        # Set JWT token as HTTP-only cookie
        response.set_cookie(
            key=COOKIE_NAME,
            value=access_token,
            httponly=True,
            max_age=COOKIE_MAX_AGE,
            samesite="lax",
            secure=True
        )

        # Return token and user data
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[AUTH ERROR] Signin failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signin failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.

    Args:
        current_user: Current authenticated user from JWT token

    Returns:
        UserResponse: Current user's information
    """
    return UserResponse.model_validate(current_user)


@router.post("/signout", status_code=status.HTTP_200_OK)
async def signout(
    response: Response,
    current_user: User = Depends(get_current_user)
):
    """
    Logout the current user.

    Note: Since we're using stateless JWT tokens, this endpoint primarily
    serves as a client-side indicator to discard the token. The token will
    remain valid until expiration.

    Args:
        response: FastAPI response object to clear cookies
        current_user: Current authenticated user from JWT token

    Returns:
        dict: Success message
    """
    # Clear the access token cookie
    response.delete_cookie(key=COOKIE_NAME, samesite="lax")

    return {"message": "Successfully signed out", "user_id": str(current_user.id)}
