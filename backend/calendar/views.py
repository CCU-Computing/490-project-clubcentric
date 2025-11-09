
from django.http import JsonResponse
from calendar.models import Calendar, Meeting
from clubs.models import Club, Membership
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from urllib.parse import parse_qs
from models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.decorators import login_required
from users.views import is_member
'''CALENDARS'''


@csrf_exempt
@require_POST
@login_required
def create_calendar(request):
    '''Create a blank calendar'''
    club_id = request.POST.get("club_id")
    calendar_name = request.POST.get("calendar_name")

    # error checking
    if not calendar_name:
        return JsonResponse({"error" : "Missing required fields"}, status=400)

    # Club calendar
    if club_id:
        
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error" : "Club not found"}, status=404)
        
        if not is_member(user=request.user, club=club, role="organizer"):
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
        
        calendar = Calendar.objects.create(name=calendar_name, club=club, user=None)
        return JsonResponse({"status" : True, "id": calendar.id})
    
    # User calendar
    else:
        if Calendar.objects.filter(name=calendar_name).exists():
            return JsonResponse({"error": "calendar with this name already exists"}, status=409)
        calendar = Calendar.objects.create(name=calendar_name, club=None, user=request.user)
        return JsonResponse({"status" : True, "id": calendar.id})

@login_required
@csrf_exempt
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
  
@login_required
@require_POST
@csrf_exempt
def update_calendar(request):
    cal_id = request.POST.get("cal_id")
    cal_name = request.POST.get("cal_name")

    if not cal_id or not cal_name:
        return JsonResponse({"error": "missing required fields"}, status=400)
    
    try:
        calendar = Calendar.objects.get(id=cal_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "calendar not found"}, status=404)
    
    # User calendar
    if calendar.user:
        if Calendar.objects.filter(user=request.user, name=cal_name).exists():
            return JsonResponse({"error": "A calendar with this name already exists"}, status=409)
        
        if calendar.user != request.user:
            return JsonResponse({"error" : "this calendar does not belong to you"}, status=403)
        
        calendar.name = cal_name
        calendar.save()
        return JsonResponse({"status": True})
    
    # Club calendar
    if calendar.club:
        if not is_member(user=request.user, club=calendar.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of the associated club"}, status=403)
        
        if Calendar.objects.filter(club=calendar.club, name=cal_name).exists():
            return JsonResponse({"error": "A calendar with this name already exists"}, status=409)
        
        calendar.name = cal_name
        calendar.save()
        return JsonResponse({"status": True})
    
    return JsonResponse({"error": "club fields error"}, status=400)

@csrf_exempt
@login_required
@require_POST
def delete_calendar(request):
    cal_id = request.POST.get("cal_id")
    try:
        calendar = Calendar.objects.get(id=cal_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found"}, status=404)
    
    # User cal
    if calendar.user:
        if calendar.user != request.user:
            return JsonResponse({"error" : "this calendar does not belong to you"}, status=403)
        calendar.meetings.all().delete()
        calendar.delete()
        return JsonResponse({"status": True})
    
    # Club Calendar
    if calendar.club:
        if not is_member(user=request.user, club=calendar.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of the associated club"}, status=403)
        calendar.meetings.all().delete()
        calendar.delete()
        return JsonResponse({"status": True})

    return JsonResponse({"status": False})


'''MEETINGS '''

@csrf_exempt
@require_POST
@login_required
def create_meeting(request):
    calendar_id = request.POST.get("calendar_id")
    datetime_str = request.POST.get("datetime_str")
    description = request.POST.get("description")

    if not calendar_id or not datetime_str or not description:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    date = parse_datetime(datetime_str)
    if not date:
        return JsonResponse({"error": "Invalid date format"}, status=400)

    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found"}, status=404)
    
    # Club calendar
    if calendar.club:
        if not is_member(user=request.user, club=calendar.club, role="organizer"):
            return JsonResponse({"error" : "You are not a member of this club"}, status=403) 
        meets = Meeting.objects.filter(calendar=calendar)
        for meet in meets:
            if meet.date == date:
                return JsonResponse({"error" : "Meeting already exists at this time"}, status=409)
        
        meeting = Meeting.objects.create(calendar=calendar, date=date, description=description)

        return JsonResponse({"status": True, "meet_id": meeting.id})
    
    # User calendar
    if calendar.user:
        if calendar.user != request.user:
            return JsonResponse({"error": "this calendar does not belong to you"}, status=403)
        
        meets = Meeting.objects.filter(calendar=calendar)
        for meet in meets:
            if meet.date == date:
                return JsonResponse({"error" : "Meeting already exists at this time"}, status=409)
        
        meeting = Meeting.objects.create(calendar=calendar, date=date, description=description)

        return JsonResponse({"status" : True, "meet_id": meeting.id})

@login_required
@csrf_exempt
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
@login_required
@require_POST
def update_meeting(request):
    meet_id = request.POST.get("meet_id")
    desc = request.POST.get("desc")
    if not meet_id or not desc:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        meeting = Meeting.objects.get(id=meet_id)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)
    
    calendar = meeting.calendar
    
    # Club
    if calendar.club:
        if not is_member(user=request.user, club=calendar.club, role="organizer"):
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
        meeting.description = desc
        meeting.save()
        return JsonResponse({"status": True})
    
    # User
    if calendar.user:
        if calendar.user != request.user:
            return JsonResponse({"error": "this meeting does not belong to you"}, status=403)
        meeting.description = desc
        meeting.save()
        return JsonResponse({"status": True})
    
    return JsonResponse({"status" : False})

@csrf_exempt
@login_required
@require_POST
def delete_meeting(request):
    meet_id = request.POST.get("meet_id")
    if not meet_id:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        meeting = Meeting.objects.get(id=meet_id)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)
    
    calendar = meeting.calendar
    
    # Club
    if calendar.club:
        if not is_member(user=request.user, club=calendar.club, role="organizer"):
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
        meeting.delete()
        return JsonResponse({"status": True})
    
    # User
    if calendar.user:
        if calendar.user != request.user:
            return JsonResponse({"error": "this meeting does not belong to you"}, status=403)
        meeting.delete()
        return JsonResponse({"status": True})
    
    return JsonResponse({"status" : False})
