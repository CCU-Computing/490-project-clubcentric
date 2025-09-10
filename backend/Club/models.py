from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"Club: {self.name}"
    
class Meetings(models.Model):
    calendar = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.calendar.name} @ {self.date}"