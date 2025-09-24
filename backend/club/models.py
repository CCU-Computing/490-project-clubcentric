from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=50)
    slug_id = models.CharField(max_length=20, primary_key=True)
    description = models.CharField(max_length=300)

    def __str__(self):
        return f"Club: {self.name}"

