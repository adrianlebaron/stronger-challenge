from rest_framework import serializers
from .models import *

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ('__all__')

class ProgressImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressImage
        fields = ('__all__')

class WeightProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightProgress
        fields = ('__all__')