from django.db.models.signals import post_save
from django.dispatch import receiver
from club.models import Club
from .models import DocumentManager

@receiver(post_save, sender=Club)
def create_docmanager_for_club(sender, instance, created, **kwargs):
    if created:
        DocumentManager.objects.create(club=instance)