from django.db.models.signals import post_save
from django.dispatch import receiver
from club.models import Club
from .models import Calendar


@receiver(post_save, sender=Club)
def create_calendar_for_club(sender, instance, created, **kwargs):
    if created:
        Calendar.objects.create(club=instance)