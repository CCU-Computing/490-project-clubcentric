from django.test import TestCase, Client
from django.urls import reverse
from users.models import User
from clubs.models import Club, Membership
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile


class BaseTestCase(TestCase):
    """Base test case with common setup for all user tests"""

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

    def create_test_image(self):
        """Helper method to create a test image file"""
        file = BytesIO()
        image = Image.new('RGB', (100, 100), color='red')
        image.save(file, 'png')
        file.seek(0)
        return SimpleUploadedFile(
            'test_image.png',
            file.getvalue(),
            content_type='image/png'
        )


class UserAuthenticationTests(BaseTestCase):
    """Test user authentication operations"""

    def test_login_success(self):
        """Test successful login with valid credentials"""
        response = self.client.post('/user/login/', {
            'username': 'testuser1',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

    def test_login_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        response = self.client.post('/user/login/', {
            'username': 'testuser1',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    def test_login_missing_username(self):
        """Test login fails with missing username"""
        response = self.client.post('/user/login/', {
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_login_missing_password(self):
        """Test login fails with missing password"""
        response = self.client.post('/user/login/', {
            'username': 'testuser1'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_logout_success(self):
        """Test successful logout"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

    def test_logout_requires_login(self):
        """Test logout requires authentication"""
        response = self.client.post('/user/logout/')
        # Should redirect to login or return 302/403
        self.assertIn(response.status_code, [302, 403])


class UserCRUDTests(BaseTestCase):
    """Test user CRUD operations"""

    def test_create_user_success(self):
        """Test successful user creation"""
        response = self.client.post('/user/register/', {
            'username': 'newuser',
            'password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User',
            'email': 'new@example.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)
        self.assertIn('user_id', response.json())

        # Verify user was created
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'new@example.com')
        self.assertTrue(user.check_password('newpass123'))

    def test_create_user_duplicate_username(self):
        """Test user creation fails with duplicate username"""
        response = self.client.post('/user/register/', {
            'username': 'testuser1',
            'password': 'password123',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_create_user_missing_username(self):
        """Test user creation fails with missing username"""
        response = self.client.post('/user/register/', {
            'password': 'password123',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_create_user_missing_required_fields(self):
        """Test user creation fails with missing required fields"""
        required_fields = ['username', 'password', 'first_name', 'last_name', 'email']

        for field in required_fields:
            data = {
                'username': 'testuser',
                'password': 'password123',
                'first_name': 'Test',
                'last_name': 'User',
                'email': 'test@example.com'
            }
            del data[field]

            response = self.client.post('/user/register/', data)
            self.assertEqual(response.status_code, 400)
            self.assertIn('error', response.json())

    def test_get_user_data_current_user(self):
        """Test getting current user data"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/user/get/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['username'], 'testuser1')
        self.assertEqual(data['email'], 'test1@example.com')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User1')
        self.assertIn('clubs', data)

    def test_get_user_data_other_user(self):
        """Test getting other user's data"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/user/get/?user_id={self.user2.id}')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['username'], 'testuser2')

    def test_get_user_data_not_found(self):
        """Test getting non-existent user"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/user/get/?user_id=99999')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_get_user_data_requires_login(self):
        """Test get user data requires authentication"""
        response = self.client.get('/user/get/')
        self.assertIn(response.status_code, [302, 403])

    def test_get_user_data_includes_clubs(self):
        """Test user data includes their clubs"""
        # Create a club and add user1 as member
        club = Club.objects.create(name='Test Club', description='Test Description')
        Membership.objects.create(user=self.user1, club=club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/user/get/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['clubs']), 1)
        self.assertEqual(data['clubs'][0]['name'], 'Test Club')

    def test_update_user_username(self):
        """Test updating user username"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update/', {
            'username': 'updateduser'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify update
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.username, 'updateduser')

    def test_update_user_duplicate_username(self):
        """Test updating to duplicate username fails"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update/', {
            'username': 'testuser2'
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_update_user_email(self):
        """Test updating user email"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update/', {
            'email': 'newemail@example.com'
        })

        self.assertEqual(response.status_code, 200)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.email, 'newemail@example.com')

    def test_update_user_bio(self):
        """Test updating user bio"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update/', {
            'bio': 'This is my bio'
        })

        self.assertEqual(response.status_code, 200)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.bio, 'This is my bio')

    def test_update_user_profile_picture(self):
        """Test updating user profile picture"""
        self.client.login(username='testuser1', password='password123')
        image = self.create_test_image()

        response = self.client.post('/user/update/', {
            'profile_picture': image
        })

        self.assertEqual(response.status_code, 200)
        self.user1.refresh_from_db()
        self.assertTrue(self.user1.profile_picture)

    def test_update_user_empty_username(self):
        """Test updating to empty username fails"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update/', {
            'username': ''
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_update_user_requires_login(self):
        """Test update user requires authentication"""
        response = self.client.post('/user/update/', {
            'username': 'newusername'
        })
        self.assertIn(response.status_code, [302, 403])

    def test_delete_user(self):
        """Test deleting user"""
        self.client.login(username='testuser1', password='password123')
        user_id = self.user1.id

        response = self.client.post('/user/delete/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify user was deleted
        self.assertFalse(User.objects.filter(id=user_id).exists())

    def test_delete_user_requires_login(self):
        """Test delete user requires authentication"""
        response = self.client.post('/user/delete/')
        self.assertIn(response.status_code, [302, 403])


class UserPasswordTests(BaseTestCase):
    """Test user password operations"""

    def test_update_password_success(self):
        """Test successful password update"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update_password/', {
            'password': 'newpassword123'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify password was changed
        self.user1.refresh_from_db()
        self.assertTrue(self.user1.check_password('newpassword123'))
        self.assertFalse(self.user1.check_password('password123'))

    def test_update_password_maintains_session(self):
        """Test password update maintains user session"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update_password/', {
            'password': 'newpassword123'
        })

        self.assertEqual(response.status_code, 200)

        # Verify still logged in by making authenticated request
        response = self.client.get('/user/get/')
        self.assertEqual(response.status_code, 200)

    def test_update_password_missing_field(self):
        """Test password update fails with missing password"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/user/update_password/', {})

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_update_password_requires_login(self):
        """Test password update requires authentication"""
        response = self.client.post('/user/update_password/', {
            'password': 'newpassword'
        })
        self.assertIn(response.status_code, [302, 403])
