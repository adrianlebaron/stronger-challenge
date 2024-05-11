from rest_framework.views import APIView
from .serializers import *
from .models import *
from authentication.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import math
from authentication.permissions import IsAdminOrReadOnly
from datetime import datetime

# CHALLENGES for admins
class AdminChallengeView(APIView):
    permission_classes = [IsAdminOrReadOnly]

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


class AdminChallengeSubmissions(APIView):
    def get(self, request):
        challengeSubmissions = ChallengeSubmission.objects.all().order_by('challenge')

        response = {
            "challenges submissions": ChallengeSubmissionSerializer(challengeSubmissions, many=True).data,
        }
        
        return Response(response)

# CHALLENGE for users
@api_view(['GET'])
def UserChallengeSubmissions(request):

    title_value_list = get_user_challenge_submissions(request.user)

    return Response(title_value_list)

def get_user_challenge_submissions(user):
    
    submissions = ChallengeSubmission.objects.filter(user=user).order_by('-id')
    
    title_value_list = []
    
    for submission in submissions:
        submissionObject = {}
        submissionObject['title'] = submission.challenge.title
        submissionObject['id'] = submission.id
        
        if submission.amount is not None:
            # print(challenge.amount)
            submissionObject['value'] = submission.amount
        elif submission.time is not None:
            # print(challenge.time)
            submissionObject['value'] = submission.time
        
        title_value_list.append(submissionObject)

    return title_value_list

class UserChallengeView(APIView):
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
        challengeSubmissions = ChallengeSubmission.objects.filter(
            user=request.user)
        excludeId = []
        for sub in challengeSubmissions:
            excludeId.append(sub.challenge.id)
        challenges = Challenge.objects.exclude(id__in=excludeId)

        response = {
            "challenges": ChallengeSerializer(challenges, many=True).data,
            "message": "Hello from dashboard",
        }
        return Response(response)
