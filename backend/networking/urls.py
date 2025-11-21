from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.network_users_list, name='network_users_list'),
    path('connections/', views.network_connections, name='network_connections'),
    path('connect/', views.network_connect, name='network_connect'),
    path('accept/', views.network_accept, name='network_accept'),
    path('suggestions/', views.network_suggestions, name='network_suggestions'),
    path('stats/', views.network_stats, name='network_stats'),
]
