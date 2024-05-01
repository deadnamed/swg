from django.urls import re_path, path

from . import consumers, views
from .views import authenticate_user

websocket_urlpatterns = [
    re_path(r"ws/wordgame_v4/(?P<room_name>\w+)/(?P<auth_token>\w+)$", consumers.ChatConsumer.as_asgi()),
]