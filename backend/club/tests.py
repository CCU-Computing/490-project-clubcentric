from django.test import TestCase
from club.models import Club
from django.urls import reverse

# models.py tests

class MyModelTestCase(TestCase):
    def setUp(self):
        # Create initial data for tests
        Club.objects.create(name="Test Item", description="Test Description")

    def test_my_model_creation(self):
        """Tests that the model was created correctly."""
        item = Club.objects.get(name="Test Item")
        # Assertions
        self.assertEqual(item.description, "Test Description")
        self.assertTrue(item.name.startswith('Test'))



#------------------------
# views.py tests

class ClubViewTests(TestCase):

    def setUp(self):
        # Create an initial club for testing retrieval and conflicts
        self.club1 = Club.objects.create(
            name="Alpha Club", 
            description="First test club"
        )
        self.club2 = Club.objects.create(
            name="Beta Club", 
            description="Second test club"
        )

        # Define URLs using the 'name' attributes from your urls.py
        self.create_url = reverse('create_club')
        self.view_url = reverse('view_clubs')

# ====================================================================
# TESTS FOR THE create_club VIEW (POST /new/)
# ====================================================================

    def test_create_club_success(self):
        """Tests successful creation of a new club using the 'new/' path."""
        new_club_name = "Sigma Club"
        new_club_desc = "Erm what the sigma?"

        # The data is passed via query parameters as per your views.py logic
        url_with_params = f"{self.create_url}?club_name={new_club_name}&club_description={new_club_desc}"
        response = self.client.post(url_with_params)

        # Check Status Code (200 OK)
        self.assertEqual(response.status_code, 200)

        # Check Database State
        self.assertTrue(Club.objects.filter(name=new_club_name).exists())

        # Check JSON Response Content
        data = response.json()
        self.assertIn('id', data)
        self.assertEqual(data['name'], new_club_name)

    def test_create_club_missing_fields(self):
        """Tests failure when required fields are missing."""
        
        # Missing description
        response_missing_desc = self.client.post(f"{self.create_url}?club_name=Test")
        self.assertEqual(response_missing_desc.status_code, 400)
        self.assertIn('Missing required fields', response_missing_desc.json()['error'])

    def test_create_club_already_exists(self):
        """Tests failure when a club with the same name already exists (Conflict)."""
        
        # Attempt to create a club with the same name as self.club1
        url_conflict = f"{self.create_url}?club_name={self.club1.name}&club_description=Some Desc"
        response = self.client.post(url_conflict)

        # Check Status Code (409 Conflict)
        self.assertEqual(response.status_code, 409)
        
        # Check JSON Response Content
        self.assertIn('Club already exists', response.json()['error'])


# ====================================================================
# TESTS FOR THE view_clubs VIEW (GET /)
# ====================================================================

    def test_view_clubs_all(self):
        """Tests retrieval of all clubs when no ID is provided (at the root '/')."""
        
        response = self.client.get(self.view_url)

        # Check Status Code (200 OK)
        self.assertEqual(response.status_code, 200)

        # Check that the response is a list
        self.assertTrue(isinstance(response.json(), list))
        
        # Check that both clubs created in setUp are present
        self.assertEqual(len(response.json()), 2)

    def test_view_clubs_by_id_success(self):
        """Tests retrieval of a single club using its ID."""
        
        # Append the ID as a query parameter
        response = self.client.get(f"{self.view_url}?club_id={self.club2.id}")

        # Check Status Code (200 OK)
        self.assertEqual(response.status_code, 200)

        # Check JSON Response Content
        data = response.json()
        self.assertEqual(data['id'], self.club2.id)
        self.assertEqual(data['name'], "Beta Club")

    def test_view_clubs_not_found(self):
        """Tests failure when an invalid club ID is provided (Not Found)."""
        
        # Use an ID that is guaranteed not to exist
        non_existent_id = 999 
        response = self.client.get(f"{self.view_url}?club_id={non_existent_id}")

        # Check Status Code (404 Not Found)
        self.assertEqual(response.status_code, 404)
        
        # Check JSON Response Content
        self.assertIn('Club not found', response.json()['error'])