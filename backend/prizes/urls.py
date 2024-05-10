from django.urls import path
from .views import *

urlpatterns = [
    path('goals/', GoalsView.as_view(), name="goals"),
    path('goals/<int:pk>/', GoalsView.as_view(), name="singleGoal"),
    path('progress-images/', ProgressImageView.as_view(), name="progressImages"),
    path('progress-images/<pk>/', ProgressImageView.as_view(), name="progressImage"),
    path('weight-progress/', WeightEvidence.as_view(), name="WeightEvidence"),
]