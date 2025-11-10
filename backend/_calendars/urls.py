from django.urls import path
from . import views
urlpatterns = [
    path("", views.calendars_list, name="view_calendars"),
    path("new/", views.create_calendar, name="create_calendar"),
    path("meetings/", views.meetings_list, name="list_meets"),
    path("meetings/new/", views.create_meeting, name="create_meeting")
]