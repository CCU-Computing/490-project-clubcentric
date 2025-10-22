from django.db import models
from club.models import Club
from user.models import User
class Calendar(models.Model):
    name = models.CharField(max_length=50)
    
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="calendars")
    user = 

    def __str__(self):
        return f"{self.club.name}"
    
class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.calendar.club.name} meeting @ {self.date}"