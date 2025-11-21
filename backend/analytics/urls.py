from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.analytics_overview, name='analytics_overview'),
    path('club/', views.analytics_club_detail, name='analytics_club_detail'),
]
