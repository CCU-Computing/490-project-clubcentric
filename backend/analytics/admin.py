from django.contrib import admin
from .models import Attendance, Engagement


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['meeting', 'user', 'attended', 'created_at']
    list_filter = ['attended', 'created_at']
    search_fields = ['user__username', 'meeting__calendar__club__name']


@admin.register(Engagement)
class EngagementAdmin(admin.ModelAdmin):
    list_display = ['club', 'user', 'engagement_score', 'events_attended', 'events_missed', 'last_active']
    list_filter = ['club', 'created_at']
    search_fields = ['user__username', 'club__name']
    ordering = ['-engagement_score']
