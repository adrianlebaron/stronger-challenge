from django.contrib.auth.models import User
from .serializers import *
from .models import Upload, Workout
from django.core.files.base import ContentFile
from django.core import serializers
import random
import string
import base64
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count
from collections import defaultdict

# WORKOUTS
@api_view(['GET'])
def total_workouts_view(request):
    total_workouts = get_total_workouts(request)
    return Response(total_workouts)

def get_total_workouts(request):
    total_workouts_by_user = defaultdict(int)
    check_ins = Workout.objects.all()
    for check_in in check_ins:
        total_workouts_by_user[check_in.user.username] += 1
    
    # Sort the dictionary by value (total workouts) in descending order
    sorted_total_workouts = dict(sorted(total_workouts_by_user.items(), key=lambda item: item[1], reverse=True))
    return sorted_total_workouts

class WorkoutView(APIView):

    def get(self, request):
        firstDate = request.query_params.get('dateOne')
        secondDate = request.query_params.get('dateTwo')
        try:
            order = request.query_params.get('order')
        except:
            order = None

        workout = Workout.objects.filter(user=request.user)
        totalWorkouts = workout.count()

        workout = workout.filter(date__range=[firstDate, secondDate])
        if order and order == "newest":
            workout = workout.order_by('-id')
        workout = WorkoutSerializer(workout, many=True)
        # It gives the total amount of workouts the current user has, not the total of everyone
        res = {
            'message': 'Here is your workouts total',
            'workout': workout.data,
            "totalCount": totalWorkouts,
        }
        return Response(res)

    def post(self, request):
        img_data = request.data.get('imgData')  # Get imgData field from request
        img_url = None

        if img_data:
            upload = self.__uploadImage(img_data)
            img_url = upload.file.url

        data = {
            "user": request.user.id,
            "date": request.data['date'],
            "duration": request.data['duration'],
            "exercise": request.data['exercise'],
            "picture": img_url
        }

        workout = WorkoutSerializer(data=data)

        if workout.is_valid():
            workout.save()
            res = {
                'messages': 'Workout Successfully Created',
                'workout': workout.data
            }
        else:
            res = {
                'messages': 'Workout Unsuccessful',
                'Errors': workout.errors
            }
        return Response(res)
    
    def __uploadImage(self, image_data):
        letters = string.ascii_lowercase
        image_name = ''.join(random.choice(letters) for i in range(10))

        try:
            format, image_data = image_data.split(';base64,')
        except:
            pass

        picture = ContentFile(base64.b64decode(
            image_data), name=image_name + ".jpeg")

        return Upload.objects.create(
            file=picture
        )


# CHALLENGE
@api_view(['GET'])
def UserChallengeSubmissions(request):

    title_value_list = get_user_challenge_submissions(request.user)

    return Response(title_value_list)

class Challenge(APIView):
    def post(self, request):
        time = request.data['time']
        if request.data['amount'] is not None:
            challengeAttempt = ChallengeSubmission.objects.create(
                user=request.user,
                challenge=Challenge.objects.get(id=request.data['challenge']),
                amount=request.data['amount'],
            )
            res = {
                'Success': True,
                'message': 'Successfully added challenge attempt.'
            }
        elif all(time[v] is None for v in time):
            res = {
                'Success': False,
                'Error': "Incomplete"
            }
        else:
            seconds = 0
            for i in time:
                if time[i] is not None:
                    if i == 'hours':
                        seconds += time[i] * 3600
                    elif i == 'minutes':
                        seconds += time[i] * 60
                    else:
                        seconds += time[i]
            challengeAttempt = ChallengeSubmission.objects.create(
                user=request.user,
                challenge=Challenge.objects.get(id=request.data['challenge']),
                time=str(datetime.timedelta(seconds=seconds)),
            )
            res = {
                'Success': True,
                'message': 'Successfully added challenge attempt.'
            }
        return Response(res)

    def get(self, request):
        challengeSubmissions = ChallengeSubmission.objects.filter(user=request.user)
        excludeId = []
        for sub in challengeSubmissions:
            excludeId.append(sub.challenge.id)
        challenges = Challenge.objects.exclude(id__in=excludeId)

        response = {
            "challenges": ChallengeSerializer(challenges, many=True).data,
            "message": "Hello from dashboard",
        }
        return Response(response)
