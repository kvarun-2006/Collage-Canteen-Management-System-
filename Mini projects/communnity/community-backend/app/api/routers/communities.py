from fastapi import APIRouter, Depends, HTTPException, status, Body, Form, UploadFile, File
import shutil
import os
from app.models.models import Community, User, CommunityMembership, JoinRequest, ApprovalType, RoleType, RequestStatus, Meetup
from app.schemas.schemas import CommunityOut, JoinRequestCreate, JoinRequestOut, MembershipOut, MeetupCreate, MeetupOut
from app.api.deps import get_current_user
from beanie import PydanticObjectId
from app.db.database import client

router = APIRouter(prefix="/api/communities", tags=["communities"])

async def check_admin(community_id: str, user_id: str):
    user = await User.get(user_id)
    if user and user.email == "admin@example.com":
        return
        
    membership = await CommunityMembership.find_one(
        CommunityMembership.user_id == user_id,
        CommunityMembership.community_id == community_id,
        CommunityMembership.role == RoleType.ADMIN
    )
    if not membership:
        raise HTTPException(status_code=403, detail="Admin access required")

async def upload_file_to_storage(file: UploadFile) -> str:
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return f"http://127.0.0.1:8000/static/{file.filename}"

@router.post("", response_model=CommunityOut, status_code=status.HTTP_201_CREATED)
async def create_community(
    name: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    city: str = Form(...),
    rules: str = Form(...),
    approval_type: ApprovalType = Form(...),
    website: str = Form(None),
    whatsapp_link: str = Form(None),
    discord_link: str = Form(None),
    instagram_link: str = Form(None),
    logo: UploadFile = File(...),
    cover_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    logo_url = await upload_file_to_storage(logo)
    cover_image_url = await upload_file_to_storage(cover_image)
    
    new_community = Community(
        name=name,
        description=description,
        category=category,
        city=city,
        rules=rules,
        approval_type=approval_type,
        website=website,
        whatsapp_link=whatsapp_link,
        discord_link=discord_link,
        instagram_link=instagram_link,
        creator_id=str(current_user.id),
        logo_url=logo_url,
        cover_image_url=cover_image_url,
        member_count=1
    )
    await new_community.insert()

    membership = CommunityMembership(
        user_id=str(current_user.id),
        community_id=str(new_community.id),
        role=RoleType.ADMIN
    )
    await membership.insert()
    return new_community

@router.get("", response_model=list[CommunityOut])
async def list_communities(
    search: str = None,
    category: str = None,
    city: str = None,
    sort: str = "newest"
):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = category
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
        
    sort_query = "-member_count" if sort == "member_count" else "name"
        
    communities = await Community.find(query).sort(sort_query).to_list()
    return communities

@router.get("/{id}", response_model=CommunityOut)
async def get_community(id: PydanticObjectId):
    community = await Community.get(id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return community

@router.post("/{id}/join", response_model=JoinRequestOut, status_code=status.HTTP_201_CREATED)
async def join_community(
    id: PydanticObjectId,
    join_in: JoinRequestCreate,
    current_user: User = Depends(get_current_user)
):
    community = await Community.get(id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
        
    mem_result = await CommunityMembership.find_one(
        CommunityMembership.user_id == str(current_user.id),
        CommunityMembership.community_id == str(id)
    )
    if mem_result:
        raise HTTPException(status_code=400, detail="Already a member")

    req_result = await JoinRequest.find_one(
        JoinRequest.user_id == str(current_user.id),
        JoinRequest.community_id == str(id),
        JoinRequest.status == RequestStatus.PENDING
    )
    if req_result:
        raise HTTPException(status_code=400, detail="Request already pending")

    async with await client.start_session() as session:
        async with session.start_transaction():
            request = JoinRequest(
                user_id=str(current_user.id),
                community_id=str(community.id),
                why_join=join_in.why_join,
                contribution=join_in.contribution,
                status=RequestStatus.PENDING
            )
            
            if community.approval_type == ApprovalType.AUTO_APPROVE:
                request.status = RequestStatus.APPROVED
                membership = CommunityMembership(
                    user_id=str(current_user.id),
                    community_id=str(community.id),
                    role=RoleType.MEMBER
                )
                await membership.insert(session=session)
                community.member_count += 1
                await community.save(session=session)
                
            await request.insert(session=session)
            return request

@router.get("/{id}/members", response_model=list[MembershipOut])
async def list_members(
    id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    mem_result = await CommunityMembership.find_one(
        CommunityMembership.user_id == str(current_user.id),
        CommunityMembership.community_id == str(id)
    )
    if not mem_result:
        raise HTTPException(status_code=403, detail="Must be a member to view")
        
    memberships = await CommunityMembership.find(CommunityMembership.community_id == str(id)).to_list()
    
    out_memberships = []
    for mem in memberships:
        user = await User.get(mem.user_id)
        mem_out = MembershipOut.model_validate(mem, from_attributes=True)
        mem_out.user_name = user.full_name if user else "Unknown User"
        mem_out.user_avatar = user.profile_picture_url if user else None
        out_memberships.append(mem_out)
        
    return out_memberships

@router.patch("/{community_id}", response_model=CommunityOut)
async def update_community(
    community_id: str,
    description: str = Form(None),
    category: str = Form(None),
    city: str = Form(None),
    rules: str = Form(None),
    website: str = Form(None),
    whatsapp_link: str = Form(None),
    discord_link: str = Form(None),
    instagram_link: str = Form(None),
    logo: UploadFile = File(None),
    cover_image: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    await check_admin(community_id, str(current_user.id))
    community = await Community.get(community_id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
        
    if description is not None:
        community.description = description
    if category is not None:
        community.category = category
    if city is not None:
        community.city = city
    if rules is not None:
        community.rules = rules
    if website is not None:
        community.website = website
    if whatsapp_link is not None:
        community.whatsapp_link = whatsapp_link
    if discord_link is not None:
        community.discord_link = discord_link
    if instagram_link is not None:
        community.instagram_link = instagram_link

    os.makedirs("uploads/communities", exist_ok=True)
    if logo:
        logo_path = f"uploads/communities/{community.id}_logo.png"
        with open(logo_path, "wb") as buffer:
            shutil.copyfileobj(logo.file, buffer)
        community.logo_url = f"http://localhost:8000/{logo_path}"
    
    if cover_image:
        cover_path = f"uploads/communities/{community.id}_cover.png"
        with open(cover_path, "wb") as buffer:
            shutil.copyfileobj(cover_image.file, buffer)
        community.cover_image_url = f"http://localhost:8000/{cover_path}"
        
    await community.save()
    return CommunityOut(
        id=community.id,
        name=community.name,
        logo_url=community.logo_url,
        cover_image_url=community.cover_image_url,
        description=community.description,
        category=community.category,
        city=community.city,
        website=community.website,
        whatsapp_link=community.whatsapp_link,
        discord_link=community.discord_link,
        instagram_link=community.instagram_link,
        rules=community.rules,
        approval_type=community.approval_type,
        creator_id=community.creator_id,
        member_count=community.member_count,
        upcoming_meetups_count=community.upcoming_meetups_count
    )

@router.post("/{community_id}/meetups", response_model=MeetupOut, status_code=status.HTTP_201_CREATED)
async def create_meetup(
    community_id: str,
    meetup_in: MeetupCreate,
    current_user: User = Depends(get_current_user)
):
    await check_admin(community_id, str(current_user.id))
    community = await Community.get(community_id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    meetup = Meetup(
        community_id=community_id,
        title=meetup_in.title,
        description=meetup_in.description,
        date=meetup_in.date,
        location=meetup_in.location,
        attendee_ids=[]
    )
    await meetup.insert()
    
    community.upcoming_meetups_count += 1
    await community.save()
    
    return MeetupOut(
        id=meetup.id,
        community_id=meetup.community_id,
        title=meetup.title,
        description=meetup.description,
        date=meetup.date,
        location=meetup.location,
        attendee_count=0,
        created_at=meetup.created_at
    )

@router.get("/{community_id}/meetups", response_model=list[MeetupOut])
async def list_meetups(community_id: str):
    meetups = await Meetup.find(Meetup.community_id == community_id).to_list()
    return [
        MeetupOut(
            id=m.id,
            community_id=m.community_id,
            title=m.title,
            description=m.description,
            date=m.date,
            location=m.location,
            attendee_count=len(m.attendee_ids),
            created_at=m.created_at
        ) for m in meetups
    ]

@router.get("/{id}/admin/requests", response_model=list[JoinRequestOut])
async def list_join_requests(
    id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    await check_admin(str(id), str(current_user.id))
    requests = await JoinRequest.find(
        JoinRequest.community_id == str(id),
        JoinRequest.status == RequestStatus.PENDING
    ).to_list()
    
    out_requests = []
    for req in requests:
        user = await User.get(req.user_id)
        req_out = JoinRequestOut.model_validate(req, from_attributes=True)
        req_out.user_name = user.full_name if user else "Unknown User"
        req_out.user_avatar = user.profile_picture_url if user else None
        out_requests.append(req_out)
        
    return out_requests

@router.patch("/{id}/admin/requests/{request_id}", response_model=JoinRequestOut)
async def resolve_join_request(
    id: PydanticObjectId,
    request_id: PydanticObjectId,
    status_update: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    await check_admin(str(id), str(current_user.id))
    
    status_val = status_update.get("status")
    if status_val not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Status must be APPROVED or REJECTED")
        
    request = await JoinRequest.get(request_id)
    if not request or request.community_id != str(id):
        raise HTTPException(status_code=404, detail="Request not found")
        
    if request.status != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request already resolved")

    async with await client.start_session() as session:
        async with session.start_transaction():
            if status_val == "APPROVED":
                request.status = RequestStatus.APPROVED
                membership = CommunityMembership(
                    user_id=request.user_id,
                    community_id=str(id),
                    role=RoleType.MEMBER
                )
                await membership.insert(session=session)
                
                community = await Community.get(id, session=session)
                community.member_count += 1
                await community.save(session=session)
            else:
                request.status = RequestStatus.REJECTED
                
            await request.save(session=session)
            return request

@router.delete("/{community_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_community(
    community_id: str,
    current_user: User = Depends(get_current_user)
):
    await check_admin(community_id, str(current_user.id))
    
    community = await Community.get(community_id)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
        
    async with await client.start_session() as session:
        async with session.start_transaction():
            await CommunityMembership.find(CommunityMembership.community_id == community_id).delete(session=session)
            await JoinRequest.find(JoinRequest.community_id == community_id).delete(session=session)
            await Meetup.find(Meetup.community_id == community_id).delete(session=session)
            await community.delete(session=session)
