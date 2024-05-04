from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from .models import *

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
        fields = ('age', 'height', 'formatted_height', 'weight', 'roles', 'shirt_size', 'language', 'registration', 'phone_number')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'email', 'profile', 'date_joined')
