from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from authentication.serializers import UserSerializer
from .models import *
from workouts.models import Workout, ChallengeSubmission, Challenge
from workouts.serializers import WorkoutSerializer, ChallengeSubmissionSerializer, ChallengeSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import math

class UsersAdmin(APIView):

    def get(self, request):
        users = User.objects.all().order_by('-profile__registration')
        users = UserSerializer(users, many=True)
        res = {
            'users': users.data,
        }
        return Response(res)

class WorkoutDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = int(request.GET.get('page', 1))
        per_page = 10

        workouts = Workout.objects.order_by('-date', '-id')

        total = workouts.count()

        if not request.GET.get('page'):
            per_page = total

        start = (page - 1) * per_page
        end = page * per_page

        serializer = WorkoutSerializer(
            workouts[start:end], many=True, context={'request': request})

        res = {
            'workouts': serializer.data,
            'total': total,
            'page': page,
            'lastPage': math.ceil(total / per_page)
        }

        return Response(res)

# CHALLENGES
class ChallengeAdmin(APIView):
    def post(self, request):
        if request.data['type'] == "Edit":
            challengeData = request.data['challenge']
            challenge = Challenge.objects.get(id=challengeData['id'])
            challenge.title = challengeData['title']
            challenge.summary = challengeData['summary']
            challenge.response = challengeData['response']
            challenge.deadline = request.data['deadline']
            challenge.save()
            res = {
                'Success': "Challenge Successfully Updated"
            }
        if request.data['type'] == "Delete":
            challengeData = request.data['challenge']
            challenge = Challenge.objects.filter(id=challengeData['id'])
            challenge.delete()
            res = {
                'Success': "Challenge Successfully Deleted"
            }
        if request.data['type'] == 'Create':
            challengeData = request.data['challenge']
            try:
                repeat = challengeData['repeat']
            except:
                repeat = "Never"

            try:
                response = challengeData['response']
            except:
                response = "Amount"
            try:
                deadline = challengeData['deadline']
            except KeyError:
                deadline = datetime.now()

            Challenge.objects.create(
                title=challengeData['title'],
                summary=challengeData['summary'],
                repeat=repeat,
                response=response,
                deadline=deadline
            )
            res = {
                "Success": "Challenge Created"
            }
        return Response(res)

    def get(self, request):
        challenges = Challenge.objects.all()
        response = {
            "challenges": ChallengeSerializer(challenges, many=True).data,
        }
        return Response(response)


class ChallengeSubmissionsAdmin(APIView):
    def get(self, request):
        challengeSubmissions = ChallengeSubmission.objects.all().order_by('challenge')

        response = {
            "challenges submissions": ChallengeSubmissionSerializer(challengeSubmissions, many=True).data,
        }
        
        return Response(response)