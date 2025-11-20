from django.contrib import admin
from .models import DocumentManager, Document

admin.site.register(DocumentManager)
admin.site.register(Document)