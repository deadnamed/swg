from django.db import models
import hashlib
import random

# Create your models here.
class Account(models.Model):
    name = models.CharField(max_length=200, default="Account", unique=True)
    password = models.CharField(max_length=200, default="Password")
    logged_in = models.BooleanField(default="False")
    auth_token = models.CharField(max_length=200, default="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    def generate_token(self):
        if(not self.logged_in):
            string = bytes(str(random.randint(1, 100000000)), "utf-8")
            self.auth_token = hashlib.sha256(string).hexdigest()
            self.logged_in = True
            self.save()
        
