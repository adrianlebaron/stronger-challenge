from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from womenKos.storage_backends import ImageStorage

from datetime import timedelta
import django.utils.timezone as timezone
from django.contrib.contenttypes.fields import GenericRelation

class Upload(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(storage=ImageStorage())

# Create Token When New User Created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

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
        ('EXTRA-LARGE', 'Extra-Large'),
        ('2XL', '2XL'),
        ('3XL', '3XL'),
    )
    LANGUAGE = (
        ('ENGLISH', 'English'),
        ('SPANISH', 'Spanish')
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.DateField(blank=True, null=True)
    isJunior = models.BooleanField(default=False)
    height = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    roles = models.CharField(max_length=5, choices=ROLES, default="USER")
    shirt_size = models.CharField(max_length=20, choices=SIZES, default="LARGE")
    language = models.CharField(max_length=20, choices=LANGUAGE, default="ENGLISH")
    registration = models.BooleanField(default="False")
    registrationSubmission = models.ManyToManyField(Upload, blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



class CheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    workoutLength = models.TimeField()
    workoutType = models.CharField(max_length=100)
    picture = models.URLField(blank=True, null=True)

class CheckInReaction(models.Model):
    REACTION_CHOICES = (
        ('💪', 'Muscle'),
        ('👍', 'Thumbs Up'),
        ('🏆', 'Trophy'),
        ('😎', 'Sunglasses'),
        ('🥵', 'Face with Heat'),
        ('💯', '100'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    check_in = models.ForeignKey(CheckIn, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=2, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.user.username} reacted to {self.check_in} with {self.reaction}"

class CheckInComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    check_in = models.ForeignKey(CheckIn, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class Challenge(models.Model):
    REPEAT_OPTIONS = (
        ('Never', 'Never'),
        ('Weekly', 'Weekly'),
        ('Bi-Weekly', 'Bi-Weekly'),
        ('Bi-Monthly', 'Bi-Monthly'),
        ('Monthly', 'Monthly')
    )
    RES_OPTIONS = (
        ("Time", "Time"),
        ("Amount", "Amount")
    )
    title = models.CharField(max_length=100)
    summary = models.TextField()
    repeat = models.CharField(max_length=10, choices=REPEAT_OPTIONS, default="Never")
    response = models.CharField(max_length=10, choices=RES_OPTIONS, default="Amount")
    deadline = models.DateTimeField()

    def __str__(self):
        return self.title


class ChallengeSubmission(models.Model):
    user =  models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, null=True, related_name="challenge")
    time = models.TimeField(blank=True, null=True)
    amount = models.DecimalField(blank=True, null=True, max_digits=20, decimal_places=5)
    details = models.TextField(blank=True, null=True)


class Event(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    challenges = models.ManyToManyField(Challenge)
    summary = models.TextField()
    video = models.URLField(blank=True, null=True)
    images = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
