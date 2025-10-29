from django.db import models
from club.models import Club
from django.contrib.auth.models import User

'''
MAY NOT BE USED -- DJANGO HAS BUILT IN USER
'''

class UserProfile(models.Model):
    name = models.CharField(max_length=50)
    bio = models.CharField(max_length=300)

    clubs = models.ManyToManyField(Club, on_delete=models.CASCADE, related_name="clubs")
    def __str__(self):
        return f"User: {self.name}"

