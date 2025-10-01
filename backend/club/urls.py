from django.urls import path, include
import calendars.urls as cal
import documents.urls as doc
import club.views as viewsClub
urlpatterns = [
    path("new/", viewsClub.create_club, name="create_club"),
    path("", viewsClub.view_clubs, name="view_clubs"),
    path("calendars/", include(cal)),
    path("managers/", include(doc))
]