from django.contrib import admin
from .models import Document, DocumentManager

admin.site.register(Document)
admin.site.register(DocumentManager)