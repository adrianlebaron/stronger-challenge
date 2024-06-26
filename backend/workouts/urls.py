from django.urls import path
from .views import *

urlpatterns = [
    path('workout/', WorkoutView.as_view(), name="WorkoutView"), # GET, POST, PUT workouts
    path('workout/delete/<int:pk>', WorkoutView.as_view(), name="WorkoutView"),
    path('workout/total/', total_workouts_view, name='total_workouts_view'),
    path('workout/<int:pk>', WorkoutView.as_view(), name="WorkoutView"),
    path('workout/details/', WorkoutDetails.as_view(), name="WorkoutDetails"),
    path('workout/details/<pk>', WorkoutDetails.as_view(), name="SingleWorkoutDetails"),
    path('workout/details/<pk>/image/', WorkoutImage.as_view(), name="workoutImage"),
    path('workout/details/<pk>/metadata/', WorkoutMetaData.as_view(), name="WorkoutMetaData"),
    path('workout/reactions/', CreateWorkoutReaction.as_view(), name="CreateWorkoutreaction"),
    path('workout/reactions/<int:pk>/', CategoryReaction.as_view(), name="CategoryReaction"),
    path('comment/', Comment.as_view(), name="createComment"),
    path('comments/', Comment.as_view(), name="getComments"),
    path('get-active-season/', SeasonView.as_view(), name="Season"),
    path('get-scores/', Scores.as_view(), name="Scores"),
]
