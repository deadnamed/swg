from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
    path("login/<str:username>/<str:password>", views.authenticate_user, name="auth"),
    path("user/<str:token>", views.get_username_from_token, name="token_to_user")
]   