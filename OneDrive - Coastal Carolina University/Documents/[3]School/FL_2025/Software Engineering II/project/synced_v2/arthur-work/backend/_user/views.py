from .models import Club
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404, redirect

import hashlib
import json

@csrf_exempt
@require_POST
def create_user(request):
    username = request.POST.get("username")
    password = request.POST.get("password")
    first_name = request.POST.get("first_name")
    last_name = request.POST.get("last_name")
    email = request.POST.get("email")

    if not username or not password or not first_name or not last_name or not email:
        return JsonResponse({"error": "Missing required fields"}, status=400)
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists."}, status=400)
    
    user = User.objects.create(
        username=username,
        password=make_password(password),
        first_name=first_name,
        last_name=last_name,
        email=email 
    )

    return JsonResponse({'message': "User created successfully"})

@login_required
@require_POST
def join_club(request):
    club_to_join = request.POST.get("club")
    club = get_object_or_404(Club, id=club_to_join)

    club.members.add(request.user)

    return redirect('club_detail', club_id=club.id)

@login_required
@require_POST
def leave_club(request):
    club_to_leave = request.POST.get("club")
    club = get_object_or_404(Club, id=club_to_leave)

    club.members.remove(request.user)

    return redirect('club_detail', club_id=club.id)



@csrf_exempt
@require_POST
def create_club(request):
    club_name = request.POST.get("club_name")
    club_description = request.POST.get("club_description")

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
