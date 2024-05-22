from django.urls import path
from .views import *

urlpatterns = [
    path('challenge/user/', UserChallengeView.as_view(), name="UserChallengeView"), # User post and get challenges
    path('challenge/user/submissions/', UserChallengeSubmissions, name="userChallengeSubmissions"),
    path('challenge/admin/', AdminChallengeView.as_view(), name="AdminChallengeView"), # Admin Post and Get challenges
    path('challenge/admin/submissions/', AdminChallengeSubmissions.as_view(), name="AdminChallengeSubmissions"),
]
