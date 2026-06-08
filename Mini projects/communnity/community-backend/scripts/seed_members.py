import asyncio
import os
import sys

# Add the project root to the python path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.models import User, Community, CommunityMembership, JoinRequest, Meetup, RoleType

async def seed():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.community_db
    await init_beanie(database=db, document_models=[User, Community, CommunityMembership, JoinRequest, Meetup])
    
    # Let's get the first community
    community = await Community.find_one()
    if not community:
        print("No communities found! Creating a default community...")
        community = Community(
            name="Global Hackers",
            description="A default community for testing.",
            category="Technology",
            city="Global",
            rules="Be nice.",
            approval_type="ADMIN_APPROVAL",
            logo_url="http://example.com/logo.png",
            cover_image_url="http://example.com/cover.png",
            creator_id="system"
        )
        await community.insert()

    users_data = [
        {"email": "alice@example.com", "full_name": "Alice Designer"},
        {"email": "bob@example.com", "full_name": "Bob Builder"},
        {"email": "charlie@example.com", "full_name": "Charlie Chaplin"},
        {"email": "diana@example.com", "full_name": "Diana Prince"},
        {"email": "eve@example.com", "full_name": "Eve Hacker"},
        {"email": "frank@example.com", "full_name": "Frank Ocean"},
        {"email": "grace@example.com", "full_name": "Grace Hopper"},
        {"email": "hank@example.com", "full_name": "Hank Pym"},
        {"email": "ivy@example.com", "full_name": "Ivy Poison"},
        {"email": "jack@example.com", "full_name": "Jack Sparrow"},
    ]

    for data in users_data:
        # Check if user exists
        user = await User.find_one(User.email == data["email"])
        if not user:
            user = User(
                email=data["email"],
                full_name=data["full_name"],
                profile_picture_url="http://example.com/pic.png",
                profession="Developer",
                current_organization="Acme Corp",
                city="New York",
                bio="I love coding",
                join_reason="Networking",
                contribution_statement="I can help organize events",
                linkedin_url="https://linkedin.com/in/test"
            )
            await user.insert()
        
        # Add to community
        membership = await CommunityMembership.find_one(
            CommunityMembership.user_id == str(user.id),
            CommunityMembership.community_id == str(community.id)
        )
        if not membership:
            membership = CommunityMembership(
                user_id=str(user.id),
                community_id=str(community.id),
                role=RoleType.MEMBER
            )
            await membership.insert()
            community.member_count += 1
    
    await community.save()
    print(f"Successfully seeded 10 members into community '{community.name}'")

if __name__ == "__main__":
    asyncio.run(seed())
