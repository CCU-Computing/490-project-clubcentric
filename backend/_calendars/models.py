from django.db import models
from _club.models import Club
from django.contrib.auth.models import User

class Calendar(models.Model):
    name = models.CharField(max_length=50)
    
    club = models.ForeignKey(
        Club, 
        null=True,
        blank=True,
        on_delete=models.CASCADE, 
        related_name="calendars")
    
    user = models.OneToOneField(
        User, 
        null=True,
        blank=True,
        on_delete=models.CASCADE, 
        related_name="calendar")

    def __str__(self):
        return f"{self.club.name}"
    
    # constraint check to make sure user calendar OR club calendar
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(club__isnull=False, user__isnull=True) |
                    models.Q(club__isnull=True, user__isnull=False)
                ),
                name="calendar_owner_exclusive"
            ),
        ]
    
class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.calendar.club.name} meeting @ {self.date}"