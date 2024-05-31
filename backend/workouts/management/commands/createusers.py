from dataclasses import replace
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from workouts.models import Workout
from django.utils.crypto import get_random_string
import datetime
import random

class Command(BaseCommand):
    help = 'Create users for local db'

    def handle(self, *args, **options):

      for i in range(25):
        username = get_random_string(length=10)
        user = User.objects.create_user(username=username, first_name=f'name {i}', last_name='last name', email="", password="123")
        number = random.randrange(51, 100)
        for i in range(number):
          Workout.objects.create(
            user = user,
            date = datetime.date.today(),
            duration = datetime.time(0, 25, 0, 0),
            exercise = "HIIT"
          )
      self.stdout.write(self.style.SUCCESS('Successfully created users and workouts'))
