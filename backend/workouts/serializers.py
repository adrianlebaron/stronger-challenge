from rest_framework import serializers
from .models import *
from authentication.serializers import UserSerializer
from .utils import h_encode, group_and_sort_reactions

class WorkoutSerializer(serializers.ModelSerializer):
    share_url = serializers.SerializerMethodField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['workoutType'] = data['workoutType'].capitalize()
        return data

    def get_share_url(self, obj):
        return obj.get_share_url()

    class Meta:
        model = Workout
        fields = ('__all__')

class WorkoutGetSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    user_reaction = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    total_reactions = serializers.SerializerMethodField()
    latest_reactions = serializers.SerializerMethodField()
    share_url = serializers.SerializerMethodField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['exercise'] = data['exercise'].capitalize()
        return data

    def get_total_reactions(self, obj):
        return WorkoutReaction.objects.filter(workout=obj).count()

    def get_latest_reactions(self, obj):
        reactions = WorkoutReaction.objects.filter(workout=obj)
        return group_and_sort_reactions(reactions)

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if user:
            try:
                user_reaction = WorkoutReaction.objects.get(workout=obj, user=user)
                return user_reaction.reaction
            except WorkoutReaction.DoesNotExist:
                pass
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_share_url(self, obj):
        return obj.get_share_url()

    class Meta:
        model = Workout
        fields = ['id','user_reaction' ,'total_reactions','latest_reactions', 'user', 'date', 'duration', 'exercise', 'picture', 'comment_count', 'share_url']


class WorkoutCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = WorkoutComment
        fields = ('__all__')

class WorkoutReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutReaction
        fields = '__all__'

class WorkoutCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = WorkoutComment
        fields = ('__all__')