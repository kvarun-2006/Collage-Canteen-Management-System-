import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.models import User, Community, CommunityMembership

async def list_all():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.community_db
    await init_beanie(database=db, document_models=[User, Community, CommunityMembership])
    
    users = await User.find_all().to_list()
    
    print("\n=== ALL REGISTERED USERS IN DATABASE ===")
    for u in users:
        print(f"Email: {u.email} | Name: {u.full_name} | ID: {u.id}")
        
if __name__ == "__main__":
    asyncio.run(list_all())
