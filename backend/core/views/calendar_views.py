
from django.http import JsonResponse
from backend.core.models.calendar_model import Calendar, Meeting
from clubs.models import Club, Membership
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from urllib.parse import parse_qs
from django.contrib.auth.models import User
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
@require_http_methods(["PUT"])
def update_calendar(request, calendar_id):
    '''Update a calendar's name'''
    calendar_name = request.PUT.get("calendar_name")

    if not calendar_name:
        return JsonResponse({"error": "Missing calendar_name"}, status=400)

    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return JsonResponse({"error": "Calendar not found"}, status=404)
    
    # For a club calendar, you have to be organizer or admin of the club
    if calendar.club is not None:
        if not Membership.objects.filter(user=request.user, club=calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
            
    # For a user calendar, you have to be the calendar owner
    elif calendar.user is not None:
        if calendar.user != request.user:
            return JsonResponse({"error" : "Cannot update calendar of another user"}, status=403)
            
    calendar.name = calendar_name
    calendar.save()
    
    return JsonResponse({
        "cal_id": calendar.id,
        "cal_name": calendar.name,
        "status": "updated"
    })



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
@require_http_methods(["PUT"])
def update_meeting(request, meeting_id):
    datetime_str = request.PUT.get("datetime_str")
    description = request.PUT.get("description")
    try:
        meeting = Meeting.objects.get(id=meeting_id)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)
    calendar = meeting.calendar
    
    # Club calendar authorization
    if calendar.club is not None:
        # Check for organizer or admin role
        if not Membership.objects.filter(user=request.user, club=calendar.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club"}, status=403)
            
    # User calendar authorization
    elif calendar.user is not None:
        # Check if the meeting is on the current user's personal calendar
        if calendar.user != request.user:
            return JsonResponse({"error" : "Cannot update meeting on another user's calendar"}, status=403)
    
    new_date = None
    # Only proceed if the client actually sent a datetime string
    if datetime_str:
        new_date = parse_datetime(datetime_str)
        if not new_date:
            return JsonResponse({"error": "Invalid date format"}, status=400)
    
    # Conflict Check (Only if date is changing) ---
    if new_date and new_date != meeting.date:
        # Check if any other meeting on this calendar is at the new time.
        if calendar.meetings.exclude(id=meeting_id).filter(date=new_date).exists():
            return JsonResponse({"error" : "Another meeting already exists at this new time on this calendar"}, status=409 )
    
    # Update meeting with values only if valid values were passed in
    if new_date:
        meeting.date = new_date
    if description is not None:
        meeting.description = description
    
    meeting.save()
    
    return JsonResponse({
        "status": "success",
        "message": f"Meeting {meeting_id} updated successfully.",
        "meet_id": meeting.id,
        "cal_id" : calendar.id,
    })


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
