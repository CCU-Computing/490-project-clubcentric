from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=50)
    id = models.IntegerField(primary_key=True)
    def __str__(self):
        return f"Club: {self.name}"
    
    def get_documents(self):
        return self.documents.all()
    
class Document(models.Model):
    title = models.CharField(max_length=200)

    # File itself
    file = models.FileField(upload_to="documents/")

    # Track the file
    uploaded_at = models.DateTimeField(auto_now_add=True)

    club = models.ForeignKey(
        Club,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    def __str__(self):
        return self.title

