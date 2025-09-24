from .models import Club
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs
from django.utils.text import slugify
import hashlib

def name_to_slug_id(name: str) -> str:
    slug = slugify(name)
    hash_tail = hashlib.md5(name.encode()).hexdigest()[:6]
    return f"{slug}-{hash_tail}"

@csrf_exempt
@require_POST
def create_club(request):
    try:
        body = request.body.decode("utf-8")
        post_data = parse_qs(body)
        club_name = post_data.get("club_name", [None])[0]
        if not club_name:
            return JsonResponse({"error": "Missing club_name"}, status=400)

        club_id = name_to_slug_id(club_name)
        club_description = post_data.get("club_description", [""])[0]

        club = Club.objects.create(
            name=club_name,
            slug_id=club_id,
            description=club_description
        )

        return JsonResponse({
            "name":club.name,
            "slug_id":club.slug_id,
            "description": club.description
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_POST
def merge_clubs(request):
    """
    Merges two clubs into one shared club
    Expects in POST: club1_name, club2_name
    """
    body = request.body.decode("utf-8")
    post_data = parse_qs(body)
    club1_name = post_data.get("club1_name", [None])[0]
    club2_name = post_data.get("club2_name", [None])[0]

    try:
        club1 = Calendar.objects.get(name=club1_name)
        club2 = Calendar.objects.get(name=club2_name)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "One of the clubs does not exist"}, status=404)

    # New club name
    new_name = f"{club1.name} x {club2.name}"
    # Create new club
    new_club = Calendar.objects.create(name=new_name)

    # Copy meetings from club1
    for m in club1.meetings.all():
        Meetings.objects.create(calendar=new_club, date=m.date)

    # Copy meetings from club2
    for m in club2.meetings.all():
        Meetings.objects.create(calendar=new_club, date=m.date)

    merged_meetings = [
        {"date": m.date.isoformat()} for m in new_Calendar.meetings.all()
    ]

    return JsonResponse({
        "new_club_name": new_Calendar.name,
        "meetings": merged_meetings
    })

