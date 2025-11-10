from django.db import models
from clubs.models import Club
from users.models import User
from django.core.exceptions import ValidationError

class Calendar(models.Model):
    name = models.CharField(max_length=50)
    
    club = models.ForeignKey(
        Club, 
        null=True,
        blank=True,
        on_delete=models.CASCADE, 
        related_name="calendars")
    
    user = models.ForeignKey(
        User, 
        null=True,
        blank=True,
        on_delete=models.CASCADE, 
        related_name="calendars")

    def clean(self):
        if not (self.user or self.club):
            raise ValidationError("Calendar must belong to a user or a club")
        if self.user and self.club:
            raise ValidationError("Calendar cannot belong to both a user and a club")
    
class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()
    description = models.TextField(null=True)
