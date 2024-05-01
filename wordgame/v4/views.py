from django.shortcuts import render
from django.http import HttpResponse
from .models import Account, Room

# Create your views here.
def index(request):
    return render(request, "v4/index.html")

def room(request, room_name):
    return render(request, "v4/room.html", {"room_name": room_name})

#Takes in the username and password from a request made by frontend.
#Creates a token for that user. Returns that token. 
#Deletes the token upon the user logging out. 
def authenticate_user(request, username, password):
    user = Account.objects.filter(name=username)
    if len(user) == 0:
        return HttpResponse("no user")
    elif user[0].password != password:
        return HttpResponse("wrong password")
    else:
        currentUser = user[0]
        currentUser.generate_token()
        return HttpResponse(currentUser.auth_token)

def get_user_from_token(token):
    user = Account.objects.filter(auth_token = token)
    if len(user) == 0:
        return "no user"
    else:
        currentUser = user[0]
        return currentUser

def get_username_from_token(request, token):
    if(get_user_from_token(token)=="no user"):
        return HttpResponse("no user")
    return HttpResponse(get_user_from_token(token).name)

def view_room_info_HTTP(request, room_name):
    room = Room.objects.filter(name = room_name)
    if(len(room) == 0):
        return HttpResponse("invalid room name")
    return HttpResponse(json.dumps({
        "name": room[0].name,
        "word": room[0].word,
        "players": room[0].account_set
    }))

def get_room(request, room_name):
    room = Room.objects.filter(name = room_name)
    if(len(room) == 0):
        return "no room with specified name"
    return room[0]