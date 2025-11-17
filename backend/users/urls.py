from django.urls import path
from . import views


urlpatterns = [
    # User CRUD
    path("create/", views.create_user, name="create-user"),
    path("get/", views.get_user_data, name="get-user"),
    path("update/", views.update_user, name="update-user"),
    path("delete/", views.delete_user, name="delete-user"),

    # Other
    path("login/", views.login_user, name="login-user"),
    path("logout/", views.logout_user, name="logout-user"),
    path("password/", views.update_password, name="password-user")
]