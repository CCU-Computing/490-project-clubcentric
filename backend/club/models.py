from django.db import models
from user.models import UserProfile
from django.contrib.auth.models import User

class Club(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=300)

    members = models.ManyToManyField(User, on_delete=models.CASCADE, related_name="clubs")
    def __str__(self):
        return f"Club: {self.name}\nMembers:"

