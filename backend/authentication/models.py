from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from datetime import timedelta
import django.utils.timezone as timezone
from backend.storage_backends import ImageStorage
import uuid

# Create Token When New User Created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Upload(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(storage=ImageStorage())

# Profile Model That Extends User Model
class Profile(models.Model):
    ROLES = (
        ("ADMIN", "Admin"),
        ("USER", "User"),
    )
    SIZES = (
        ('SMALL', 'Small'),
        ('MEDIUM', 'Medium'),
        ('LARGE', 'Large'),
        ('XL', 'XL'),
        ('2XL', '2XL'),
        ('3XL', '3XL'),
        ('4XL', '4XL'),
    )
    LANGUAGE = (
        ('ENGLISH', 'English'),
        ('SPANISH', 'Spanish')
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.PositiveIntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    roles = models.CharField(max_length=5, choices=ROLES, default="USER")
    shirt_size = models.CharField(max_length=20, choices=SIZES, default="LARGE")
    language = models.CharField(max_length=20, choices=LANGUAGE, default="ENGLISH")
    registration = models.BooleanField(default="False")
    registrationSubmission = models.ManyToManyField(Upload, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

class ForgotPasswordToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    token = models.TextField(unique=True)

    def get_token(self):
        return self.token

    def get_user(self):
        return self.user

    def is_expired(self):

        expiration_limit = timedelta(minutes=30)

        # using timezone.now() because django's auto_now_add uses it
        # time.time() or anything else create a 4 hour time difference
        return ( timezone.now() - self.created > expiration_limit )

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    code = models.CharField(max_length=6, null=True, blank=True)
    verified = models.BooleanField(default=False)
    expiration = models.DateTimeField()

class PushNotificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    device_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class PushNotificationTicket(models.Model):
    ticket_id = models.CharField(max_length=50)
    push_token = models.ForeignKey(PushNotificationToken, on_delete=models.CASCADE)
    body = models.TextField()
    title = models.CharField(max_length=100)

class PushNotificationReceipt(models.Model):
    ticket = models.ForeignKey(PushNotificationTicket, on_delete=models.CASCADE)
    error = models.CharField(max_length=50)

