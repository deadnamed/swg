import json

from .views import get_user_from_token, get_username_from_token, view_room_info

from asgiref.sync import sync_to_async, async_to_sync

from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        self.player = get_user_from_token(self.scope["url_route"]["kwargs"]["auth_token"])
        self.my_turn = True
        self.word = ""
        self.room_group_name.a = "abcd"
        print(self.room_group_name.a)
        print(self.player.name, "connected!")
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        print(self.player.name, "disconnected!")
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        print("receive called")
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(text_data_json)
        message_type = text_data_json["type"]
        if message_type=="data_request":
            print("It's a request.")
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "joining_info_request", "requested_by_auth": text_data_json["sent_by"]}
            )
        elif message_type=="opponent_move" and self.my_turn: #You can only make a move if it's your turn.
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "move_made", "message": message, "cutoff": text_data_json["cutoff"]}
            )
    
    def joining_info_request(self, event):
        print("Request sent by", get_user_from_token(event["requested_by_auth"]).name, "seen by", self.player.name)
        requested_by = event["requested_by_auth"]
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "info_response", "message": self.player, "my_turn": self.my_turn, "requested_by_auth": requested_by}
        )
        self.send(text_data=json.dumps({"type": "opponent_joined", "message": get_user_from_token(event["requested_by_auth"]).name, "sent_by": requested_by}))
    
    def info_response(self, event):
        print("Response sent by", self.player.name, "seen by", self.player.name)
        requested_by = event["requested_by_auth"]
        if self.player.auth_token == requested_by and event["message"] != self.player:
            self.send(text_data=json.dumps({"type": "info_response", "message": event["message"].name, "my_turn": not event["my_turn"], "word": self.word, "sent_by": event["message"].auth_token}))
            self.my_turn = not event["my_turn"]

    # Receive message from room group
    def move_made(self, event):
        message = event["message"]
        self.word += message
        self.word = self.word[event["cutoff"]:]
        print("move made: event received by", self.player.name)
        # Send message to WebSocket
        self.send(text_data=json.dumps({"type": "opponent_move", "message": message, "sent_by": self.player.auth_token}))
        print("sent")

    
