from django.contrib import admin
from .models import UserConnection, NetworkProfile, ClubMembership


@admin.register(UserConnection)
class UserConnectionAdmin(admin.ModelAdmin):
    list_display = ['from_user', 'to_user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['from_user__username', 'to_user__username']


@admin.register(NetworkProfile)
class NetworkProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'bio', 'created_at']
    search_fields = ['user__username', 'bio', 'skills']


@admin.register(ClubMembership)
class ClubMembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'club', 'role', 'joined_at']
    list_filter = ['role', 'joined_at']
    search_fields = ['user__username', 'club__name']
