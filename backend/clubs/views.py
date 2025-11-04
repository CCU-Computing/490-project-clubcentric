from .models import Club, Membership
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs
from django.utils.text import slugify
import hashlib
import json


''' CRUD '''
@csrf_exempt
@require_POST
@login_required
def create_club(request):
    club_name = request.GET.get("club_name")
    club_description = request.GET.get("club_description")

    if not club_name or not club_description:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    if Club.objects.filter(name=club_name).exists():
        return JsonResponse({"error": "Club already exists"}, status=409)
    
    club = Club.objects.create(name=club_name, description=club_description)
    return JsonResponse({"id" : club.id, "name" : club.name})
    
def view_clubs(request):
    club_id = request.GET.get("club_id")
    # If no id provided, return all clubs
    if not club_id:
        allClubs = [
            {"id" : c.id, "name" : c.name, "description" : c.description} 
            for c in Club.objects.all()
            ]
        return JsonResponse(allClubs, safe=False)
     
    # Return club data based on ID
    try:
        club = Club.objects.get(id=club_id)
        data = {"id" : club.id, "name" : club.name, "description" : club.description}
        return JsonResponse(data)
    # Club not found
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=404)

@login_required
@csrf_exempt
@require_POST
def update_club(request):
    club_id = request.POST.get("club_id")
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")
    club_picture = request.FILES.get("club_picture")
    club_links = request.POST.get("club_links")

    if not club_id:
        return JsonResponse({"error": "Missing required field: club_id"}, status=400)


@login_required
def merge_club(request):
    ''' Merge two clubs '''

@login_required
def get_club_membership(request):
    ''' Return membership status of a club '''
    
    club_id = request.GET.get("club_id")
    
    if not club_id:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "club not found"}, status=404)
    
    if not Membership.objects.filter(user=request.user, club=club).exists():
        return JsonResponse({"error" : "You are not a member of this club"}, status=403)
    
    membership = Membership.objects.filter(club=club)
    
    members = {
        m.user.get_full_name(): m.role for m in membership
    }
    
    if not members:
        return JsonResponse({"message": "No members in this club"})
    else:
        return JsonResponse({"members:": members})
