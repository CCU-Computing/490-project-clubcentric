from .models import Club, Membership, MergeRequest
from calendar_app.models import Calendar, Meeting
from users.models import User
from document.models import DocumentManager, Document
from django.http import JsonResponse
from users.views import is_member
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs
from django.utils.text import slugify
from django.db import models
import hashlib
import json


''' CLUB CRUD '''

@require_POST
@login_required
def create_club(request):
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")

    if not club_name or not club_description:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    if Club.objects.filter(name=club_name).exists():
        return JsonResponse({"error": "Club already exists"}, status=409)
    
    club = Club.objects.create(name=club_name, description=club_description)
    Membership.objects.create(user=request.user, club=club, role="organizer")
    return JsonResponse({"status": True, "id" : club.id})

@login_required
def view_clubs(request):
    club_id = request.GET.get("club_id")
    # If no id provided, return all clubs
    if not club_id:
        allClubs = [
            {"id" : c.id, "name" : c.name, "description" : c.description, "tags" : c.tags} 
            for c in Club.objects.all()
            ]
        return JsonResponse(allClubs, safe=False)
     
    # Return club data based on ID
    try:
        club = Club.objects.get(id=club_id)   
    # Club not found
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=404)
    
    # Build picture URL safely
    picture_url = None
    if club.display_picture:
        try:
            picture_url = request.build_absolute_uri(club.display_picture.url)
        except:
            picture_url = None

    data = {
        "id" : club.id,
        "name" : club.name,
        "description" : club.description,
        "summary" : club.summary or "",
        "videoEmbed" : club.videoEmbed or "",
        "tags" : club.tags if club.tags else [],
        "links" : club.links if club.links else [],
        "lastMeetingDate" : club.lastMeetingDate.isoformat() if club.lastMeetingDate else None,
        "picture": picture_url
        }
    return JsonResponse(data)

@login_required
@require_POST
def update_club(request):
    club_id = request.POST.get("club_id")
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")
    club_summary = request.POST.get("club_summary")
    club_videoEmbed = request.POST.get("club_videoEmbed")
    club_picture = request.FILES.get("club_picture")
    club_links = request.POST.get("club_links")
    club_tags = request.POST.get("club_tags")
    club_lastMeetingDate = request.POST.get("club_lastMeetingDate")

    if not club_id:
        return JsonResponse({"error": "Missing required field: club_id"}, status=400)

    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)

    if not is_member(user=request.user, club=club, role="organizer"):
        return JsonResponse({"error": "must be an organizer of this club to update data"}, status=409)

    try:
        if club_name:
            club.name = club_name

        if club_description:
            club.description = club_description

        if club_summary:
            club.summary = club_summary

        if club_videoEmbed:
            club.videoEmbed = club_videoEmbed

        if club_picture:
            # Validate file before saving
            if club_picture.size > 10 * 1024 * 1024:  # 10MB limit
                return JsonResponse({"error": "File size too large. Maximum 10MB allowed."}, status=400)

            # Check file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if club_picture.content_type not in allowed_types:
                return JsonResponse({"error": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."}, status=400)

            try:
                club.display_picture = club_picture
            except Exception as pic_error:
                return JsonResponse({"error": f"Failed to save picture: {str(pic_error)}"}, status=400)

        if club_links:
            # Parse JSON string to Python object for JSONField
            club.links = json.loads(club_links)

        if club_tags:
            # Parse JSON string to Python list for ArrayField
            club.tags = json.loads(club_tags)

        if club_lastMeetingDate:
            # Parse date string to date object
            parsed_date = parse_datetime(club_lastMeetingDate)
            if parsed_date:
                club.lastMeetingDate = parsed_date.date()
            else:
                club.lastMeetingDate = None

        club.save()
        return JsonResponse({"status": True})

    except json.JSONDecodeError as json_error:
        return JsonResponse({"error": f"Invalid JSON format for links or tags: {str(json_error)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Failed to update club: {str(e)}"}, status=400)

@require_POST
@login_required
def delete_club(request):
    club_id = request.POST.get('club_id')

    if not club_id:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    if not is_member(request.user, club=club, role='organizer'):
        return JsonResponse({"error": "Permissions"}, status=403)
    
    # Memberships
    memberships = Membership.objects.filter(club=club)
    for member in memberships:
        member.delete()

    # Calendars
    calendars = Calendar.objects.filter(club=club)
    for cal in calendars:
        # Meetings
        meetings = Meeting.objects.filter(calendar=cal)
        for meet in meetings:
            meet.delete()
        cal.delete()

    # Document Managers
    document_managers = DocumentManager.objects.filter(club=club)
    for manager in document_managers:
        # Documents
        documents = Document.objects.filter(manager=manager)
        for doc in documents:
            doc.delete()
        manager.delete()

    club.delete()
    return JsonResponse({"status": True})

''' MEMBERSHIP CRUD '''

@login_required
@require_POST
def join_club(request):
    club_id = request.POST.get("club_id")
    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)

    if is_member(user=request.user, club=club):
        return JsonResponse({'error': "already a member of this club"}, status=409)


    # Create membership
    Membership.objects.create(
        user = request.user,
        club=club,
        role='member'
    )

    # Create mirror calendar for user
    mirror_calendar = Calendar.objects.create(
        name=club.name,
        user=request.user,
        is_club_mirror=True,
        source_club=club
    )

    # Copy all existing club meetings to user's mirror calendar
    club_calendars = Calendar.objects.filter(club=club)
    for club_calendar in club_calendars:
        meetings = Meeting.objects.filter(calendar=club_calendar)
        for meeting in meetings:
            # Prepend original calendar name to description
            original_description = meeting.description or ""
            mirror_description = f"[{club_calendar.name}] {original_description}"

            Meeting.objects.create(
                calendar=mirror_calendar,
                date=meeting.date,
                description=mirror_description,
                is_mirror=True,
                source_meeting=meeting
            )

    return JsonResponse({"status": True})
  
@login_required
def get_club_membership(request):
    ''' Return membership status of a club '''
    
    club_id = request.GET.get("club_id")
    user_id = request.GET.get("user_id")
    
    # If provided, find other user
    if user_id:
        try:   
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "user not found"}, status=404)
    # Otherwise, find for user requesting
    else:
        user = request.user
    
    # Get user's memberships
    if not club_id:
        membership = Membership.objects.filter(user=user)
        response = {
            m.club.id: m.role for m in membership
        }
        return JsonResponse(response)
    
    # Get a club's memberships
    else:
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error": "club not found"}, status=404)
        # User membership in club
        if user_id:
            try:
                member = Membership.objects.get(user=user, club=club)
            except Membership.DoesNotExist:
                return JsonResponse({"error": "user not a member of the club"}, status=404)
            if member:
                return JsonResponse({"role": member.role})

        # All club memberships
        else:
            membership = Membership.objects.filter(club=club)
            members = [
                {"user_id": m.user.id, "role": m.role} for m in membership
            ]

            if not members:
                return JsonResponse([], safe=False)
            else:
                return JsonResponse(members, safe=False)

@login_required
@require_POST
def update_membership(request):
    user_id = request.POST.get("user_id")
    club_id = request.POST.get("club_id")
    new_role = request.POST.get("new_role")

    if not user_id or not club_id or not new_role:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    if new_role not in ["member", "organizer"]:
        return JsonResponse({"error": "invalid new_role entry"}, status=400)

    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)

    # Check that caller is an organizer of the club
    if is_member(user=request.user, club=club, role='organizer'):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "user not found"}, status=404)
        
        if user.id == request.user.id:
            return JsonResponse({"error": "cannot update your own membership"}, status=403)
        
        # Check that recipient is in the club
        if is_member(user=user, club=club):
            membership = Membership.objects.get(user=user, club=club)
            membership.role = new_role
            membership.save()
            return JsonResponse({"status": True})

        else:
            return JsonResponse({"error": "user not a member of requested club"}, status=403)

    else:
        return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

@login_required
@require_POST
def delete_membership(request):
    club_id = request.POST.get("club_id")
    user_id = request.POST.get("user_id")

    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    # Get club
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    # Organizer removing a member
    if user_id:
        # Is organizer
        if is_member(user=request.user, club=club, role='organizer'):
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "user not found"}, status=404)
            
            # Recipient is member
            if is_member(user=user, club=club, role='member'):
                member = Membership.objects.get(user=user, club=club, role='member')
                member.delete()

                # Delete user's mirror calendar for this club
                Calendar.objects.filter(
                    user=user,
                    is_club_mirror=True,
                    source_club=club
                ).delete()

                return JsonResponse({"status": True})

            elif is_member(user=user, club=club, role='organizer'):
                return JsonResponse({"error": "cannot remove fellow organizer"}, status=403)
            
            else:
                return JsonResponse({"error": "user is not a member of this club"}, status=404)
        
        else:
            return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

    # User leaving a club
    else:
        if is_member(user=request.user, club=club):
            member = Membership.objects.get(user=request.user, club=club)
            member.delete()

            # Delete user's mirror calendar for this club
            Calendar.objects.filter(
                user=request.user,
                is_club_mirror=True,
                source_club=club
            ).delete()

            return JsonResponse({"status": True})

        else:
            return JsonResponse({"error": "you are not a member of this club"}, status=404)

''' MERGE REQUEST CRUD '''
@login_required
@require_POST
def create_merge_request(request):
    club_id_1 = request.POST.get("club_id_1")
    club_id_2 = request.POST.get("club_id_2")

    if not club_id_1 or not club_id_2:
        return JsonResponse({"error": "missing required fields"}, status=400)

    try:
        club_1 = Club.objects.get(id=club_id_1)
        club_2 = Club.objects.get(id=club_id_2)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club(s) not found"}, status=404)

    if is_member(user=request.user, club=club_1, role='organizer'):
        # Prevent merging clubs that are themselves products of previous merges
        if MergeRequest.objects.filter(merged_club=club_1).exists():
            return JsonResponse({"error": "club_1 is a product of a previous merge and cannot be merged again"}, status=409)
        if MergeRequest.objects.filter(merged_club=club_2).exists():
            return JsonResponse({"error": "club_2 is a product of a previous merge and cannot be merged again"}, status=409)

        # Prevent clubs that have already completed a merge from merging again
        if MergeRequest.objects.filter(
            models.Q(club_1=club_1) | models.Q(club_2=club_1),
            merged_club__isnull=False
        ).exists():
            return JsonResponse({"error": "club_1 has already completed a merge and cannot merge again"}, status=409)
        if MergeRequest.objects.filter(
            models.Q(club_1=club_2) | models.Q(club_2=club_2),
            merged_club__isnull=False
        ).exists():
            return JsonResponse({"error": "club_2 has already completed a merge and cannot merge again"}, status=409)

        # Check for duplicate request between same two clubs
        if MergeRequest.objects.filter(club_1=club_1, club_2=club_2).exists() or MergeRequest.objects.filter(club_1=club_2, club_2=club_1).exists():
            return JsonResponse({"error": "merge request between these clubs already exists"}, status=409)

        merge_request = MergeRequest.objects.create(club_1=club_1, club_2=club_2, accepted_1=True, merged_club=None)
        return JsonResponse({"status": True})
    else:
        return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

@login_required
def view_merge_request(request):
    club_id = request.GET.get("club_id")

    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)

    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)

    # Find ALL merge requests for this club
    merge_requests = MergeRequest.objects.filter(
        models.Q(club_1=club) | models.Q(club_2=club)
    )

    if not merge_requests.exists():
        return JsonResponse([], safe=False)

    # Build response list with detailed information for each request
    response_list = []
    for merge_req in merge_requests:
        # Determine which club is "ours" and which is "theirs"
        if merge_req.club_1 == club:
            our_club = merge_req.club_1
            other_club = merge_req.club_2
            we_accepted = merge_req.accepted_1
            they_accepted = merge_req.accepted_2
        else:
            our_club = merge_req.club_2
            other_club = merge_req.club_1
            we_accepted = merge_req.accepted_2
            they_accepted = merge_req.accepted_1

        # Build response for this merge request
        merge_data = {
            "merge_request_id": merge_req.id,
            "our_club_id": our_club.id,
            "our_club_name": our_club.name,
            "other_club_id": other_club.id,
            "other_club_name": other_club.name,
            "we_accepted": we_accepted,
            "they_accepted": they_accepted,
            "waiting for your club to accept": not we_accepted,
            "waiting for other club to accept": we_accepted and not they_accepted,
            "ready to merge": we_accepted and they_accepted and not merge_req.merged_club,
            "merged_id": merge_req.merged_club.id if merge_req.merged_club else None
        }
        response_list.append(merge_data)

    return JsonResponse(response_list, safe=False)

@login_required
@require_POST
def update_merge_request(request):
    club_id = request.POST.get("club_id")

    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    if not is_member(user=request.user, club=club, role="organizer"):
        return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

    merge_req = MergeRequest.objects.filter(
        models.Q(club_1=club) | models.Q(club_2=club)
    ).first()
    
    if not merge_req:
        return JsonResponse({"error": "merge request for this club does not exist"}, status=404)

    ready = merge_req.accept(club)

    if ready:
        if not merge_req.created:
            merged_club = merge_req.perform_merge()
            return JsonResponse({"status": True, "merged_id": merged_club.id})
        else:
            return JsonResponse({"status": True, "merged_id": merge_req.merged_club.id})
    else:
        # Merge not ready yet, one club still needs to accept
        return JsonResponse({"status": True})

@login_required
@require_POST
def delete_merge_request(request):
    club_id = request.POST.get("club_id")

    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    if not is_member(user=request.user, club=club, role="organizer"):
        return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

    merge_req = MergeRequest.objects.filter(
        models.Q(club_1=club) | models.Q(club_2=club)
    ).first()
    
    if not merge_req:
        return JsonResponse({"error": "merge request for this club does not exist"}, status=404)

    merge_req.delete()
    
    return JsonResponse({"status": True})