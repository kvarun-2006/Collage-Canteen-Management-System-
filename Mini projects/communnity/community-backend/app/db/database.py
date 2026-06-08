import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "community_db")

client = AsyncIOMotorClient(DATABASE_URL)
db = client[DATABASE_NAME]

async def init_db():
    from app.models.models import User, Community, CommunityMembership, JoinRequest, Meetup
    await init_beanie(database=db, document_models=[User, Community, CommunityMembership, JoinRequest, Meetup])
