from fastapi import APIRouter, HTTPException, status
from app.models.models import User
from app.schemas.schemas import UserCreate, UserOut, Token
from app.core.security import create_access_token

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate):
    user = await User.find_one(User.email == user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(**user_in.model_dump())
    await new_user.insert()
    return new_user

@router.post("/login", response_model=Token)
async def login(email: str):
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
