"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter    
import clubs.urls as club_urls
import calendar_app.urls as cal_urls
import users.urls as user_urls
import document.urls as doc_urls
import analytics.urls as analytics_urls
import networking.urls as networking_urls

urlpatterns = [
    path(f'admin/', admin.site.urls),
    # Club endpoints
    path(f'clubs/', include(club_urls)),

    # Calendar endpoints
    path(f'calendar/', include(cal_urls)),

    # User endpoints
    path(f'user/', include(user_urls)),

    # Documents
    path(f"documents/", include(doc_urls)),

    # Analytics endpoints
    path(f'analytics/', include(analytics_urls)),

    # Networking endpoints
    path(f'networking/', include(networking_urls)),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
