from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import *
from collections import Counter

class SignUpSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only':True},
            'password2': {'writw_only':True},
        }

    def validate(self, data):
        if data['email'] == '':
            raise serializers.ValidationError({"error":"This field may not be blank"})
        elif data['password'] != data['password2']:
            raise serializers.ValidationError({'error': "Passwords must match."})
        else:
            return data

    def save(self):
        print(self.validated_data)
        user = User(
            email = self.validated_data['email'],
            username=self.validated_data['username'],
        )
        user.set_password(self.validated_data['password'])
        user.save()
        return user



class ProfileSerializer(serializers.ModelSerializer):
    formatted_height = serializers.SerializerMethodField()

    def get_formatted_height(self, obj):
        if not isinstance(obj.height, int):
            return "0'0"

        feet = obj.height // 12
        inches = obj.height % 12

        return str(feet) + "'" + str(inches)

    class Meta:
        model = Profile
        fields = ('age', 'height', 'formatted_height', 'weight', 'roles', 'shirt_size', 'language', 'registration', 'isJunior', 'phone_number')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'email', 'profile', 'date_joined')

class CheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckIn
        fields = ('__all__')

class CheckInReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInReaction
        fields = '__all__'

class CheckInCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = CheckInComment
        fields = ('__all__')

class CheckInGetSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    user_reaction = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    total_reactions = serializers.SerializerMethodField()
    latest_reactions = serializers.SerializerMethodField()

    def get_total_reactions(self, obj):
        return CheckInReaction.objects.filter(check_in=obj).count()

    def get_latest_reactions(self, obj):
        latest_reactions = CheckInReaction.objects.filter(check_in=obj)
        reactions_count = Counter(reaction.reaction for reaction in latest_reactions)
        sorted_reactions = sorted(reactions_count.items(), key=lambda x: x[1], reverse=True)
        return [emoji for emoji, _ in sorted_reactions[:3]]

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if user:
            try:
                user_reaction = CheckInReaction.objects.get(check_in=obj, user=user)
                return user_reaction.reaction
            except CheckInReaction.DoesNotExist:
                pass
        return None

    def get_comment_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = CheckIn
        fields = ['id','user_reaction' ,'total_reactions','latest_reactions', 'user', 'date', 'workoutLength', 'workoutType', 'picture', 'comment_count']

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
