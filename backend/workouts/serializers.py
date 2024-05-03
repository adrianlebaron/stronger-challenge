from rest_framework import serializers
from .models import *
from authentication.serializers import UserSerializer

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ('__all__')

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ('id', 'title', 'summary', 'repeat', 'response', 'deadline')

class ChallengeSubmissionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    challenge = ChallengeSerializer()
    class Meta:
        model = ChallengeSubmission
        fields = ('__all__')