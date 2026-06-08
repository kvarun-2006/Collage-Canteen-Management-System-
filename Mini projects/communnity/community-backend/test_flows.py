import asyncio
import httpx
from io import BytesIO

BASE_URL = "http://127.0.0.1:8000/api"

async def run_tests():
    async with httpx.AsyncClient() as client:
        print("--- Testing User Registration ---")
        user1 = {
            "full_name": "Test User 1",
            "profile_picture_url": "url",
            "profession": "Prof",
            "current_organization": "Org",
            "city": "City",
            "bio": "Bio",
            "join_reason": "Reason",
            "contribution_statement": "Contribution",
            "linkedin_url": "url",
            "email": "test1@example.com"
        }
        resp = await client.post(f"{BASE_URL}/users/register", json=user1)
        if resp.status_code == 201:
            print("User 1 registered")
        elif resp.status_code == 400 and "already registered" in resp.text:
            print("User 1 already exists")
        else:
            print("Failed to register User 1:", resp.text)

        print("\n--- Testing User Login ---")
        resp = await client.post(f"{BASE_URL}/users/login", params={"email": "test1@example.com"})
        if resp.status_code != 200:
            print("Failed to login User 1:", resp.text)
            return
        token1 = resp.json()["access_token"]
        headers1 = {"Authorization": f"Bearer {token1}"}
        print("User 1 logged in")

        print("\n--- Testing Community Creation ---")
        dummy_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {
            "logo": ("logo.png", dummy_png, "image/png"),
            "cover_image": ("cover.png", dummy_png, "image/png")
        }
        community_data = {
            "name": "E2E Test Community",
            "description": "Desc",
            "category": "Test",
            "city": "TestCity",
            "rules": "Rules",
            "approval_type": "ADMIN_APPROVAL"
        }
        resp = await client.post(f"{BASE_URL}/communities", headers=headers1, data=community_data, files=files)
        if resp.status_code != 201:
            print("Failed to create community:", resp.text)
            return
        community_id = resp.json()["id"]
        print(f"Community created with ID: {community_id}")

        print("\n--- Testing User 2 Registration & Login ---")
        user2 = {**user1, "email": "test2@example.com", "full_name": "Test User 2"}
        await client.post(f"{BASE_URL}/users/register", json=user2)
        resp = await client.post(f"{BASE_URL}/users/login", params={"email": "test2@example.com"})
        token2 = resp.json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}
        print("User 2 logged in")

        print("\n--- Testing Join Request (User 2) ---")
        join_data = {
            "why_join": "I want to test",
            "contribution": "I will test"
        }
        resp = await client.post(f"{BASE_URL}/communities/{community_id}/join", headers=headers2, json=join_data)
        if resp.status_code != 201:
            if "already pending" in resp.text or "Already a member" in resp.text:
                print("Join request already exists")
            else:
                print("Failed to submit join request:", resp.text)
                return
        else:
            print("Join request submitted")
        
        print("\n--- Testing Admin List Requests (User 1) ---")
        resp = await client.get(f"{BASE_URL}/communities/{community_id}/admin/requests", headers=headers1)
        if resp.status_code != 200:
            print("Failed to list requests:", resp.text)
            return
        requests = resp.json()
        print(f"Found {len(requests)} pending requests.")
        
        if len(requests) > 0:
            req_id = requests[0]["id"]
            print(f"\n--- Testing Admin Approve Request (User 1) ---")
            resp = await client.patch(
                f"{BASE_URL}/communities/{community_id}/admin/requests/{req_id}",
                headers=headers1,
                json={"status": "APPROVED"}
            )
            if resp.status_code == 200:
                print("Request successfully approved!")
            else:
                print("Failed to approve:", resp.text)

        print("\n--- Testing Member List (User 1) ---")
        resp = await client.get(f"{BASE_URL}/communities/{community_id}/members", headers=headers1)
        if resp.status_code == 200:
            members = resp.json()
            print(f"Community now has {len(members)} members.")
        else:
            print("Failed to list members:", resp.text)

if __name__ == "__main__":
    asyncio.run(run_tests())
