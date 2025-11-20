from django.contrib import admin
from .models import Club, Membership, MergeRequest

admin.site.register(Club)
admin.site.register(Membership)
admin.site.register(MergeRequest)