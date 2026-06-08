import asyncio
import httpx

BASE_URL = "http://127.0.0.1:8000/api"

async def create_user(client, email, name):
    user_data = {
        "full_name": name,
        "profile_picture_url": "https://i.pravatar.cc/150",
        "profession": "Tester",
        "current_organization": "Test Corp",
        "city": "Test City",
        "bio": f"I am the {name}",
        "join_reason": "Testing",
        "contribution_statement": "Testing",
        "linkedin_url": "https://linkedin.com",
        "email": email
    }
    await client.post(f"{BASE_URL}/users/register", json=user_data)
    resp = await client.post(f"{BASE_URL}/users/login", params={"email": email})
    return resp.json()["access_token"]

async def seed_roles():
    async with httpx.AsyncClient() as client:
        # Get communities
        resp = await client.get(f"{BASE_URL}/communities")
        communities = resp.json()
        if not communities:
            print("No communities found to seed roles into.")
            return
        
        target_community = communities[0]
        comm_id = target_community["id"]
        
        print("Creating User 1: The Applicant...")
        token_applicant = await create_user(client, "applicant@example.com", "Applicant User")
        
        print("Submitting Join Request for Applicant...")
        await client.post(
            f"{BASE_URL}/communities/{comm_id}/join", 
            headers={"Authorization": f"Bearer {token_applicant}"},
            json={"why_join": "I want to join", "contribution": "I can help"}
        )

        print("\nCreating User 2: The Member...")
        token_member = await create_user(client, "member@example.com", "Member User")
        
        print("Submitting Join Request for Member...")
        req = await client.post(
            f"{BASE_URL}/communities/{comm_id}/join", 
            headers={"Authorization": f"Bearer {token_member}"},
            json={"why_join": "I want to be a member", "contribution": "I will be active"}
        )
        
        print("Approving Member's Request...")
        # Login as the admin (from seed.py) to approve the member
        resp = await client.post(f"{BASE_URL}/users/login", params={"email": "admin@example.com"})
        if resp.status_code == 200:
            admin_token = resp.json()["access_token"]
            
            # Fetch requests
            reqs = await client.get(f"{BASE_URL}/communities/{comm_id}/admin/requests", headers={"Authorization": f"Bearer {admin_token}"})
            for r in reqs.json():
                if r["user_id"] == req.json()["user_id"]:
                    await client.patch(
                        f"{BASE_URL}/communities/{comm_id}/admin/requests/{r['id']}",
                        headers={"Authorization": f"Bearer {admin_token}"},
                        json={"status": "APPROVED"}
                    )
                    break
        
        print("\n=============================================")
        print("SUCCESS! Here are your testing accounts:")
        print("=============================================")
        print("1. THE ADMIN (Has full control over the communities)")
        print("   Email: admin@example.com")
        print("\n2. THE MEMBER (Already approved in the first community)")
        print("   Email: member@example.com")
        print("\n3. THE APPLICANT (Has a pending request in the first community)")
        print("   Email: applicant@example.com")
        print("=============================================")
        print(f"Test these roles on Community: {target_community['name']}")

if __name__ == "__main__":
    asyncio.run(seed_roles())
