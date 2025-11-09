from django.urls import path
from . import views 

urlpatterns = [
    # Calendar
    
    # GET
    path('get/', views.calendars_list, name='calendar-get'),
    
    # POST
    path('create/', views.create_calendar, name='calendar-create'),
    path('update/', views.update_calendar, name='calendar-update'),
    path('delete/', views.delete_calendar, name='calendar-delete'),

    # Meeting

    # GET
    path('meetings/list/', views.meetings_list, name='meeting-list'),
    
    # POST
    path('meetings/create/', views.create_meeting, name='meeting-create'),
    path('meetings/update/', views.update_meeting, name='meeting-update'),
    path('meetings/delete/', views.delete_meeting, name='meeting-delete'),
]
