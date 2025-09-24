from django.db import models

class Calendar(models.Model):
    club = models.OneToOneField("club.Club", on_delete=models.CASCADE, related_name="calendar")

    def __str__(self):
        return f"{self.club.name}"
    
class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.calendar.club.name} meeting @ {self.date}"