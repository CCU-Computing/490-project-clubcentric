from django.db import models
from clubs.models import Club
from calendar_app.models import Calendar, Meeting
from users.models import User


class Attendance(models.Model):
    """Tracks attendance for meetings"""
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='attendances')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    attended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['meeting', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.meeting} ({'Attended' if self.attended else 'Absent'})"


class Engagement(models.Model):
    """Tracks user engagement metrics for clubs"""
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='engagements')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='engagements')
    engagement_score = models.FloatField(default=0.0, help_text="Overall engagement score (0-100)")
    events_attended = models.IntegerField(default=0)
    events_missed = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['club', 'user']
        ordering = ['-engagement_score']

    def __str__(self):
        return f"{self.user.username} - {self.club.name} (Score: {self.engagement_score})"
