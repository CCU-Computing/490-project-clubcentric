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
    
    data = {
        "id" : club.id,
        "name" : club.name,
        "description" : club.description,
        "links" : club.links if club.links else None,
        "picture": request.build_absolute_url(club.display_picture.file.url) if club.display_picture else None
        }
    return JsonResponse(data)

@login_required
@require_POST
def update_club(request):
    club_id = request.POST.get("club_id")
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")
    club_picture = request.FILES.get("club_picture")
    club_links = request.POST.get("club_links")

    if not club_id:
        return JsonResponse({"error": "Missing required field: club_id"}, status=400)

    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    if not is_member(user=request.user, club=club, role="organizer"):
        return JsonResponse({"error": "must be an organizer of this club to update data"}, status=409)
    
    updated = []
    
    if club_name:
        club.name = club_name
        updated.append(('club_name', club.name))

    if club_description:
        club.description = club_description
        updated.append(('club_description', club.description))

    if club_picture:
        club.display_picture = club_picture
        updated.append(('club_picture', club.display_picture.url))

    if club_links:
        club.links = club_links
        updated.append(("club_links", club.links))

    club.save()
    return JsonResponse(updated, safe=False)

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
        meetings = Calendar.objects.filter(club=club)
        for meet in meetings:
            meet.delete()
        cal.delete()
    
    # Document Managers
    document_managers = DocumentManager.objects.filter(club=club)
    for manager in document_managers:
        # Documents
        documents = Document.objects.filter(club=club)
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
    

    Membership.objects.create(
        user = request.user,
        club=club,
        role='member'
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
        # If either club is a product of a previous merge
        if MergeRequest.objects.filter(merged_club=club_1).exists() or MergeRequest.objects.filter(merged_club=club_2).exists():
            return JsonResponse({"error": "one or both of the clubs are products of previous merges"}, status=409)
    
        # Check for existing request
        if MergeRequest.objects.filter(club_1=club_1, club_2=club_2).exists() or MergeRequest.objects.filter(club_1=club_2, club_2=club_1).exists():
            return JsonResponse({"error": "request already exists"}, status=409)
        
        request = MergeRequest.objects.create(club_1=club_1, club_2=club_2, accepted_1=True, merged_club=None)
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
    
    # Find in club 1 position
    merge_req = MergeRequest.objects.filter(club_1=club)
    if not merge_req.exists():
        # Find in club 2 position
        merge_req = MergeRequest.objects.filter(club_2=club)
        if not merge_req.exists():
            return JsonResponse({"error": "merge request for this club does not exist"}, status=404)

        # Request exists
        if merge_req.accepted_2:
            if merge_req.accepted_1:
                return JsonResponse({"ready to merge": True})
            else:
                return JsonResponse({"waiting for other club to accept": True})
        else:
            return JsonResponse({"waiting for your club to accept": True})
    
    if merge_req.accepted_1:
        if merge_req.accepted_2:
            return JsonResponse({"ready to merge": True})
        else:
            return JsonResponse({"waiting for other club to accept": True})
    else:
        return JsonResponse({"waiting for your club to accept": True})

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
            merge_req.perform_merge()
            return JsonResponse({"status": True, "merged_id": merge_req.new_club.id})
        else:
            return JsonResponse({"status" : True, "merged_id": merge_req.new_club.id})
    else:
        if not request.accepted_1:
            return JsonResponse({"status": True, "awaiting": merge_req.club_2.id})
    
        if not request.accepted_2:
            return JsonResponse({"status": True, "awaiting" : merge_req.club_1.id})

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