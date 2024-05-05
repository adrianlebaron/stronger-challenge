from rest_framework import serializers
from .models import *
from authentication.serializers import UserSerializer

class WorkoutSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Workout
        fields = ('id', 'user', 'date', 'duration', 'exercise', 'picture' )

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