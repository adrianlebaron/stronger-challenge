from django.db import models
from backend.storage_backends import ImageStorage
from django.contrib.auth.models import User
import workouts.utils

class Upload(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(storage=ImageStorage())

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.TimeField()
    exercise = models.CharField(max_length=100)
    picture = models.URLField(blank=True, null=True)

    def get_share_url(self):
        hashedId = workouts.utils.h_encode(self.id)
        return "https://www.kosfitnessclub.com/share/" + hashedId

class WorkoutReaction(models.Model):
    REACTION_CHOICES = (
        ('💪', 'Muscle'),
        ('👍', 'Thumbs Up'),
        ('🏆', 'Trophy'),
        ('😎', 'Sunglasses'),
        ('🥵', 'Face with Heat'),
        ('💯', '100'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=2, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.user.username} reacted to {self.workout} with {self.reaction}"

class WorkoutComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

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

class Season(models.Model):
    active_season = models.BooleanField(default=True)
    season_start = models.DateField()
    season_end = models.DateField()
    season_total_workouts = models.IntegerField()
    month_goal = models.IntegerField()
    week_goal = models.IntegerField()
