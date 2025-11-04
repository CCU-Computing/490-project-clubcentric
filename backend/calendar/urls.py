from django.urls import path
from backend.calendar import views 

# Define app_name for namespace isolation (good practice)
app_name = 'calendar_app'

urlpatterns = [
    # --- Calendar Endpoints ---
    # Final URL: /api/calendar/list/
    path('list/', views.calendars_list, name='calendar-list'),
    
    # Final URL: /api/calendar/create/
    path('create/', views.create_calendar, name='calendar-create'),
    
    # Final URL: /api/calendar/1/delete/
    path('<int:calendar_id>/delete/', views.delete_calendar, name='calendar-delete'),



    # --- Meeting Endpoints ---
    # Final URL: /api/calendar/meetings/list/
    path('meetings/list/', views.meetings_list, name='meeting-list'),
    
    # Final URL: /api/calendar/meetings/create/
    path('meetings/create/', views.create_meeting, name='meeting-create'),
    
    # Final URL: /api/calendar/meetings/1/update/
    path('meetings/<int:meeting_id>/update/', views.update_meeting, name='meeting-update'),
    
    # Final URL: /api/calendar/meetings/1/delete/
    path('meetings/<int:meeting_id>/delete/', views.delete_meeting, name='meeting-delete'),
]
