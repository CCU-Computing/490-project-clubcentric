from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from clubs.models import Club, Membership
from .models import Calendar, Meeting

User = get_user_model()

class CalendarViewsTest(TestCase):
    def setUp(self):
        """Create users, clubs, and client"""
        self.client = Client()
        self.user = User.objects.create_user(username="alice", password="testpass")
        self.club = Club.objects.create(name="Chess Club", description="Chess fans unite")
        Membership.objects.create(user=self.user, club=self.club, role="organizer")
        
        # Log user in
        self.client.login(username="alice", password="testpass")

    def test_create_user_calendar(self):
        """User can create a personal calendar"""
        response = self.client.post(reverse("calendar-create"), {
            "calendar_name": "Personal Cal"
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Calendar.objects.filter(name="Personal Cal", user=self.user).exists())

    def test_create_club_calendar(self):
        """Organizer can create a club calendar"""
        response = self.client.post(reverse("calendar-create"), {
            "calendar_name": "Club Cal",
            "club_id": self.club.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Calendar.objects.filter(name="Club Cal", club=self.club).exists())

    def test_get_user_calendars(self):
        """Fetch all calendars belonging to a user"""
        cal = Calendar.objects.create(name="TestCal", user=self.user)
        response = self.client.get(reverse("calendar-get"), {"user_id": self.user.id})
        self.assertEqual(response.status_code, 200)
        self.assertIn("TestCal", str(response.content))

    def test_get_club_calendars(self):
        """Fetch all calendars belonging to a club"""
        cal = Calendar.objects.create(name="ClubCal", club=self.club)
        response = self.client.get(reverse("calendar-get"), {"club_id": self.club.id})
        self.assertEqual(response.status_code, 200)
        self.assertIn("ClubCal", str(response.content))

    def test_update_calendar(self):
        """Rename an existing calendar"""
        cal = Calendar.objects.create(name="OldName", user=self.user)
        response = self.client.post(reverse("calendar-update"), {
            "cal_id": cal.id,
            "cal_name": "NewName"
        })
        cal.refresh_from_db()
        self.assertEqual(cal.name, "NewName")

    def test_delete_calendar(self):
        """Delete an existing calendar"""
        cal = Calendar.objects.create(name="DeleteMe", user=self.user)
        response = self.client.post(reverse("calendar-delete"), {"cal_id": cal.id})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Calendar.objects.filter(id=cal.id).exists())


class MeetingViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="bob", password="testpass")
        self.client.login(username="bob", password="testpass")
        self.cal = Calendar.objects.create(name="MyCal", user=self.user)

    def test_create_meeting(self):
        """Create a meeting on user's calendar"""
        response = self.client.post(reverse("meeting-create"), {
            "calendar_id": self.cal.id,
            "datetime_str": timezone.now().isoformat(),
            "description": "Project sync"
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Meeting.objects.filter(calendar=self.cal).exists())

    def test_get_meetings_list(self):
        """List all meetings for a calendar"""
        Meeting.objects.create(calendar=self.cal, date=timezone.now(), description="Discuss plan")
        response = self.client.get(reverse("meeting-list"), {"calendar_id": self.cal.id})
        self.assertEqual(response.status_code, 200)
        self.assertIn("Discuss plan", str(response.content))

    def test_update_meeting(self):
        """Update meeting description"""
        meet = Meeting.objects.create(calendar=self.cal, date=timezone.now(), description="Old desc")
        response = self.client.post(reverse("meeting-update"), {
            "meet_id": meet.id,
            "desc": "New desc"
        })
        meet.refresh_from_db()
        self.assertEqual(meet.description, "New desc")

    def test_delete_meeting(self):
        """Delete a meeting"""
        meet = Meeting.objects.create(calendar=self.cal, date=timezone.now(), description="Temp")
        response = self.client.post(reverse("meeting-delete"), {"meet_id": meet.id})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Meeting.objects.filter(id=meet.id).exists())
