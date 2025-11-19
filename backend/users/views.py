from users.models import User
from django.http import JsonResponse
from calendar_app.models import Calendar, Meeting
from clubs.models import Club, Membership
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from .models import User
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required


''' INTERNAL LOGIC -- NOT CALLED BY URL '''
def is_member(user: User, club: Club, role='default'):
    ''' Check if user is a member of a club, with an optional role '''

    qs = Membership.objects.filter(user=user, club=club)
    if role != "default":
        qs = qs.filter(role=role)
    return qs.exists()

@require_POST
def login_user(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    if not username or not password:
        return JsonResponse({'error': "missing fields"}, status=400)
    
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({'status': True})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

@login_required
@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"status": True})
''' CRUD for user '''

@require_POST
def create_user(request):
    ''' Create a new user '''
    
    required = ["username", "password", "first_name", "last_name", "email"]
    missing = [f for f in required if not request.POST.get(f)]
    if missing:
        return JsonResponse({"error" : "Missing required fields"}, status=400)

    username = request.POST.get('username')
    password = request.POST.get('password')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    
    if User.objects.filter(username=username).exists():
       return JsonResponse({'error' : 'username already exists.'}, status=409) 
    
    new_user = User.objects.create(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        )
    
    new_user.set_password(password)
    new_user.save()
    return JsonResponse({"status" : True, "user_id": new_user.id})

@login_required
def get_user_data(request):
    user_id = request.GET.get("user_id")
    
    # Get own data
    if not user_id:
        response = {
            "id": request.user.id,
            "username": request.user.username,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "bio": request.user.bio or "",
            "profile_picture": request.user.profile_picture.url if request.user.profile_picture else None
        }
        return JsonResponse(response)
    
    # Get someone else's data
    else:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "user not found"}, status=404)
        
        bio = user.bio or None
        profile_picture = user.profile_picture.url or None

        response = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "bio": bio,
            "profile_picture": profile_picture
        }
        return JsonResponse(response)

@require_POST
@login_required
def update_user(request):

    ''' Update non critical user fields '''
    required = ["username", "first_name", "last_name", "email", "bio", "profile_picture"]
    
    if all(not request.POST.get(f) for f in required):
        return JsonResponse({"error" : "Missing required field(s)"}, status=400)

    username = request.POST.get('username')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    bio = request.POST.get('bio')
    profile_picture = request.FILES.get('profile_picture')
    
    # Update username
    if username:
        # Already exists
        if User.objects.filter(username=username).exclude(id=request.user.id).exists():
            return JsonResponse({'error' : 'username already exists.'}, status=409) 
        request.user.username = username
    
    # Update first name
    if first_name:
        request.user.first_name = first_name

    # Update last name
    if last_name:
        request.user.last_name = last_name

    # Update email
    if email:
        request.user.email = email

    # Update bio
    if bio:
        request.user.bio = bio

    # Update profile_picture
    if profile_picture:
        request.user.profile_picture = profile_picture

    request.user.save()
    return JsonResponse({"status" : True})

@require_POST
@login_required
def update_password(request):
    password = request.POST.get('password')
    
    if not password:
        return JsonResponse({"error": "missing fields"}, status=400)

    request.user.set_password(password)
    request.user.save()

    # Maintain login for user
    update_session_auth_hash(request, request.user)

    return JsonResponse({"status": True})

@require_POST
@login_required
def delete_user(request):
    request.user.delete()
    logout(request)
    return JsonResponse({"status": True})