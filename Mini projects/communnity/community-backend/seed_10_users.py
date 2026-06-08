import asyncio
import httpx

BASE_URL = "http://127.0.0.1:8000/api"

async def seed_10_users():
    async with httpx.AsyncClient() as client:
        for i in range(1, 11):
            email = f"user{i}@example.com"
            user_data = {
                "full_name": f"Generated User {i}",
                "profile_picture_url": f"https://i.pravatar.cc/150?u={i}",
                "profession": "Developer",
                "current_organization": f"Company {i}",
                "city": "Tech City",
                "bio": f"I am user number {i}",
                "join_reason": "To learn and share.",
                "contribution_statement": "I will bring my expertise.",
                "linkedin_url": f"https://linkedin.com/in/user{i}",
                "email": email
            }
            print(f"Creating user {i} ({email})...")
            resp = await client.post(f"{BASE_URL}/users/register", json=user_data)
            if resp.status_code == 201:
                print(f"Successfully created {email}")
            elif resp.status_code == 400 and "already registered" in resp.text:
                print(f"User {email} already exists.")
            else:
                print(f"Failed to create {email}: {resp.text}")

if __name__ == "__main__":
    asyncio.run(seed_10_users())
