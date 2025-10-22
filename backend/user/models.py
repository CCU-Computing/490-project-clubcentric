from django.db import models
from club.models import Club

class User(models.Model):
    name = models.CharField(max_length=50)
    bio = models.CharField(max_length=300)

    clubs = models.ManyToManyField(Club, on_delete=models.CASCADE, related_name="users")
    def __str__(self):
        return f"User: {self.name}"

