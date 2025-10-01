from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=300)

    def __str__(self):
        return f"Club: {self.name}"

