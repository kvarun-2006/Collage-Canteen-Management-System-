import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "community_db")

async def main():
    client = AsyncIOMotorClient(DATABASE_URL)
    db = client[DATABASE_NAME]
    
    users = await db.users.find({}).to_list(length=None)
    
    all_emails = []
    gmails = []
    
    for user in users:
        email = user.get("email")
        if email:
            all_emails.append(email)
            if email.lower().endswith("@gmail.com"):
                gmails.append(email)
                
    with open("all_emails.txt", "w") as f:
        f.write("\n".join(all_emails))
        
    with open("gmails.txt", "w") as f:
        f.write("\n".join(gmails))
        
    print(f"Exported {len(all_emails)} total emails to all_emails.txt")
    print(f"Exported {len(gmails)} Gmail addresses to gmails.txt")

if __name__ == "__main__":
    asyncio.run(main())
