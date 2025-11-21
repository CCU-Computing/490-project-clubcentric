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
@csrf_exempt
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
@csrf_exempt
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


@require_GET
@login_required
def get_user_data(request):
    user_id = request.GET.get("user_id")
    
    # Determine which user we are looking for
    target_user = request.user
    if user_id:
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "user not found"}, status=404)
    
    # --- NEW LOGIC: Fetch Clubs ---
    # Get all memberships for this user
    memberships = Membership.objects.filter(user=target_user)
    clubs_list = []

    for m in memberships:
        clubs_list.append({
            "id": m.club.id,
            "name": m.club.name,
            "description": m.club.description,
            "tags": m.club.tags,
            "role": m.role, # Useful to know if they are admin/organizer
            "summary": m.club.summary # Including this just in case
        })
    # ------------------------------

    # Construct the response
    response = {
        "id": target_user.id,
        "username": target_user.username,
        "first_name": target_user.first_name,
        "last_name": target_user.last_name,
        "email": target_user.email,
        "bio": target_user.bio or "",
        "profile_picture": request.build_absolute_uri(target_user.profile_picture.url) if target_user.profile_picture else None,
        "clubs": clubs_list # <--- Send the clubs data to frontend
    }

    return JsonResponse(response)


@require_POST
@login_required
def update_user(request):
    username = request.POST.get('username')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    bio = request.POST.get('bio')
    profile_picture = request.FILES.get('profile_picture')

    if username is not None:
        if not username.strip():
            return JsonResponse({'error': 'Username cannot be empty.'}, status=400)
        
        if User.objects.filter(username=username).exclude(id=request.user.id).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=409)
        request.user.username = username

    if email is not None:
        if not email.strip():
            return JsonResponse({'error': 'Email cannot be empty.'}, status=400)
        request.user.email = email

    if first_name is not None:
        request.user.first_name = first_name

    if last_name is not None:
        request.user.last_name = last_name

    if bio is not None:
        request.user.bio = bio

    if profile_picture:
        request.user.profile_picture = profile_picture

    try:
        request.user.save()
        return JsonResponse({"status": True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


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