"""
Django management command to generate mock analytics data
Usage: python manage.py generate_analytics_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from clubs.models import Club
from calendar_app.models import Calendar, Meeting
from analytics.models import Attendance, Engagement
from users.models import User


class Command(BaseCommand):
    help = 'Generate mock data for analytics testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clubs',
            type=int,
            default=5,
            help='Number of clubs to create events for (default: 5)',
        )
        parser.add_argument(
            '--events-per-club',
            type=int,
            default=10,
            help='Number of events per club (default: 10)',
        )

    def handle(self, *args, **options):
        num_clubs = options['clubs']
        events_per_club = options['events_per_club']

        self.stdout.write(self.style.SUCCESS('Generating mock analytics data...'))

        # Get existing clubs or create new ones
        existing_clubs = Club.objects.all()
        clubs = list(existing_clubs)
        
        # If we have existing clubs, use them (from fixtures)
        if clubs:
            self.stdout.write(self.style.SUCCESS(f'Using {len(clubs)} existing clubs from fixtures'))
            # Only create events for the number of clubs requested
            clubs = clubs[:num_clubs] if len(clubs) >= num_clubs else clubs
        else:
            # Create new clubs if none exist
            clubs = []
            club_names = [
                'Computer Science Club', 'Photography Society', 'Music Club',
                'Debate Team', 'Chess Club', 'Dance Team', 'Art Society',
                'Engineering Club', 'Business Club', 'Sports Club'
            ]

            for i in range(num_clubs):
                club_name = club_names[i % len(club_names)] if i < len(club_names) else f'Club {i+1}'
                club, created = Club.objects.get_or_create(
                    name=club_name,
                    defaults={
                        'description': f'Description for {club_name}',
                        'summary': f'This is a summary for {club_name}. We organize various events and activities.',
                        'videoEmbed': ''
                    }
                )
                clubs.append(club)
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created club: {club.name}'))

        # Create calendars and meetings for each club
        total_meetings = 0
        total_attendances = 0
        total_engagements = 0
        
        for club in clubs:
            calendar, created = Calendar.objects.get_or_create(
                name=f'{club.name} Calendar',
                club=club
            )

            # Create meetings spread over the last 6 months
            for j in range(events_per_club):
                # Random date in the last 6 months
                days_ago = random.randint(0, 180)
                event_date = timezone.now() - timedelta(days=days_ago)
                
                # Add some randomness to time
                event_date = event_date.replace(
                    hour=random.randint(10, 18),
                    minute=random.choice([0, 15, 30, 45])
                )

                meeting = Meeting.objects.create(
                    calendar=calendar,
                    date=event_date
                )
                total_meetings += 1

                # Create some attendance tracking (random 50-90% attendance)
                num_attendees = random.randint(5, 30)
                for k in range(num_attendees):
                    # Create or get users for attendance
                    attendee_user, _ = User.objects.get_or_create(
                        username=f'attendee_{club.id}_{j}_{k}',
                        defaults={'email': f'attendee_{club.id}_{j}_{k}@example.com'}
                    )
                    
                    # 80% chance of attending
                    attended = random.random() < 0.8
                    Attendance.objects.get_or_create(
                        meeting=meeting,
                        user=attendee_user,
                        defaults={'attended': attended}
                    )
                    total_attendances += 1

                # Create engagement data for users in this club
                for user in User.objects.all()[:10]:  # Limit to first 10 users
                    events_attended = Attendance.objects.filter(
                        user=user,
                        meeting__calendar__club=club,
                        attended=True
                    ).count()
                    events_missed = Attendance.objects.filter(
                        user=user,
                        meeting__calendar__club=club,
                        attended=False
                    ).count()
                    
                    if events_attended + events_missed > 0:
                        engagement_score = (events_attended / (events_attended + events_missed)) * 100
                        Engagement.objects.get_or_create(
                            club=club,
                            user=user,
                            defaults={
                                'engagement_score': round(engagement_score, 2),
                                'events_attended': events_attended,
                                'events_missed': events_missed
                            }
                        )
                        total_engagements += 1

        self.stdout.write(self.style.SUCCESS(
            f'\n[OK] Mock analytics data generated successfully!'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'  - Clubs: {len(clubs)}'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'  - Total Events: {total_meetings}'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'  - Total Attendances: {total_attendances}'
        ))
        self.stdout.write(self.style.SUCCESS(
            f'  - Total Engagements: {total_engagements}'
        ))


