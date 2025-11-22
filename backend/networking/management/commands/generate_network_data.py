"""
Django management command to generate mock networking data
Usage: python manage.py generate_network_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from users.models import User
from clubs.models import Club
from networking.models import NetworkProfile, UserConnection, ClubMembership
from django.db.models import Q


class Command(BaseCommand):
    help = 'Generate mock data for networking features (profiles, connections, memberships)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=20,
            help='Number of users to create (default: 20)',
        )
        parser.add_argument(
            '--connections',
            type=int,
            default=30,
            help='Number of connections to create (default: 30)',
        )
        parser.add_argument(
            '--use-existing',
            action='store_true',
            help='Use existing users instead of creating new ones',
        )

    def handle(self, *args, **options):
        num_users = options['users']
        num_connections = options['connections']
        use_existing = options['use_existing']

        self.stdout.write(self.style.SUCCESS('Generating networking mock data...'))

        # Skills and interests pools for realistic data
        skills_pool = [
            'Python', 'JavaScript', 'React', 'Django', 'Node.js', 'SQL',
            'Project Management', 'Public Speaking', 'Event Planning',
            'Graphic Design', 'Photography', 'Video Editing', 'Marketing',
            'Data Analysis', 'Web Development', 'Mobile Development',
            'UI/UX Design', 'Content Writing', 'Social Media', 'Leadership'
        ]

        interests_pool = [
            'Technology', 'Art', 'Music', 'Sports', 'Gaming', 'Reading',
            'Travel', 'Photography', 'Cooking', 'Fitness', 'Movies',
            'Entrepreneurship', 'Education', 'Environment', 'Volunteering',
            'Startups', 'Innovation', 'Networking', 'Career Development'
        ]

        bios = [
            'Software Developer passionate about web technologies',
            'Event Coordinator with 5+ years experience',
            'Marketing Specialist focused on digital campaigns',
            'Student Leader and Community Organizer',
            'Creative Designer and Visual Storyteller',
            'Data Analyst interested in business intelligence',
            'Project Manager with strong organizational skills',
            'Content Creator and Social Media Expert',
            'Tech Enthusiast and Open Source Contributor',
            'Business Development Professional'
        ]

        # Get or create users
        if use_existing:
            users = list(User.objects.filter(is_active=True)[:num_users])
            if len(users) < num_users:
                self.stdout.write(
                    self.style.WARNING(
                        f'Only {len(users)} existing users found. Creating {num_users - len(users)} more...'
                    )
                )
                users.extend(self._create_users(num_users - len(users)))
        else:
            users = self._create_users(num_users)

        self.stdout.write(self.style.SUCCESS(f'Working with {len(users)} users'))

        # Create network profiles for users
        profiles_created = 0
        for user in users:
            profile, created = NetworkProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': random.choice(bios),
                    'skills': ', '.join(random.sample(skills_pool, k=random.randint(2, 5))),
                    'interests': ', '.join(random.sample(interests_pool, k=random.randint(2, 4))),
                    'linkedin_url': f'https://linkedin.com/in/{user.username}' if random.random() > 0.3 else '',
                    'github_url': f'https://github.com/{user.username}' if random.random() > 0.5 else '',
                }
            )
            if created:
                profiles_created += 1

        self.stdout.write(self.style.SUCCESS(f'Created/updated {profiles_created} network profiles'))

        # Create club memberships (link users to clubs)
        clubs = list(Club.objects.all())
        if clubs:
            memberships_created = 0
            roles = ['member', 'organizer', 'admin']
            
            for user in users:
                # Each user joins 1-3 random clubs
                num_clubs = random.randint(1, min(3, len(clubs)))
                user_clubs = random.sample(clubs, k=num_clubs)
                
                for club in user_clubs:
                    membership, created = ClubMembership.objects.get_or_create(
                        user=user,
                        club=club,
                        defaults={
                            'role': random.choice(roles),
                        }
                    )
                    if created:
                        memberships_created += 1

            self.stdout.write(self.style.SUCCESS(f'Created {memberships_created} club memberships'))
        else:
            self.stdout.write(
                self.style.WARNING('No clubs found. Skipping club memberships. Run fixtures first.')
            )

        # Create connections between users
        connections_created = 0
        statuses = ['pending', 'accepted']
        status_weights = [0.3, 0.7]  # 30% pending, 70% accepted

        # Ensure we don't create more connections than possible
        max_connections = len(users) * (len(users) - 1) // 2
        num_connections = min(num_connections, max_connections)

        created_pairs = set()
        attempts = 0
        max_attempts = num_connections * 10

        while connections_created < num_connections and attempts < max_attempts:
            attempts += 1
            
            # Pick two random different users
            from_user, to_user = random.sample(users, 2)
            
            # Ensure we don't create duplicate connections
            pair = tuple(sorted([from_user.id, to_user.id]))
            if pair in created_pairs:
                continue
            
            # Don't connect user to themselves
            if from_user == to_user:
                continue

            # Check if connection already exists (in either direction)
            existing = UserConnection.objects.filter(
                (Q(from_user=from_user, to_user=to_user) |
                 Q(from_user=to_user, to_user=from_user))
            ).exists()

            if existing:
                continue

            # Create connection
            status = random.choices(statuses, weights=status_weights)[0]
            message = '' if status == 'accepted' else random.choice([
                'Hi! Would love to connect.',
                'Interested in collaborating on projects.',
                'Let\'s network!',
                'Would like to connect with you.',
                ''
            ])

            UserConnection.objects.create(
                from_user=from_user,
                to_user=to_user,
                status=status,
                message=message
            )

            created_pairs.add(pair)
            connections_created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {connections_created} user connections'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Networking Mock Data Generation Complete!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Users: {len(users)}')
        self.stdout.write(f'Network Profiles: {NetworkProfile.objects.count()}')
        self.stdout.write(f'User Connections: {UserConnection.objects.count()}')
        self.stdout.write(f'Club Memberships: {ClubMembership.objects.count()}')
        self.stdout.write(self.style.SUCCESS('='*50))

    def _create_users(self, count):
        """Helper method to create users"""
        users = []
        base_username = 'networkuser'
        
        for i in range(count):
            username = f'{base_username}{i+1}'
            email = f'{username}@example.com'
            
            # Check if user already exists
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': random.choice(['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn']),
                    'last_name': random.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']),
                    'is_active': True,
                }
            )
            
            if created:
                user.set_password('testpass123')
                user.save()
                self.stdout.write(f'  Created user: {user.username}')
            
            users.append(user)
        
        return users
