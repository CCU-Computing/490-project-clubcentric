
from django.http import JsonResponse
from backend.core.models.calendar_model import Calendar, Meeting
from clubs.models import Club, Membership
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from urllib.parse import parse_qs
from core.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

'''CALENDARS'''

def calendars_list(request):
    '''List calendars for a user or a club'''
    club_id = request.GET.get("club_id")
    user_id = request.GET.get("user_id")
    
    # Check proper arguments
    if not club_id and not user_id:
        return JsonResponse({"error": "Missing club_id or user_id"}, status=400)
    if club_id and user_id:
        return JsonResponse({'error': "Specify either a user or club"}, status=400)
    
    # Return club calendars
    if club_id:  
        # Get the club from ID
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error": "Club not found"}, status=404)
        
        # Check permissions
        if not Membership.objects.filter(user=request.user, club=club).exists():
            return JsonResponse({"error" : "You are not a member of this club"}, status=403)
        
        # List of calendars associated with the club
        allCals = [
                {"id" : cal.id, "name" : cal.name} 
                for cal in club.calendars.all()
                ]
        return JsonResponse(allCals, safe=False)
    
    # Return user calendars
    if user_id:  
        # Get the club from ID
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
        # List of calendars associated with the User
        allCals = [
                {"id" : cal.id, "name" : cal.name} 
                for cal in user.calendars.all()
                ]
        return JsonResponse(allCals, safe=False)
  
@csrf_exempt
@require_POST
def create_calendar(request):
    '''Create a blank calendar'''
    club_id = request.POST.get("club_id")
    user_id = request.POST.get("user_id")
    calendar_name = request.POST.get("calendar_name")

    # error checking
    if (not club_id and not user_id) or not calendar_name:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    elif club_id and user_id:
        return JsonResponse({"error": "Calendar cannot belong to a user and a club."}, status=400)
    
    # Club calendar
    if club_id:
        if not Membership.objects.filter(user=request.user, club=club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error" : "Club not found"}, status=404)
        
        calendar = Calendar.objects.create(name=calendar_name, club=club, user=None)
        return JsonResponse({"cal_id" : calendar.id,"cal_name" : calendar.name})
    
    # User calendar
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error" : "user not found"}, status=404)
        # Invalid user
        if calendar.user != request.user:
            return JsonResponse({"error" : "Cannot create calendar of another user"}, status=403)
        calendar = Calendar.objects.create(name=calendar_name, club=None, user=user)
        return JsonResponse({"cal_id" : calendar.id,"cal_name" : calendar.name})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_calendar(request, calendar_id):
    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found"}, status=404)
    
    # Invalid club member
    if calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
    # Invalid user id
    if calendar.user is not None:
        if calendar.user != request.user:
            return JsonResponse({"error" : "Cannot delete calendar of another user"}, status=403)
    calendar.delete()
    return JsonResponse({"status": "deleted"})


'''MEETINGS '''

def meetings_list(request):
    '''List meetings for a calendar'''
    calendar_id = request.GET.get("calendar_id")
    if not calendar_id:
        return JsonResponse({"error" : "Missing id field"}, status=400)

    # Fetch meetings for a calendar
    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error" : "Calendar does not exist"}, status=404)
    if calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=calendar.club).exists():
            return JsonResponse({"error" : "You are not a member of this club"}, status=403)
    allMeets = []
    for meet in calendar.meetings.all():
        allMeets.append({
            "id" : meet.id, 
            "date" : meet.date.isoformat(),
            "description" : meet.description
            })
    return JsonResponse(allMeets, safe=False)
  
@csrf_exempt
@require_POST
def create_meeting(request):
    calendar_id = request.POST.get("calendar_id")
    datetime_str = request.POST.get("datetime_str")
    description = request.POST.get("description")

    if not calendar_id or not datetime_str:
        return JsonResponse({"error": "Missing club_id or calendar_id or date"}, status=400)

    date = parse_datetime(datetime_str)
    if not date:
        return JsonResponse({"error": "Invalid date format"}, status=400)

    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found"}, status=404)
    # Club calendar
    if calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a member of this club"}, status=403) 
        for meet in calendar.meetings(all):
            if meet.date == date:
                return JsonResponse({"error" : "Meeting already exists at this time"}, status=409 )
        meeting = Meeting.objects.create(calendar=calendar, date=date, description=description)

        return JsonResponse({
            "meet_id": meeting.id,
            "cal_id" : calendar.id,
        })
    # User calendar
    else:
        for meet in calendar.meetings(all):
            if meet.date == date:
                return JsonResponse({"error" : "Meeting already exists at this time"}, status=409 )
        meeting = Meeting.objects.create(calendar=calendar, date=date, description=description)

        return JsonResponse({
            "meet_id": meeting.id,
            "cal_id" : calendar.id,
        })
    
@csrf_exempt
@require_http_methods(["UPDATE"])
def update_meeting(request, meeting_id):
    try:
        meeting = Meeting.objects.get(id=meeting_id)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)
    
    # Invalid club member
    if meeting.calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=meeting.calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
    # If user calendar
    if meeting.calendar.user is not None:
        # If user calendar is not user's, fail
        if meeting.calendar.user != request.user:
            return JsonResponse({"error" : "Cannot delete calendar of another user"}, status=403)
    meeting.delete()
    return JsonResponse({"status": "deleted"})


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_meeting(request, meeting_id):
    try:
        meeting = Meeting.objects.get(id=meeting_id)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)
    
    # Invalid club member
    if meeting.calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=meeting.calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
    # Invalid user id
    if meeting.calendar.user is not None:
        if meeting.calendar.user != request.user:
            return JsonResponse({"error" : "Cannot delete calendar of another user"}, status=403)
    meeting.delete()
    return JsonResponse({"status": "deleted"})
