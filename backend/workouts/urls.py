from django.urls import path
from .views import *

urlpatterns = [
    path('workout/', WorkoutView.as_view(), name="workout"),
    path('total-workouts/', total_workouts_view, name='total-workouts'),
    path('challenge', Challenge.as_view(), name="dashboard"),
]
