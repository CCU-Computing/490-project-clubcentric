from django.db import models
from club.models import Club
class DocumentManager(models.Model):
    name = models.CharField(max_length=50)
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="document_managers")

    def __str__(self):
        return f"{self.name} for {self.club.name}"

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_manager = models.ForeignKey(DocumentManager, on_delete=models.CASCADE, related_name="documents")

    def __str__(self):
        return self.title
