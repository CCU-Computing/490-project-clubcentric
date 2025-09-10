from django.urls import path
from .views import calendar_list, create_calendar, merge_clubs

urlpatterns = [
    path('listCalendars/', calendar_list, name='cal_list'),
    path('createCalendar/', create_calendar, name='create_cal'),
    path('merge_clubs/', merge_clubs)
]
