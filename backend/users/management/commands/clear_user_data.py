from django.core.management.base import BaseCommand
from django.db import transaction, connection
from users.models import User
from clubs.models import Club, Membership, MergeRequest
from calendar_app.models import Calendar, Meeting
from document.models import DocumentManager, Document


class Command(BaseCommand):
    help = 'Clears all user-entered data while preserving superuser accounts'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Skip confirmation prompt',
        )

    def handle(self, *args, **options):
        # Get counts before deletion
        regular_users_count = User.objects.filter(is_superuser=False).count()
        superusers_count = User.objects.filter(is_superuser=True).count()
        clubs_count = Club.objects.count()
        calendars_count = Calendar.objects.count()
        meetings_count = Meeting.objects.count()
        doc_managers_count = DocumentManager.objects.count()
        documents_count = Document.objects.count()
        memberships_count = Membership.objects.count()
        merge_requests_count = MergeRequest.objects.count()

        # Display what will be deleted
        self.stdout.write(self.style.WARNING('\nThe following data will be DELETED:'))
        self.stdout.write(f'  - Regular users: {regular_users_count}')
        self.stdout.write(f'  - Clubs: {clubs_count}')
        self.stdout.write(f'  - Memberships: {memberships_count}')
        self.stdout.write(f'  - Merge requests: {merge_requests_count}')
        self.stdout.write(f'  - Calendars: {calendars_count}')
        self.stdout.write(f'  - Meetings: {meetings_count}')
        self.stdout.write(f'  - Document managers: {doc_managers_count}')
        self.stdout.write(f'  - Documents: {documents_count}')

        self.stdout.write(self.style.SUCCESS(f'\nThe following data will be PRESERVED:'))
        self.stdout.write(f'  - Superusers: {superusers_count}')

        # Confirm deletion
        if not options['no_input']:
            confirm = input('\nAre you sure you want to delete all this data? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.ERROR('Operation cancelled.'))
                return

        # Use TRUNCATE CASCADE for clean deletion
        try:
            self.stdout.write('\nDeleting data using TRUNCATE CASCADE...')

            with connection.cursor() as cursor:
                # TRUNCATE removes all data and resets sequences
                # CASCADE automatically handles foreign key dependencies
                tables_to_truncate = [
                    'calendar_app_meeting',
                    'calendar_app_calendar',
                    'document_document',
                    'document_documentmanager',
                    'clubs_mergerequest',
                    'clubs_membership',
                    'clubs_club',
                ]

                for table in tables_to_truncate:
                    try:
                        cursor.execute(f'TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;')
                        self.stdout.write(f'  Truncated {table}')
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'  Warning truncating {table}: {str(e)}'))

                # Delete regular users (preserve superusers) - can't use TRUNCATE here
                cursor.execute('DELETE FROM users_user WHERE is_superuser = FALSE;')
                user_count = cursor.rowcount
                self.stdout.write(f'  Deleted {user_count} regular users')

            self.stdout.write(self.style.SUCCESS('\nSuccessfully cleared all user data!'))
            self.stdout.write(self.style.SUCCESS(f'Superuser accounts preserved: {superusers_count}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nError clearing data: {str(e)}'))
            raise
