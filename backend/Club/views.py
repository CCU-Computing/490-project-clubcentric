
from django.http import JsonResponse
from .models import Club, Meetings
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST
from urllib.parse import parse_qs

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
        club1 = Club.objects.get(name=club1_name)
        club2 = Club.objects.get(name=club2_name)
    except Club.DoesNotExist:
        return JsonResponse({"error": "One of the clubs does not exist"}, status=404)

    # New club name
    new_name = f"{club1.name} x {club2.name}"
    # Create new club
    new_club = Club.objects.create(name=new_name)

    # Copy meetings from club1
    for m in club1.meetings.all():
        Meetings.objects.create(calendar=new_club, date=m.date)

    # Copy meetings from club2
    for m in club2.meetings.all():
        Meetings.objects.create(calendar=new_club, date=m.date)

    merged_meetings = [
        {"date": m.date.isoformat()} for m in new_club.meetings.all()
    ]

    return JsonResponse({
        "new_club_name": new_club.name,
        "meetings": merged_meetings
    })

# Simple GET endpoint to return all calendars as JSON
def calendar_list(request):
    calendars = Club.objects.all()
    data = []
    for c in calendars:
        meetings = [{"date": m.date.isoformat()} for m in c.meetings.all()]  
        # use .isoformat() to make datetime JSON-serializable
        data.append({
            "Club Name": c.name,
            "Meetings": meetings,
        })
    return JsonResponse(data, safe=False)

# Simple POST endpoint to create a calendar
def create_calendar(request):
    if request.method == "POST":
        clubName = request.POST.get("name", "defaultname")
        nextdate_str = request.POST.get("nextdate", None)
        nextdate = parse_datetime(nextdate_str) if nextdate_str else None
        cal = Club.objects.create(clubName=clubName)
        if nextdate:
            Meetings.objects.create(calendar=cal, date=nextdate)
        return JsonResponse({"Club Name": cal.name, "Meetings": [{"date": m.date.isoformat()} for m in cal.meetings.all()]})
