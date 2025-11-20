from django.urls import path
from . import views

urlpatterns = [
    # Club
    path("create/", views.create_club, name="create-club"),
    path("get/", views.view_clubs, name="get-club"),
    path("update/", views.update_club, name="update-club"),
    path("delete/", views.delete_club, name="delete-club"),

    # Membership
    path("members/add/", views.join_club, name="create-membership"),
    path("members/get/", views.get_club_membership, name="get-membership"),
    path("members/update/", views.update_membership, name="update-membership"),
    path("members/remove/", views.delete_membership, name="delete-membership"),

    # Merge Request
    path("merge/create/", views.create_merge_request, name="create-merge"),
    path("merge/get/", views.view_merge_request, name="get-merge"),
    path("merge/update/", views.update_merge_request, name="update-merge"),
    path("merge/delete/", views.delete_merge_request, name="delete-merge"),
]