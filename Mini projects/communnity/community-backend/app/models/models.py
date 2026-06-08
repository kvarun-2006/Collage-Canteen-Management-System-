from datetime import datetime, timezone
from beanie import Document, Indexed
from pydantic import Field, EmailStr
from typing import Optional, List
import enum

def utcnow():
    return datetime.now(timezone.utc)

class ApprovalType(str, enum.Enum):
    AUTO_APPROVE = "AUTO_APPROVE"
    ADMIN_APPROVAL = "ADMIN_APPROVAL"

class RoleType(str, enum.Enum):
    MEMBER = "MEMBER"
    ADMIN = "ADMIN"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class User(Document):
    full_name: str
    profile_picture_url: str
    profession: str
    current_organization: str
    city: str
    bio: str
    join_reason: str
    contribution_statement: str
    linkedin_url: str
    email: Indexed(EmailStr, unique=True)
    instagram_url: Optional[str] = None
    website_url: Optional[str] = None
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    class Settings:
        name = "users"

class Community(Document):
    name: Indexed(str)
    logo_url: str
    cover_image_url: str
    description: str
    category: Indexed(str)
    city: Indexed(str)
    website: Optional[str] = None
    whatsapp_link: Optional[str] = None
    discord_link: Optional[str] = None
    instagram_link: Optional[str] = None
    rules: str
    approval_type: ApprovalType
    creator_id: str
    member_count: int = 0
    upcoming_meetups_count: int = 0

    class Settings:
        name = "communities"

class CommunityMembership(Document):
    user_id: str
    community_id: str
    role: RoleType
    joined_at: datetime = Field(default_factory=utcnow)

    class Settings:
        name = "community_memberships"
        indexes = [
            [("user_id", 1), ("community_id", 1)],
        ]

class JoinRequest(Document):
    user_id: str
    community_id: str
    why_join: str
    contribution: str
    status: RequestStatus = RequestStatus.PENDING
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    class Settings:
        name = "join_requests"

class Meetup(Document):
    community_id: str
    title: str
    description: str
    date: datetime
    location: str
    attendee_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=utcnow)

    class Settings:
        name = "meetups"
