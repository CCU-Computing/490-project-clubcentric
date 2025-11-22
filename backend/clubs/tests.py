from django.test import TestCase, Client
from users.models import User
from clubs.models import Club, Membership, MergeRequest
from calendar_app.models import Calendar, Meeting
from document.models import DocumentManager, Document
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime


class BaseClubTestCase(TestCase):
    """Base test case with common setup for all club tests"""

    def setUp(self):
        """Set up test client and create test users"""
        self.client = Client()

        # Create test users
        self.user1 = User.objects.create(
            username='testuser1',
            email='test1@example.com',
            first_name='Test',
            last_name='User1'
        )
        self.user1.set_password('password123')
        self.user1.save()

        self.user2 = User.objects.create(
            username='testuser2',
            email='test2@example.com',
            first_name='Test',
            last_name='User2'
        )
        self.user2.set_password('password456')
        self.user2.save()

        self.user3 = User.objects.create(
            username='testuser3',
            email='test3@example.com',
            first_name='Test',
            last_name='User3'
        )
        self.user3.set_password('password789')
        self.user3.save()

    def create_test_image(self):
        """Helper method to create a test image file"""
        file = BytesIO()
        image = Image.new('RGB', (100, 100), color='blue')
        image.save(file, 'png')
        file.seek(0)
        return SimpleUploadedFile(
            'test_club_image.png',
            file.getvalue(),
            content_type='image/png'
        )


class ClubCRUDTests(BaseClubTestCase):
    """Test club CRUD operations"""

    def test_create_club_success(self):
        """Test successful club creation"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/create/', {
            'club_name': 'Test Club',
            'club_description': 'Test Description'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)
        self.assertIn('id', response.json())

        # Verify club was created
        club = Club.objects.get(name='Test Club')
        self.assertEqual(club.description, 'Test Description')

        # Verify organizer membership was created
        membership = Membership.objects.get(user=self.user1, club=club)
        self.assertEqual(membership.role, 'organizer')

    def test_create_club_missing_name(self):
        """Test club creation fails with missing name"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/create/', {
            'club_description': 'Test Description'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_create_club_missing_description(self):
        """Test club creation fails with missing description"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/create/', {
            'club_name': 'Test Club'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_create_club_duplicate_name(self):
        """Test club creation fails with duplicate name"""
        Club.objects.create(name='Test Club', description='Description')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/create/', {
            'club_name': 'Test Club',
            'club_description': 'Test Description'
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_create_club_requires_login(self):
        """Test club creation requires authentication"""
        response = self.client.post('/clubs/create/', {
            'club_name': 'Test Club',
            'club_description': 'Test Description'
        })
        self.assertIn(response.status_code, [302, 403])

    def test_view_all_clubs(self):
        """Test viewing all clubs"""
        Club.objects.create(name='Club 1', description='Description 1')
        Club.objects.create(name='Club 2', description='Description 2')

        response = self.client.get('/clubs/get/')

        self.assertEqual(response.status_code, 200)
        clubs = response.json()
        self.assertEqual(len(clubs), 2)
        self.assertEqual(clubs[0]['name'], 'Club 1')
        self.assertEqual(clubs[1]['name'], 'Club 2')

    def test_view_club_by_id(self):
        """Test viewing single club by ID"""
        club = Club.objects.create(name='Test Club', description='Test Description')

        response = self.client.get(f'/clubs/get/?club_id={club.id}')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Test Club')
        self.assertEqual(data['description'], 'Test Description')

    def test_view_club_not_found(self):
        """Test viewing non-existent club"""
        response = self.client.get('/clubs/get/?club_id=99999')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_update_club_name(self):
        """Test updating club name"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/update/', {
            'club_id': club.id,
            'club_name': 'Updated Club'
        })

        self.assertEqual(response.status_code, 200)
        club.refresh_from_db()
        self.assertEqual(club.name, 'Updated Club')

    def test_update_club_description(self):
        """Test updating club description"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/update/', {
            'club_id': club.id,
            'club_description': 'New Description'
        })

        self.assertEqual(response.status_code, 200)
        club.refresh_from_db()
        self.assertEqual(club.description, 'New Description')

    def test_update_club_picture(self):
        """Test updating club picture"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        image = self.create_test_image()

        response = self.client.post('/clubs/update/', {
            'club_id': club.id,
            'club_picture': image
        })

        self.assertEqual(response.status_code, 200)
        club.refresh_from_db()
        self.assertTrue(club.display_picture)

    def test_update_club_requires_organizer(self):
        """Test update club requires organizer role"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/update/', {
            'club_id': club.id,
            'club_name': 'Updated Club'
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_update_club_not_found(self):
        """Test updating non-existent club"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/update/', {
            'club_id': 99999,
            'club_name': 'Updated Club'
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_delete_club(self):
        """Test deleting club"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        club_id = club.id
        response = self.client.post('/clubs/delete/', {
            'club_id': club_id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify club was deleted
        self.assertFalse(Club.objects.filter(id=club_id).exists())

    def test_delete_club_requires_organizer(self):
        """Test delete club requires organizer role"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/delete/', {
            'club_id': club.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_club_not_found(self):
        """Test deleting non-existent club"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/delete/', {
            'club_id': 99999
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())


class MembershipTests(BaseClubTestCase):
    """Test membership operations"""

    def test_join_club(self):
        """Test user joining a club"""
        club = Club.objects.create(name='Test Club', description='Test Description')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/create/', {
            'club_id': club.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify membership was created
        membership = Membership.objects.get(user=self.user1, club=club)
        self.assertEqual(membership.role, 'member')

    def test_join_club_already_member(self):
        """Test joining club when already a member"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/create/', {
            'club_id': club.id
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_join_club_not_found(self):
        """Test joining non-existent club"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/create/', {
            'club_id': 99999
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_get_user_memberships(self):
        """Test getting all clubs for a user"""
        club1 = Club.objects.create(name='Club 1', description='Description 1')
        club2 = Club.objects.create(name='Club 2', description='Description 2')
        Membership.objects.create(user=self.user1, club=club1, role='member')
        Membership.objects.create(user=self.user1, club=club2, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/clubs/membership/get/')

        self.assertEqual(response.status_code, 200)
        memberships = response.json()
        self.assertEqual(len(memberships), 2)

    def test_get_club_members(self):
        """Test getting all members of a club"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/clubs/membership/get/?club_id={club.id}')

        self.assertEqual(response.status_code, 200)
        members = response.json()
        self.assertEqual(len(members), 2)

    def test_get_specific_membership(self):
        """Test getting specific user-club membership"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/clubs/membership/get/?club_id={club.id}&user_id={self.user2.id}')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['role'], 'member')

    def test_get_membership_not_found(self):
        """Test getting membership that doesn't exist"""
        club = Club.objects.create(name='Test Club', description='Test Description')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/clubs/membership/get/?club_id={club.id}&user_id={self.user2.id}')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_update_membership_promote_to_organizer(self):
        """Test promoting member to organizer"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/update/', {
            'user_id': self.user2.id,
            'club_id': club.id,
            'new_role': 'organizer'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify role was updated
        membership = Membership.objects.get(user=self.user2, club=club)
        self.assertEqual(membership.role, 'organizer')

    def test_update_membership_demote_to_member(self):
        """Test demoting organizer to member"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/update/', {
            'user_id': self.user2.id,
            'club_id': club.id,
            'new_role': 'member'
        })

        self.assertEqual(response.status_code, 200)
        membership = Membership.objects.get(user=self.user2, club=club)
        self.assertEqual(membership.role, 'member')

    def test_update_membership_requires_organizer(self):
        """Test updating membership requires organizer role"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/update/', {
            'user_id': self.user2.id,
            'club_id': club.id,
            'new_role': 'organizer'
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_update_own_membership_forbidden(self):
        """Test cannot update own membership"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/update/', {
            'user_id': self.user1.id,
            'club_id': club.id,
            'new_role': 'member'
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_update_membership_invalid_role(self):
        """Test updating with invalid role"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/update/', {
            'user_id': self.user2.id,
            'club_id': club.id,
            'new_role': 'invalid_role'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_delete_membership_leave_club(self):
        """Test user leaving a club"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/delete/', {
            'club_id': club.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify membership was deleted
        self.assertFalse(Membership.objects.filter(user=self.user1, club=club).exists())

    def test_delete_membership_organizer_removing_member(self):
        """Test organizer removing a member"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/delete/', {
            'club_id': club.id,
            'user_id': self.user2.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify membership was deleted
        self.assertFalse(Membership.objects.filter(user=self.user2, club=club).exists())

    def test_delete_membership_cannot_remove_organizer(self):
        """Test organizer cannot remove another organizer"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='organizer')
        Membership.objects.create(user=self.user2, club=club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/delete/', {
            'club_id': club.id,
            'user_id': self.user2.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_membership_requires_organizer_to_remove_others(self):
        """Test only organizer can remove other members"""
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')
        Membership.objects.create(user=self.user2, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/membership/delete/', {
            'club_id': club.id,
            'user_id': self.user2.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())


class MergeRequestTests(BaseClubTestCase):
    """Test club merge request operations"""

    def test_create_merge_request(self):
        """Test creating a merge request"""
        club1 = Club.objects.create(name='Club 1', description='Description 1')
        club2 = Club.objects.create(name='Club 2', description='Description 2')
        Membership.objects.create(user=self.user1, club=club1, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/merge_request/create/', {
            'club_id_1': club1.id,
            'club_id_2': club2.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify merge request was created
        merge_req = MergeRequest.objects.get(club_1=club1, club_2=club2)
        self.assertTrue(merge_req.accepted_1)
        self.assertFalse(merge_req.accepted_2)

    def test_create_merge_request_requires_organizer(self):
        """Test creating merge request requires organizer role"""
        club1 = Club.objects.create(name='Club 1', description='Description 1')
        club2 = Club.objects.create(name='Club 2', description='Description 2')
        Membership.objects.create(user=self.user1, club=club1, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/merge_request/create/', {
            'club_id_1': club1.id,
            'club_id_2': club2.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_create_merge_request_duplicate(self):
        """Test creating duplicate merge request fails"""
        club1 = Club.objects.create(name='Club 1', description='Description 1')
        club2 = Club.objects.create(name='Club 2', description='Description 2')
        Membership.objects.create(user=self.user1, club=club1, role='organizer')
        MergeRequest.objects.create(club_1=club1, club_2=club2)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/merge_request/create/', {
            'club_id_1': club1.id,
            'club_id_2': club2.id
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_delete_merge_request(self):
        """Test deleting a merge request"""
        club1 = Club.objects.create(name='Club 1', description='Description 1')
        club2 = Club.objects.create(name='Club 2', description='Description 2')
        Membership.objects.create(user=self.user1, club=club1, role='organizer')
        merge_req = MergeRequest.objects.create(club_1=club1, club_2=club2)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/clubs/merge_request/delete/', {
            'club_id': club1.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify merge request was deleted
        self.assertFalse(MergeRequest.objects.filter(id=merge_req.id).exists())
