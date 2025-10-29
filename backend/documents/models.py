from django.db import models
from club.models import Club
from django.contrib.auth.models import User

class DocumentManager(models.Model):
    name = models.CharField(max_length=50)
    club = models.ForeignKey(
        Club, 
        null=True,
        blank=True,
        on_delete=models.CASCADE, 
        related_name="document_managers")

    user = models.OneToOneField(
        User, 
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    def __str__(self):
        return f"{self.name} for {self.club.name}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(club__isnull=False, user__isnull=True) |
                    models.Q(club__isnull=True, user__isnull=False)
                ),
                name="documents_owner_exclusive"
            ),
        ]

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_manager = models.ForeignKey(DocumentManager, on_delete=models.CASCADE, related_name="documents")

    def __str__(self):
        return self.title
