from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from clubs.models import Club
from calendar_app.models import Calendar, Meeting
from .models import Attendance, Engagement


@csrf_exempt
@require_GET
def analytics_overview(request):
    """Get overall analytics for all clubs"""
    try:
        # Get all clubs
        clubs = Club.objects.all()
        
        # Get all meetings
        club_meetings = Meeting.objects.filter(calendar__club__isnull=False)
        total_events = club_meetings.count()
        
        # Get upcoming events (next 30 days)
        upcoming_date = timezone.now() + timedelta(days=30)
        upcoming_events = club_meetings.filter(date__gte=timezone.now(), date__lte=upcoming_date).count()
        
        # Get past events
        past_events = club_meetings.filter(date__lt=timezone.now()).count()
        
        # Calculate average attendance
        total_attendances = Attendance.objects.filter(attended=True).count()
        total_possible_attendances = Attendance.objects.count()
        avg_attendance_rate = (total_attendances / total_possible_attendances * 100) if total_possible_attendances > 0 else 0
        
        # Get top clubs by engagement
        top_clubs = Engagement.objects.values('club__name', 'club__id').annotate(
            avg_engagement=Avg('engagement_score'),
            total_members=Count('user', distinct=True)
        ).order_by('-avg_engagement')[:5]
        
        return JsonResponse({
            'total_clubs': clubs.count(),
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'past_events': past_events,
            'average_attendance_rate': round(avg_attendance_rate, 2),
            'top_clubs': list(top_clubs)
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_GET
def analytics_club_detail(request):
    """Get detailed analytics for a specific club"""
    try:
        club_id = request.GET.get('club_id')
        if not club_id:
            return JsonResponse({'error': 'club_id parameter required'}, status=400)
        
        club = Club.objects.get(id=club_id)
        
        # Get club calendar and meetings
        calendar = Calendar.objects.filter(club=club).first()
        if not calendar:
            return JsonResponse({
                'club_id': club.id,
                'club_name': club.name,
                'total_events': 0,
                'upcoming_events': 0,
                'past_events': 0,
                'average_attendance': 0,
                'total_members': 0,
                'average_engagement': 0,
                'recent_events': []
            })
        
        meetings = Meeting.objects.filter(calendar=calendar)
        total_events = meetings.count()
        
        # Upcoming and past events
        upcoming_events = meetings.filter(date__gte=timezone.now()).count()
        past_events = meetings.filter(date__lt=timezone.now()).count()
        
        # Attendance data - handle case where table doesn't exist
        avg_attendance = 0
        total_attendance = 0
        try:
            attendances = Attendance.objects.filter(meeting__calendar=calendar)
            total_attendances = attendances.filter(attended=True).count()
            total_possible = attendances.count()
            total_attendance = total_attendances
            avg_attendance = (total_attendances / total_possible * 100) if total_possible > 0 else 0
        except Exception as e:
            # Table doesn't exist or query failed - use defaults
            # This will happen if analytics_attendance table doesn't exist
            avg_attendance = 0
            total_attendance = 0
        
        # Engagement data - handle case where table doesn't exist
        total_members = 0
        avg_engagement = 0
        engagement_level = "Low"
        try:
            engagements = Engagement.objects.filter(club=club)
            total_members = engagements.count()
            avg_engagement = engagements.aggregate(Avg('engagement_score'))['engagement_score__avg'] or 0
            # Determine engagement level
            if avg_engagement >= 70:
                engagement_level = "High"
            elif avg_engagement >= 40:
                engagement_level = "Medium"
            else:
                engagement_level = "Low"
        except Exception as e:
            # Table doesn't exist or query failed - use defaults
            # This will happen if analytics_engagement table doesn't exist
            total_members = 0
            avg_engagement = 0
            engagement_level = "Low"
        
        # Recent events (last 10)
        recent_events = meetings.order_by('-date')[:10].values(
            'id', 'date', 'description'
        )
        
        # Prepare events over time data (for line chart)
        events_over_time = []
        try:
            # Group meetings by date for timeline
            from django.db.models import Count
            from django.db.models.functions import TruncDate
            events_by_date = meetings.annotate(
                date_only=TruncDate('date')
            ).values('date_only').annotate(
                count=Count('id')
            ).order_by('date_only')[:30]  # Last 30 days
            
            events_over_time = [
                {
                    'date': str(item['date_only']),
                    'events': item['count']
                }
                for item in events_by_date
            ]
        except Exception:
            events_over_time = []
        
        # Prepare recent attendance data (for bar chart)
        recent_attendance = []
        try:
            # Get attendance for recent meetings
            recent_meetings = meetings.order_by('-date')[:10]
            for meeting in recent_meetings:
                try:
                    attended_count = Attendance.objects.filter(
                        meeting=meeting,
                        attended=True
                    ).count()
                    recent_attendance.append({
                        'date': meeting.date.strftime('%Y-%m-%d'),
                        'attendance': attended_count
                    })
                except Exception:
                    # Skip if attendance table doesn't exist for this meeting
                    continue
        except Exception:
            recent_attendance = []
        
        # Prepare events distribution (for pie chart)
        events_distribution = []
        try:
            # Group by month
            from django.db.models import Count
            from django.db.models.functions import TruncMonth
            events_by_month = meetings.annotate(
                month=TruncMonth('date')
            ).values('month').annotate(
                count=Count('id')
            ).order_by('-month')[:6]  # Last 6 months
            
            events_distribution = [
                {
                    'month': item['month'].strftime('%b %Y') if item['month'] else 'Unknown',
                    'count': item['count'],
                    'percentage': round((item['count'] / total_events * 100) if total_events > 0 else 0, 1)
                }
                for item in events_by_month
            ]
        except Exception:
            events_distribution = []
        
        return JsonResponse({
            'club_id': club.id,
            'club_name': club.name,
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'past_events': past_events,
            'average_attendance': round(avg_attendance, 2),
            'total_attendance': total_attendance,
            'total_members': total_members,
            'average_engagement': round(avg_engagement, 2),
            'engagement_level': engagement_level,
            'events_over_time': events_over_time,
            'recent_attendance': recent_attendance,
            'events_distribution': events_distribution,
            'recent_events': list(recent_events)
        })
    except Club.DoesNotExist:
        return JsonResponse({'error': 'Club not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
