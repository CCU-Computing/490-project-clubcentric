from django.db import models
from clubs.models import Club
from users.models import User
from django.core.exceptions import ValidationError

class DocumentManager(models.Model):
    name = models.CharField(max_length=50)
    club = models.ForeignKey(
        Club,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="document_managers")

    user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="document_managers"
    )

    def clean(self):
        if not (self.user or self.club):
            raise ValidationError("Document manager must belong to a user or a club")
        if self.user and self.club:
            raise ValidationError("Document manager cannot belong to both a user and a club")
    

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_manager = models.ForeignKey(DocumentManager, on_delete=models.CASCADE, related_name="documents")