from django.urls import path
from .views import upload_document

urlpatterns = [
    path('documents/', upload_document, name='cal_list'),
]