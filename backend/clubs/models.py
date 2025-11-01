from django.db import models

# Club model
class Club(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    display_picture = models.ImageField(upload_to="clubs/", blank=True)
    links = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"Club: {self.name}"
    
# Membership model - defines how users and clubs are linked
class Membership(models.Model):
    # A membership is tied to one user and club at a time
    # Multiple memberships can exist for a club or user
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    # Roles each user can have in a club
    role = models.CharField(max_length=50, choices=[
        ('member', 'Member'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    ])
    date_joined = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'club')
