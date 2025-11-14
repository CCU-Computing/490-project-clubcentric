from django.db import models
from django.contrib.auth.models import User

class Club(models.Model):
    name = models.CharField(max_length=50)
    #Short description displayed when searching
    description = models.CharField(max_length=200)
    
    #Long summary for the club page
    summary = models.CharField(max_length=1000)

    #Link for the YouTube video embed
    videoEmbed = models.CharField(max_length=400)

    #members = models.ManyToManyField(User, on_delete=models.CASCADE, related_name="clubs")
    def __str__(self):
        return f"Club: {self.name}\nMembers:"

