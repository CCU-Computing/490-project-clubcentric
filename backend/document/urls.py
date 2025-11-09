from django.urls import path
from . import views
from rest_framework import routers
from .views import DocumentViewSet

router = routers.DefaultRouter()
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    # Manager CRUD
    path("managers/create/", views.create_manager, name="create-manager"),
    path("managers/get/", views.get_managers, name="get-managers"),
    path("managers/update/", views.update_manager, name="update-manager"),
    path("managers/delete/", views.delete_manager, name="delete-manager"),

    # Document CRUD
    path("upload/", views.upload_document, name="upload-document"),
    path("get/", views.get_documents, name="get-documents"),
    path("delete/", views.delete_document, name="delete-document"),
]


urlpatterns += router.urls