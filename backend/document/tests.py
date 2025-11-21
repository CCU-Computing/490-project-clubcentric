from django.test import TestCase, Client
from users.models import User
from clubs.models import Club, Membership
from document.models import DocumentManager, Document
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile


class BaseDocumentTestCase(TestCase):
    """Base test case with common setup for all document tests"""

    def setUp(self):
        """Set up test client and create test users and clubs"""
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

        # Create test club
        self.club = Club.objects.create(
            name='Test Club',
            description='Test Description'
        )

    def create_test_file(self, filename='test.txt', content=b'Test file content'):
        """Helper method to create a test file"""
        return SimpleUploadedFile(filename, content, content_type='text/plain')


class DocumentManagerTests(BaseDocumentTestCase):
    """Test document manager CRUD operations"""

    def test_create_user_manager(self):
        """Test creating a user document manager"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/create/', {
            'name': 'My Documents'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)
        self.assertIn('id', response.json())

        # Verify manager was created
        manager = DocumentManager.objects.get(name='My Documents')
        self.assertEqual(manager.user, self.user1)
        self.assertIsNone(manager.club)

    def test_create_club_manager(self):
        """Test creating a club document manager"""
        Membership.objects.create(user=self.user1, club=self.club, role='organizer')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/create/', {
            'name': 'Club Documents',
            'club_id': self.club.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify manager was created
        manager = DocumentManager.objects.get(name='Club Documents')
        self.assertEqual(manager.club, self.club)
        self.assertIsNone(manager.user)

    def test_create_club_manager_requires_organizer(self):
        """Test creating club manager requires organizer role"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/create/', {
            'name': 'Club Documents',
            'club_id': self.club.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_create_manager_missing_name(self):
        """Test creating manager fails with missing name"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/create/', {})

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_get_user_managers(self):
        """Test getting user's document managers"""
        DocumentManager.objects.create(name='Manager 1', user=self.user1)
        DocumentManager.objects.create(name='Manager 2', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/documents/managers/get/')

        self.assertEqual(response.status_code, 200)
        managers = response.json()
        self.assertEqual(len(managers), 2)
        self.assertEqual(managers[0]['name'], 'Manager 1')
        self.assertEqual(managers[1]['name'], 'Manager 2')

    def test_get_club_managers(self):
        """Test getting club's document managers"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')
        DocumentManager.objects.create(name='Club Manager 1', club=self.club)
        DocumentManager.objects.create(name='Club Manager 2', club=self.club)

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/managers/get/?club_id={self.club.id}')

        self.assertEqual(response.status_code, 200)
        managers = response.json()
        self.assertEqual(len(managers), 2)

    def test_get_club_managers_requires_membership(self):
        """Test getting club managers requires membership"""
        DocumentManager.objects.create(name='Club Manager', club=self.club)

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/managers/get/?club_id={self.club.id}')

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_get_club_managers_club_not_found(self):
        """Test getting managers for non-existent club"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/documents/managers/get/?club_id=99999')

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_update_manager_name(self):
        """Test updating manager name"""
        manager = DocumentManager.objects.create(name='Old Name', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/update/', {
            'manager_id': manager.id,
            'name': 'New Name'
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify update
        manager.refresh_from_db()
        self.assertEqual(manager.name, 'New Name')

    def test_update_club_manager_requires_organizer(self):
        """Test updating club manager requires organizer role"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')
        manager = DocumentManager.objects.create(name='Club Manager', club=self.club)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/update/', {
            'manager_id': manager.id,
            'name': 'New Name'
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_update_manager_duplicate_name(self):
        """Test updating to duplicate name fails"""
        DocumentManager.objects.create(name='Existing Name', user=self.user1)
        manager = DocumentManager.objects.create(name='Old Name', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/update/', {
            'manager_id': manager.id,
            'name': 'Existing Name'
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_update_manager_missing_fields(self):
        """Test updating manager with missing fields"""
        manager = DocumentManager.objects.create(name='Manager', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/update/', {
            'manager_id': manager.id
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_update_manager_not_found(self):
        """Test updating non-existent manager"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/update/', {
            'manager_id': 99999,
            'name': 'New Name'
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_delete_manager(self):
        """Test deleting document manager"""
        manager = DocumentManager.objects.create(name='Manager', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        manager_id = manager.id
        response = self.client.post('/documents/managers/delete/', {
            'manager_id': manager_id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify deletion
        self.assertFalse(DocumentManager.objects.filter(id=manager_id).exists())

    def test_delete_club_manager_requires_organizer(self):
        """Test deleting club manager requires organizer role"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')
        manager = DocumentManager.objects.create(name='Club Manager', club=self.club)

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/delete/', {
            'manager_id': manager.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_manager_not_found(self):
        """Test deleting non-existent manager"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/managers/delete/', {
            'manager_id': 99999
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())


class DocumentUploadTests(BaseDocumentTestCase):
    """Test document upload and retrieval operations"""

    def test_upload_document_to_user_manager(self):
        """Test uploading document to user manager"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('test.txt')

        response = self.client.post('/documents/upload/', {
            'title': 'Test Document',
            'manager_id': manager.id,
            'file': test_file
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)
        self.assertIn('id', response.json())

        # Verify document was created
        doc = Document.objects.get(title='Test Document')
        self.assertEqual(doc.document_manager, manager)
        self.assertTrue(doc.file)

    def test_upload_document_to_club_manager(self):
        """Test uploading document to club manager"""
        Membership.objects.create(user=self.user1, club=self.club, role='organizer')
        manager = DocumentManager.objects.create(name='Club Documents', club=self.club)

        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('club_doc.txt')

        response = self.client.post('/documents/upload/', {
            'title': 'Club Document',
            'manager_id': manager.id,
            'file': test_file
        })

        self.assertEqual(response.status_code, 200)
        doc = Document.objects.get(title='Club Document')
        self.assertEqual(doc.document_manager, manager)

    def test_upload_document_club_requires_organizer(self):
        """Test uploading to club manager requires organizer role"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')
        manager = DocumentManager.objects.create(name='Club Documents', club=self.club)

        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('test.txt')

        response = self.client.post('/documents/upload/', {
            'title': 'Test Document',
            'manager_id': manager.id,
            'file': test_file
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_upload_document_missing_title(self):
        """Test uploading without title fails"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)

        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('test.txt')

        response = self.client.post('/documents/upload/', {
            'manager_id': manager.id,
            'file': test_file
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_upload_document_missing_file(self):
        """Test uploading without file fails"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)

        self.client.login(username='testuser1', password='password123')

        response = self.client.post('/documents/upload/', {
            'title': 'Test Document',
            'manager_id': manager.id
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_upload_document_duplicate_title(self):
        """Test uploading with duplicate title fails"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)
        Document.objects.create(
            title='Existing Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('test2.txt')

        response = self.client.post('/documents/upload/', {
            'title': 'Existing Document',
            'manager_id': manager.id,
            'file': test_file
        })

        self.assertEqual(response.status_code, 409)
        self.assertIn('error', response.json())

    def test_upload_document_manager_not_found(self):
        """Test uploading to non-existent manager"""
        self.client.login(username='testuser1', password='password123')
        test_file = self.create_test_file('test.txt')

        response = self.client.post('/documents/upload/', {
            'title': 'Test Document',
            'manager_id': 99999,
            'file': test_file
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_get_document_by_id(self):
        """Test getting single document by ID"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)
        doc = Document.objects.create(
            title='Test Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/get/?document_id={doc.id}')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], 'Test Document')
        self.assertIn('file', data)

    def test_get_documents_by_manager(self):
        """Test getting all documents for a manager"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)
        Document.objects.create(title='Doc 1', document_manager=manager, file='doc1.txt')
        Document.objects.create(title='Doc 2', document_manager=manager, file='doc2.txt')

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/get/?manager_id={manager.id}')

        self.assertEqual(response.status_code, 200)
        docs = response.json()
        self.assertEqual(len(docs), 2)

    def test_get_club_document_requires_membership(self):
        """Test getting club document requires membership"""
        manager = DocumentManager.objects.create(name='Club Documents', club=self.club)
        doc = Document.objects.create(
            title='Club Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/get/?document_id={doc.id}')

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_get_document_not_found(self):
        """Test getting non-existent document"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.get('/documents/get/?document_id=99999')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_get_document_wrong_user(self):
        """Test user cannot get another user's document"""
        manager = DocumentManager.objects.create(name='User2 Documents', user=self.user2)
        doc = Document.objects.create(
            title='User2 Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        response = self.client.get(f'/documents/get/?document_id={doc.id}')

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_document(self):
        """Test deleting document"""
        manager = DocumentManager.objects.create(name='My Documents', user=self.user1)
        doc = Document.objects.create(
            title='Test Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        doc_id = doc.id
        response = self.client.post('/documents/delete/', {
            'doc_id': doc_id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], True)

        # Verify deletion
        self.assertFalse(Document.objects.filter(id=doc_id).exists())

    def test_delete_club_document_requires_organizer(self):
        """Test deleting club document requires organizer role"""
        Membership.objects.create(user=self.user1, club=self.club, role='member')
        manager = DocumentManager.objects.create(name='Club Documents', club=self.club)
        doc = Document.objects.create(
            title='Club Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/delete/', {
            'doc_id': doc.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_document_wrong_user(self):
        """Test user cannot delete another user's document"""
        manager = DocumentManager.objects.create(name='User2 Documents', user=self.user2)
        doc = Document.objects.create(
            title='User2 Document',
            document_manager=manager,
            file='test.txt'
        )

        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/delete/', {
            'doc_id': doc.id
        })

        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.json())

    def test_delete_document_not_found(self):
        """Test deleting non-existent document"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/delete/', {
            'doc_id': 99999
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_delete_document_missing_id(self):
        """Test deleting without document ID"""
        self.client.login(username='testuser1', password='password123')
        response = self.client.post('/documents/delete/', {})

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
