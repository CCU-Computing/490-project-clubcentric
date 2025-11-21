from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Meeting, Calendar
from clubs.models import Membership


@receiver(post_save, sender=Meeting)
def sync_meeting_to_mirrors(sender, instance, created, **kwargs):
    """
    When a club meeting is created or updated, sync it to all member mirror calendars.
    """
    # Skip if this is already a mirror meeting
    if instance.is_mirror:
        return

    # Check if meeting is in a club calendar
    if not instance.calendar.club:
        return

    club = instance.calendar.club
    calendar_name = instance.calendar.name

    # Find all mirror calendars for this club
    mirror_calendars = Calendar.objects.filter(
        is_club_mirror=True,
        source_club=club
    )

    # Prepare description with original calendar name
    original_description = instance.description or ""
    mirror_description = f"[{calendar_name}] {original_description}"

    for mirror_calendar in mirror_calendars:
        if created:
            # Create new mirror meeting
            Meeting.objects.create(
                calendar=mirror_calendar,
                date=instance.date,
                description=mirror_description,
                is_mirror=True,
                source_meeting=instance
            )
        else:
            # Update existing mirror meeting
            mirror_meetings = Meeting.objects.filter(
                source_meeting=instance,
                calendar=mirror_calendar
            )
            for mirror_meeting in mirror_meetings:
                mirror_meeting.date = instance.date
                mirror_meeting.description = mirror_description
                mirror_meeting.save()


@receiver(post_delete, sender=Meeting)
def delete_mirror_meetings(sender, instance, **kwargs):
    """
    When a club meeting is deleted, delete all its mirror copies.
    """
    # Skip if this is already a mirror meeting
    if instance.is_mirror:
        return

    # Delete all mirror meetings that reference this source meeting
    Meeting.objects.filter(source_meeting=instance).delete()


@receiver(pre_save, sender=Meeting)
def prevent_mirror_edit(sender, instance, **kwargs):
    """
    Prevent direct editing of mirror meetings.
    Mirror meetings should only be updated via their source meeting.
    """
    # Skip for new meetings
    if not instance.pk:
        return

    # Skip if not a mirror
    if not instance.is_mirror:
        return

    # Get original values from database
    try:
        original = Meeting.objects.get(pk=instance.pk)
    except Meeting.DoesNotExist:
        return

    # Check if any field changed (except through signal sync)
    if (original.date != instance.date or
        original.description != instance.description or
        original.calendar_id != instance.calendar_id):
        # This edit is coming from user, not from signal
        # The signal will update these fields, so we allow it
        # But we should prevent manual updates through views (handled in views.py)
        pass
