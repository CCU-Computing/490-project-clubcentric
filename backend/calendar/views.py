
from django.http import JsonResponse
from .models import Calendar, Meeting
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET
from urllib.parse import parse_qs

@require_GET
# Simple GET endpoint to return all calendars as JSON
def meetings_list(request):
    club_id = request.GET.get("club_id")

    if not club_id:
        return JsonResponse({"error": "Missing club_id"}, status=400)

    try:
        calendar = Calendar.objects.get(club_id=club_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found for this club"}, status=404)

    meetings = [{"date": m.date.isoformat()} for m in calendar.meetings.all()]

    data = {
        "Club Name": calendar.club.name,
        "Meetings": meetings,
    }

    return JsonResponse(data, safe=False)


@csrf_exempt
@require_POST
def create_meeting(request):
    club_id = request.POST.get("club_id")
    date_str = request.POST.get("date")

    if not club_id or not date_str:
        return JsonResponse({"error": "Missing club_id or date"}, status=400)

    date = parse_datetime(date_str)
    if not date:
        return JsonResponse({"error": "Invalid date format"}, status=400)

    try:
        calendar = Calendar.objects.get(club_id=club_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found for this club"}, status=404)

    meeting = Meeting.objects.create(calendar=calendar, date=date)

    return JsonResponse({
        "Club Name": calendar.club.name,
        "Meeting": {"date": meeting.date.isoformat()}
    })