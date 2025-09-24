from django.urls import path
from . import views
urlpatterns = [
    path("<str:club_id>/meetings/", views.add_meeting, name="add_meeting"),
]