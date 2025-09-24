from django.db import models

class DocumentManager(models.Model):
    club = models.OneToOneField("club.Club", on_delete=models.CASCADE, related_name="document_manager")

    def __str__(self):
        return f"{self.club.name} documents"



def document_upload_path(instance, filename):
    club_name = instance.document_manager.club.name.replace(" ", "_")
    return f"{club_name}/documents/{filename}"

class Document(models.Model):
    title = models.CharField(max_length=200)
    document_manager = models.ForeignKey("documents.DocumentManager", on_delete=models.CASCADE, related_name="documents")
    # File itself
    file = models.FileField(upload_to=document_upload_path)
    # Track the file
    uploaded_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title
