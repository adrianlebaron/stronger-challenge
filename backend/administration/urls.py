from django.urls import path
from .views import *

urlpatterns = [
    path('users-admin/', UsersAdmin.as_view(), name='admin'),
    path('workouts-details/', WorkoutDetails.as_view(), name="workout details"),
    path('challenge-submissions/', ChallengeSubmissionsAdmin.as_view(), name="challenge submission admin"),
    path('challenge-admin/', ChallengeAdmin.as_view(), name="challenge admin"),
]
