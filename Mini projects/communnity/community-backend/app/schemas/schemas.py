from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId
from app.models.models import ApprovalType, RoleType, RequestStatus

class UserCreate(BaseModel):
    full_name: str
    profile_picture_url: str
    profession: str
    current_organization: str
    city: str
    bio: str
    join_reason: str
    contribution_statement: str
    linkedin_url: str
    email: EmailStr
    instagram_url: Optional[str] = None
    website_url: Optional[str] = None

class UserOut(UserCreate):
    id: PydanticObjectId
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CommunityCreate(BaseModel):
    name: str
    description: str
    category: str
    city: str
    website: Optional[str] = None
    whatsapp_link: Optional[str] = None
    discord_link: Optional[str] = None
    instagram_link: Optional[str] = None
    rules: str
    approval_type: ApprovalType

class CommunityOut(CommunityCreate):
    id: PydanticObjectId
    logo_url: str
    cover_image_url: str
    creator_id: str
    member_count: int
    upcoming_meetups_count: int = 0

    class Config:
        from_attributes = True
        populate_by_name = True

class JoinRequestCreate(BaseModel):
    why_join: str
    contribution: str

class JoinRequestStatusUpdate(BaseModel):
    status: RequestStatus

class JoinRequestOut(BaseModel):
    id: PydanticObjectId
    user_id: str
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    community_id: str
    why_join: str
    contribution: str
    status: RequestStatus
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class MeetupCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str

class MeetupOut(BaseModel):
    id: PydanticObjectId
    community_id: str
    title: str
    description: str
    date: datetime
    location: str
    attendee_count: int
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class MembershipOut(BaseModel):
    id: PydanticObjectId
    user_id: str
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    community_id: str
    role: RoleType
    joined_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
