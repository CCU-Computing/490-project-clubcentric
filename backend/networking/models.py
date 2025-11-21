from django.db import models
from users.models import User
from clubs.models import Club


class UserConnection(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('blocked', 'Blocked'),
    ]
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    message = models.TextField(blank=True, help_text="Optional message when sending connection request")
    
    class Meta:
        unique_together = ['from_user', 'to_user']
        ordering = ['-created_at']
        verbose_name_plural = "User Connections"
    
    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({self.status})"


class NetworkProfile(models.Model):
    """Extended profile for networking features"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='network_profile')
    bio = models.TextField(blank=True, max_length=500)
    skills = models.CharField(max_length=200, blank=True, help_text="Comma-separated list of skills")
    interests = models.CharField(max_length=200, blank=True, help_text="Comma-separated list of interests")
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Network Profile: {self.user.username}"


class ClubMembership(models.Model):
    """Tracks which clubs users are members of for networking suggestions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_memberships')
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='network_members')
    role = models.CharField(max_length=50, default='member', choices=[
        ('member', 'Member'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    ])
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'club']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.club.name} ({self.role})"
