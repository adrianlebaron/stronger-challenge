from django.db import models
from backend.storage_backends import ImageStorage
from django.contrib.auth.models import User

# WORKOUT
class Upload(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(storage=ImageStorage())

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.TimeField()
    exercise = models.CharField(max_length=100)
    picture = models.URLField(blank=True, null=True)

# CHALLENGE
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