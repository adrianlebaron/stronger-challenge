from django.db import models
from django.contrib.auth.models import User

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
    deadline = models.DateField(auto_now=False, auto_now_add=False)

    def __str__(self):
        return self.title

class ChallengeSubmission(models.Model):
    user =  models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, null=True, related_name="challenge")
    time = models.TimeField(blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)