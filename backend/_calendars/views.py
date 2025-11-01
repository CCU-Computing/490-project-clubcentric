
from django.http import JsonResponse
from .models import Calendar, Meeting, Club
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET
from urllib.parse import parse_qs
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    calendar_id = request.GET.get("calendar_id")
    meeting_id = request.GET.get("meeting_id")
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
    user_id = request.POST.get("user_id")
    calendar_name = request.POST.get("calendar_name")
    if (not club_id and not user_id) or not calendar_name:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    elif club_id and user_id:
        return JsonResponse({"error": "Calendar cannot belong to a user and a club."}, status=400)
    
    # Club calendar
    if club_id and not user_id:   
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error" : "Club not found"}, status=404)
        
        calendar = Calendar.objects.create(name=calendar_name, club=club)
        return JsonResponse({
            "cal_id" : calendar.id,
            "cal_name" : calendar.name
        })
    
@receiver(post_save, sender=User)
def create_user_calendar(sender, instance, created, **kwargs):
    if created:
        Calendar.objects.create(user=instance)

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