from dataclasses import replace
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from workouts.models import Workout
from django.utils.crypto import get_random_string
import datetime

class Command(BaseCommand):
    help = 'Create users for local db'

    def handle(self, *args, **options):

      for i in range(100):
        username = get_random_string(length=10)
        user = User.objects.create_user(username=username, email="", password="123")
        for i in range(50):
          Workout.objects.create(
            user = user,
            date = datetime.date.today(),
            duration = datetime.time(0, 25, 0, 0),
            exercise = "HIIT"
          )
      self.stdout.write(self.style.SUCCESS('Successfully created users and workouts'))