from .models import Club
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs
from django.utils.text import slugify
import hashlib
import json

@csrf_exempt
@require_POST
def create_club(request):
    club_name = request.GET.get("club_name")
    club_description = request.GET.get("club_description")
    club_summary = request.GET.get("club_summary")
    club_videoEmbed = request.GET.get("club_videoEmbed")

    if not club_name or not club_description:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    if Club.objects.filter(name=club_name).exists():
        return JsonResponse({"error": "Club already exists"}, status=409)
    
    club = Club.objects.create(name=club_name, description=club_description, summary=club_summary, videoEmbed = club_videoEmbed)
    return JsonResponse({"id" : club.id, "name" : club.name})
    
def view_clubs(request):
    club_id = request.GET.get("club_id")
    # If no id provided, return all clubs
    if not club_id:
        allClubs = [
            {"id" : c.id, "name" : c.name, "description" : c.description, "summary" : c.summary, "videoEmbed" : c.videoEmbed} 
            for c in Club.objects.all()
            ]
        return JsonResponse(allClubs, safe=False)
     
    # Return club data based on ID
    try:
        club = Club.objects.get(id=club_id)
        data = {"id" : club.id, "name" : club.name, "description" : club.description, "summary" : club.summary, "videoEmbed" : club.videoEmbed}
        return JsonResponse(data)
    # Club not found
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=404)
