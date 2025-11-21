from django.db import models
from clubs.models import Club
from users.models import User
from django.core.exceptions import ValidationError

class Calendar(models.Model):
    name = models.CharField(max_length=50)

    club = models.ForeignKey(
        Club,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="calendars")

    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="calendars")

    # Mirror calendar fields
    is_club_mirror = models.BooleanField(default=False)
    source_club = models.ForeignKey(
        Club,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="mirror_calendars"
    )

    def clean(self):
        if not (self.user or self.club):
            raise ValidationError("Calendar must belong to a user or a club")
        # Allow user + source_club for mirror calendars
        if self.user and self.club and not self.is_club_mirror:
            raise ValidationError("Calendar cannot belong to both a user and a club")
        # Mirror calendars must have user and source_club
        if self.is_club_mirror and not (self.user and self.source_club):
            raise ValidationError("Mirror calendar must have both user and source_club")
    
class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name="meetings")
    date = models.DateTimeField()
    description = models.TextField(null=True)

    # Mirror meeting fields
    is_mirror = models.BooleanField(default=False)
    source_meeting = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="mirror_meetings"
    )
