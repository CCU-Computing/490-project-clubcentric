
from django.http import JsonResponse
from .models import Calendar, Meeting, Club
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET
from urllib.parse import parse_qs

def calendars_list(request):
    club_id = request.GET.get("club_id")
    if not club_id:
        return JsonResponse({"error": "Missing club_id"}, status=400)
    
    # Get the club from ID
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error": "Club not found"}, status=404)

    allCals = [
            {"id" : cal.id, "name" : cal.name} 
            for cal in club.calendars.all()
            ]
    return JsonResponse(allCals, safe=False)

def meetings_list(request):
    calendar_id = request.POST.get("calendar_id")
    meeting_id = request.POST.get("meeting_id")
    if not calendar_id and not meeting_id:
        return JsonResponse({"error" : "Missing fields"}, status=400)
    # only meeting OR both params given, ignore cal same logic
    elif not calendar_id or calendar_id and meeting_id:
        try:
            meeting = Meeting.objects.get(id=meeting_id)
        except Meeting.DoesNotExist:
            return JsonResponse({"error" : "Meeting does not exist"}, status=404)
        return JsonResponse([{"id" : meeting.id, "date" : meeting.date}], safe=False)
    # Only calendar
    else:
        # Fetch meetings for a calendar
        try:
            calendar = Calendar.objects.get(id=calendar_id)
        except Calendar.DoesNotExist:
            return JsonResponse({"error" : "Calendar does not exist"}, status=404)
        
        allMeets = []
        for meet in calendar.meetings.all():
            allMeets.append({"id" : meet.id, "date" : meet.date.isoformat()})
        return JsonResponse(allMeets, safe=False)
    
@csrf_exempt
@require_POST
def create_calendar(request):
    club_id = request.POST.get("club_id")
    calendar_name = request.POST.get("calendar_name")
    if not club_id or not calendar_name:
        return JsonResponse({"error" : "Missing club_id or calendar_name"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=404)
    
    calendar = Calendar.objects.create(name=calendar_name, club=club)
    return JsonResponse({
        "cal_id" : calendar.id,
        "cal_name" : calendar.name
    })

@csrf_exempt
@require_POST
def create_meeting(request):
    calendar_id = request.POST.get("calendar_id")
    datetime_str = request.POST.get("datetime_str")

    if not calendar_id or not datetime_str:
        return JsonResponse({"error": "Missing club_id or calendar_id or date"}, status=400)

    date = parse_datetime(datetime_str)
    if not date:
        return JsonResponse({"error": "Invalid date format"}, status=400)

    try:
        calendar = Club.calendars.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found for this club"}, status=404)

    for meet in calendar.meetings(all):
        if meet.date == date:
            return JsonResponse({"error" : "Meeting already exists at this time"}, status=409 )
    meeting = Meeting.objects.create(calendar=calendar, date=date)

    return JsonResponse({
        "meet_id": meeting.id,
        "cal_id" : calendar.id,
        "date" : meeting.date
    })