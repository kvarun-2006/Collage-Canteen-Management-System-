import asyncio
import httpx
from io import BytesIO

BASE_URL = "http://127.0.0.1:8000/api"

async def seed():
    async with httpx.AsyncClient() as client:
        # 1. Register a user
        user_data = {
            "full_name": "Sample Admin",
            "profile_picture_url": "https://i.pravatar.cc/150",
            "profession": "Community Builder",
            "current_organization": "Tech Hub",
            "city": "Hyderabad",
            "bio": "I love building communities.",
            "join_reason": "To connect",
            "contribution_statement": "I will organize events.",
            "linkedin_url": "https://linkedin.com/in/sample",
            "email": "admin@example.com"
        }
        print("Registering user...")
        resp = await client.post(f"{BASE_URL}/users/register", json=user_data)
        if resp.status_code != 201 and resp.status_code != 400:
            print("Failed to register:", resp.text)
            return

        # 2. Login
        print("Logging in...")
        resp = await client.post(f"{BASE_URL}/users/login", params={"email": "admin@example.com"})
        if resp.status_code != 200:
            print("Failed to login:", resp.text)
            return
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create 3 Communities
        communities = [
            {
                "name": "Hyderabad Tech Innovators",
                "description": "A community for developers, founders, and tech enthusiasts in Hyderabad to share ideas and build the future.",
                "category": "Technology",
                "city": "Hyderabad",
                "rules": "Be respectful and innovative.",
                "approval_type": "AUTO_APPROVE"
            },
            {
                "name": "Design Thinkers Club",
                "description": "Connecting UI/UX designers and creative minds to discuss trends, critique portfolios, and host workshops.",
                "category": "Design",
                "city": "Remote",
                "rules": "Constructive feedback only.",
                "approval_type": "ADMIN_APPROVAL"
            },
            {
                "name": "Indie Hackers Bangalore",
                "description": "A safe space for indie makers building profitable products on the internet without venture capital.",
                "category": "Startup",
                "city": "Bangalore",
                "rules": "Share your MRR and learnings transparently.",
                "approval_type": "AUTO_APPROVE"
            }
        ]

        # Dummy image payload (1x1 transparent PNG)
        dummy_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

        for i, c in enumerate(communities):
            print(f"Creating community: {c['name']}...")
            files = {
                "logo": (f"logo{i}.png", dummy_png, "image/png"),
                "cover_image": (f"cover{i}.png", dummy_png, "image/png")
            }
            data = c
            
            resp = await client.post(f"{BASE_URL}/communities", headers=headers, data=data, files=files)
            if resp.status_code == 201:
                print(f"Success: {c['name']}")
            else:
                print(f"Failed to create {c['name']}: {resp.text}")

if __name__ == "__main__":
    asyncio.run(seed())
