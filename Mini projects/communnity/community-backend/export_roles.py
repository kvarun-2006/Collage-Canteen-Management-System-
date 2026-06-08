import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "community_db")

async def main():
    client = AsyncIOMotorClient(DATABASE_URL)
    db = client[DATABASE_NAME]
    
    with open("all_emails.txt", "r") as f:
        emails = [line.strip() for line in f if line.strip()]
        
    output = []
    
    for email in emails:
        user = await db.users.find_one({"email": email})
        if not user:
            output.append(f"{email}: Not Found")
            continue
            
        user_id = str(user["_id"])
        
        # find memberships
        memberships = await db.community_memberships.find({"user_id": user_id}).to_list(length=None)
        
        if not memberships:
            output.append(f"{email}: REGISTERED USER (No community memberships)")
        else:
            roles = []
            for mem in memberships:
                try:
                    comm_obj = await db.communities.find_one({"_id": ObjectId(mem["community_id"])})
                    comm_name = comm_obj["name"] if comm_obj else mem["community_id"]
                except:
                    comm_name = mem["community_id"]
                
                roles.append(f"[{mem['role']} in {comm_name}]")
            output.append(f"{email}: {' '.join(roles)}")
            
    with open("all_emails_with_roles.txt", "w") as f:
        f.write("\n".join(output))
        
    for line in output:
        print(line)

if __name__ == "__main__":
    asyncio.run(main())
