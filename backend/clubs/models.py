from django.db import models
from users.models import User
from django.contrib.postgres.fields import ArrayField

# Club model
class Club(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    summary = models.TextField(blank=True, default="")
    videoEmbed = models.TextField(blank=True, default="None")
    display_picture = models.ImageField(upload_to="clubs/", blank=True)
    links = models.JSONField(default=list, blank=True)
    tags = ArrayField(
        models.CharField(max_length=25),
        default=list,
        blank=True
    )
    lastMeetingDate = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Club: {self.name}"
    
# Membership model - defines how users and clubs are linked
class Membership(models.Model):
    # A membership is tied to one user and club at a time
    # Multiple memberships can exist for a club or user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="member_user")
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="member_club")
    # Roles each user can have in a club
    role = models.CharField(max_length=50, choices=[
        ('member', 'Member'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    ])
    date_joined = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'club')

class MergeRequest(models.Model):
    club_1 = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="club_a_merge")
    club_2 = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="club_b_merge")

    accepted_1 = models.BooleanField(default=False)
    accepted_2 = models.BooleanField(default=False)

    created = models.BooleanField(default=False)
    merged_club = models.ForeignKey(Club, blank=True, null=True, on_delete=models.CASCADE)

    def get_pos(self, club):
        if self.club_1 == club:
            return 1
        elif self.club_2 == club:
            return 2
        return None
    
    def accept(self, club):
        side = self.get_pos(club)
        if side == 1:
            self.accepted_1 = True
        elif side == 2:
            self.accepted_2 = True
        self.save()
        # True if both clubs accept
        return self.ready()
    
    def ready(self):
        return self.accepted_1 and self.accepted_2
    
    def perform_merge(self):
        if self.created:
            return self.merged_club

        name = f"{self.club_1.name} x {self.club_2.name}"
        desc = f"Partnership of {self.club_1.name} and {self.club_2.name}"
        new_club = Club.objects.create(name=name, description=desc)

        members_1 = Membership.objects.filter(club=self.club_1)
        members_2 = Membership.objects.filter(club=self.club_2)

        for m in list(members_1) + list(members_2):
            Membership.objects.get_or_create(user=m.user, club=new_club, defaults={"role": m.role})

        self.merged_club = new_club
        self.created = True
        self.save()

        return new_club