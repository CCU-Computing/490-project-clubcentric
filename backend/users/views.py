from users.models import User
from django.http import JsonResponse
from backend.core.models.calendar_model import Calendar, Meeting
from clubs.models import Club, Membership
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from core.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required

@csrf_exempt
@require_POST
def login_user(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    if not username or not password:
        return JsonResponse({'error': "missing fields"}, status=400)
    
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({'success': True, 'user_id': user.id})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
''' CRUD for user '''

@csrf_exempt
@require_POST
def create_user(request):
    ''' Create a new user '''
    
    required = ["username", "password", "first_name", "last_name", "email"]
    missing = [f for f in required if f not in request or not request[f]]
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
    return JsonResponse({"user_id": new_user.id, 'username' : new_user.username})

@login_required
def get_user_data(request):

    bio = request.user.bio or None


    profile_picture = None
    if request.user.profile_picture:
        profile_picture = request.build_absolute_url(request.user.profile_picture.url)

    response = {
        "username": request.user.username,
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "bio": bio,
        "profile_picture": profile_picture
    }
    return JsonResponse(response)

@csrf_exempt
@require_POST
@login_required
def update_user(request):

    ''' Update non critical user fields '''
    required = ["username", "password", "first_name", "last_name", "email"]
    all_missing = all(f not in request or not request[f] for f in required)
    
    if all_missing:
        return JsonResponse({"error" : "Missing required field(s)"}, status=400)

    username = request.POST.get('username')
    first_name = request.POST.get('first_name')
    last_name = request.POST.get('last_name')
    email = request.POST.get('email')
    bio = request.POST.get('bio')
    profile_picture = request.FILES.get('profile_picture')

    user = User.objects.get(id=request.user.id)
    updated = []
    
    # Update username
    if username:
        # Already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error' : 'username already exists.'}, status=409) 

        user.username = username
        updated.append(('username', user.username))
    
    # Update first name
    if first_name:
        user.first_name = first_name
        updated.append(('first_name', user.first_name))

    # Update last name
    if last_name:
        user.last_name = last_name
        updated.append(('last_name', user.last_name))

    # Update email
    if email:
        user.email = email
        updated.append(('email', user.email))

    # Update bio
    if bio:
        user.bio = bio
        updated.append(('bio', user.bio))

    # Update profile_picture
    if profile_picture:
        user.profile_picture = profile_picture
        updated.append(('profile_picture', user.profile_picture))

    user.save()
    return JsonResponse(updated, safe=False)

@csrf_exempt
@require_POST
@login_required
def update_password(request):
    password = request.POST.get('password')
    
    if not password:
        return JsonResponse({"error": "missing fields"}, status=400)

    request.user.set_password(password)

    request.user.save()

    return JsonResponse({"sucess": "password updated"})

@csrf_exempt
@require_POST
@login_required
def delete_user(request):
    request.user.delete()
    return JsonResponse({"success": True})