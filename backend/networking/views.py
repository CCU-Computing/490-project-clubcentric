from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from users.models import User
from django.db.models import Q
from clubs.models import Club
from .models import UserConnection, NetworkProfile, ClubMembership
import json


@csrf_exempt
@require_http_methods(["GET"])
def network_users_list(request):
    """Get list of users for networking. Supports search and filtering."""
    try:
        search_query = request.GET.get('search', '').strip()
        limit = int(request.GET.get('limit', 50))
        exclude_self = request.GET.get('exclude_self', 'true').lower() == 'true'
        
        # Get current user if authenticated
        current_user_id = None
        if hasattr(request, 'user') and request.user.is_authenticated:
            current_user_id = request.user.id
        
        # Base queryset - try to use select_related, but handle if table doesn't exist
        try:
            users = User.objects.filter(is_active=True).select_related('network_profile')
        except Exception:
            # Table doesn't exist, use basic query
            users = User.objects.filter(is_active=True)
        
        # Exclude current user if requested
        if exclude_self and current_user_id:
            users = users.exclude(id=current_user_id)
        
        # Search filter
        if search_query:
            try:
                users = users.filter(
                    Q(username__icontains=search_query) |
                    Q(first_name__icontains=search_query) |
                    Q(last_name__icontains=search_query) |
                    Q(email__icontains=search_query) |
                    Q(network_profile__bio__icontains=search_query) |
                    Q(network_profile__skills__icontains=search_query)
                )
            except Exception:
                # If network_profile table doesn't exist, search without it
                users = users.filter(
                    Q(username__icontains=search_query) |
                    Q(first_name__icontains=search_query) |
                    Q(last_name__icontains=search_query) |
                    Q(email__icontains=search_query)
                )
        
        # Limit results - convert to list to avoid lazy evaluation issues
        users = list(users[:limit])
        
        # Get connection status for current user - handle if table doesn't exist
        connections_map = {}
        if current_user_id:
            try:
                connections = UserConnection.objects.filter(
                    Q(from_user_id=current_user_id) | Q(to_user_id=current_user_id)
                ).select_related('from_user', 'to_user')
                
                for conn in connections:
                    other_user_id = conn.to_user_id if conn.from_user_id == current_user_id else conn.from_user_id
                    connections_map[other_user_id] = {
                        'status': conn.status,
                        'is_sent': conn.from_user_id == current_user_id,
                        'connection_id': conn.id
                    }
            except Exception:
                # Table doesn't exist, connections_map will remain empty
                pass
        
        # Build response
        users_data = []
        for user in users:
            try:
                profile = getattr(user, 'network_profile', None)
                
                # Safely extract skills and interests
                skills_list = []
                interests_list = []
                if profile:
                    if hasattr(profile, 'skills') and profile.skills:
                        try:
                            skills_list = profile.skills.split(',')
                        except (AttributeError, TypeError):
                            skills_list = []
                    if hasattr(profile, 'interests') and profile.interests:
                        try:
                            interests_list = profile.interests.split(',')
                        except (AttributeError, TypeError):
                            interests_list = []
                
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or '',
                    'email': user.email or '',
                    'full_name': user.get_full_name() or user.username,
                    'bio': getattr(profile, 'bio', '') if profile else '',
                    'skills': [s.strip() for s in skills_list if s and s.strip()],
                    'interests': [i.strip() for i in interests_list if i and i.strip()],
                    'linkedin_url': getattr(profile, 'linkedin_url', '') if profile else '',
                    'github_url': getattr(profile, 'github_url', '') if profile else '',
                    'connection_status': connections_map.get(user.id, None),
                }
                users_data.append(user_data)
            except Exception as e:
                # Skip users that cause errors, but log them
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error processing user {user.id}: {str(e)}")
                continue
        
        return JsonResponse({
            'users': users_data,
            'count': len(users_data),
            'search_query': search_query
        })
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'users': [],
            'count': 0
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def network_connections(request):
    """Get connections for the current user"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        status_filter = request.GET.get('status', 'accepted')  # pending, accepted, all
        
        # Get connections where user is involved
        connections = UserConnection.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user)
        ).select_related('from_user', 'to_user')
        
        if status_filter != 'all':
            connections = connections.filter(status=status_filter)
        
        connections_data = []
        for conn in connections:
            other_user = conn.to_user if conn.from_user == request.user else conn.from_user
            profile = getattr(other_user, 'network_profile', None)
            
            connections_data.append({
                'id': conn.id,
                'user': {
                    'id': other_user.id,
                    'username': other_user.username,
                    'full_name': other_user.get_full_name() or other_user.username,
                    'bio': profile.bio if profile else '',
                    'email': other_user.email,
                },
                'status': conn.status,
                'is_sent': conn.from_user == request.user,
                'message': conn.message,
                'created_at': conn.created_at.isoformat(),
            })
        
        return JsonResponse({
            'connections': connections_data,
            'count': len(connections_data)
        })
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'connections': [],
            'count': 0
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def network_connect(request):
    """Send a connection request to another user"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        to_user_id = request.GET.get('user_id')
        message = request.GET.get('message', '')
        
        if not to_user_id:
            return JsonResponse({'error': 'user_id is required'}, status=400)
        
        try:
            to_user = User.objects.get(id=to_user_id, is_active=True)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        if to_user == request.user:
            return JsonResponse({'error': 'Cannot connect to yourself'}, status=400)
        
        # Check if connection already exists
        existing = UserConnection.objects.filter(
            Q(from_user=request.user, to_user=to_user) |
            Q(from_user=to_user, to_user=request.user)
        ).first()
        
        if existing:
            return JsonResponse({
                'error': 'Connection already exists',
                'status': existing.status,
                'connection_id': existing.id
            }, status=400)
        
        # Create connection request
        connection = UserConnection.objects.create(
            from_user=request.user,
            to_user=to_user,
            status='pending',
            message=message
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Connection request sent',
            'connection_id': connection.id,
            'status': connection.status
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def network_accept(request):
    """Accept a connection request"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        connection_id = request.GET.get('connection_id')
        
        if not connection_id:
            return JsonResponse({'error': 'connection_id is required'}, status=400)
        
        try:
            connection = UserConnection.objects.get(
                id=connection_id,
                to_user=request.user,
                status='pending'
            )
        except UserConnection.DoesNotExist:
            return JsonResponse({'error': 'Connection request not found'}, status=404)
        
        connection.status = 'accepted'
        connection.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Connection accepted',
            'connection_id': connection.id
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def network_suggestions(request):
    """Get network suggestions based on common clubs"""
    try:
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        limit = int(request.GET.get('limit', 10))
        
        # Get user's club memberships
        user_clubs = ClubMembership.objects.filter(
            user=request.user
        ).values_list('club_id', flat=True)
        
        if not user_clubs:
            return JsonResponse({
                'suggestions': [],
                'count': 0
            })
        
        # Get users in same clubs
        suggested_users = User.objects.filter(
            club_memberships__club_id__in=user_clubs,
            is_active=True
        ).exclude(id=request.user.id).distinct()
        
        # Exclude users already connected
        existing_connections = UserConnection.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user)
        ).values_list('from_user_id', 'to_user_id')
        
        connected_user_ids = set()
        for from_id, to_id in existing_connections:
            if from_id == request.user.id:
                connected_user_ids.add(to_id)
            else:
                connected_user_ids.add(from_id)
        
        suggested_users = suggested_users.exclude(id__in=connected_user_ids)
        
        # Limit and get profiles
        suggested_users = suggested_users.select_related('network_profile')[:limit]
        
        suggestions_data = []
        for user in suggested_users:
            profile = getattr(user, 'network_profile', None)
            # Get common clubs
            common_clubs = Club.objects.filter(
                network_members__user=user,
                id__in=user_clubs
            ).values_list('name', flat=True).distinct()
            
            suggestions_data.append({
                'id': user.id,
                'username': user.username,
                'full_name': user.get_full_name() or user.username,
                'bio': profile.bio if profile else '',
                'common_clubs': list(common_clubs),
                'common_clubs_count': len(common_clubs),
            })
        
        return JsonResponse({
            'suggestions': suggestions_data,
            'count': len(suggestions_data)
        })
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'suggestions': [],
            'count': 0
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def network_stats(request):
    """Get networking statistics for the current user"""
    try:
        # Check authentication - handle both AnonymousUser and None
        if not hasattr(request, 'user') or not request.user or not request.user.is_authenticated:
            return JsonResponse({
                'error': 'Authentication required',
                'total_connections': 0,
                'pending_sent': 0,
                'pending_received': 0,
                'club_memberships': 0
            }, status=401)
        
        # Count connections
        total_connections = UserConnection.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user),
            status='accepted'
        ).count()
        
        pending_sent = UserConnection.objects.filter(
            from_user=request.user,
            status='pending'
        ).count()
        
        pending_received = UserConnection.objects.filter(
            to_user=request.user,
            status='pending'
        ).count()
        
        # Count club memberships
        club_count = ClubMembership.objects.filter(
            user=request.user
        ).count()
        
        return JsonResponse({
            'total_connections': total_connections,
            'pending_sent': pending_sent,
            'pending_received': pending_received,
            'club_memberships': club_count,
        })
    
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
