from django.contrib.auth.models import User
from .serializers import *
from .utils import (create_stripe_payment, send_forgot_password_email,
                    reset_password, get_user_challenge_submissions, ImageUpload)
from .models import Upload, CheckIn, CheckInReaction, Challenge, ChallengeSubmission, CheckInComment
from django.core.files.base import ContentFile
from django.core import serializers
import random
import string
import base64
import datetime
import math
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from rest_framework import generics
from django.db.models import Count


class DashboardView(APIView):
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


class GetUserView(APIView):
    def get(self, request):
        user = UserSerializer(request.user)
        data = {
            'message': 'get request recieved from getuserview',
            'user': user.data
        }
        return Response(data)


class UpdateUserView(APIView):
    def put(self, request):
        user = request.user
        if request.data['PUT_TYPE'] == 'Payment':
            if request.data['PAYMENT_TYPE'] == 'Card':
                user.profile.registration = request.data['registration']
                user.save()
            elif request.data['PAYMENT_TYPE'] == 'Other':
                image_data = request.data['imgData']
                img = ImageUpload(image_data)
                user.profile.registration = request.data['registration']
                user.profile.registrationSubmission.add(img)
                user.save()
            else:
                pass
        else:
            if user.profile.height != request.data['height']:
                user.profile.height = request.data['height']
            if user.profile.weight != request.data['weight']:
                user.profile.weight = request.data['weight']
            if user.profile.shirt_size != request.data['shirt_size']:
                user.profile.shirt_size = request.data['shirt_size']

            user.save()
        data = {
            'message': 'User Successfully Updated'
        }
        return Response(data)


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def SignUpView(request):
    if request.method == "POST":
        print("Sign up view HIT", request.data)
        userInfo = request.data
        data = {}
        if User.objects.filter(username=userInfo['username']).exists():
            return JsonResponse({'error': {'code': 'username_exists', 'message': 'username already in use'}}, status=409)

        user = User.objects.create_user(
            username=userInfo['username'],
            email=userInfo['email'],
            password=userInfo['password'],
        )
        user.save()

        user.first_name = userInfo['first_name']
        user.last_name = userInfo['last_name']
        height = (int(userInfo['height_ft']) * 12) + int(userInfo['height_in'])
        user.profile.age = userInfo['age']
        user.profile.height = height
        user.profile.weight = userInfo['weight']
        user.profile.shirt_size = userInfo['shirt_size']

        if (userInfo.get('isJunior') == "1"):
            user.profile.isJunior = True
        else:
            user.profile.isJunior = False

        try:
            device = userInfo['device']
        except:
            device = None

        if device and device == "mobile":
            user.profile.registration = False
        else:
            user.profile.registration = True

        user.save()
        token = Token.objects.get(user=user)

        user = User.objects.get(id=user.id)
        user = UserSerializer(user)

        data['response'] = "successfully registered a new user."
        data['signedIn'] = True
        data['token'] = token.key
        data['user'] = user.data

        return Response(data)
    else:
        res = {
            "message": "GET isn't allowed"
        }

        return Response(res)


@api_view(["POST",])
@permission_classes([AllowAny])
def ForgotPasswordView(request):

    send_forgot_password_email(request.data['email'])

    return Response()


@api_view(["POST",])
@permission_classes([AllowAny])
def ResetPasswordView(request):
    status = reset_password(
        token=request.data['token'], password=request.data['password'])
    return Response(status)


class DeleteAccount(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user = User.objects.get(id=user.id)
        user.delete()
        return Response({})


class Stripe(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        isJunior = request.query_params.get('isJunior')
        print('ISJUNIOR', isJunior)
        if isJunior == '1':
            intent = create_stripe_payment(12000)
        else:
            intent = create_stripe_payment(21000)
        client_secret = intent.client_secret
        return Response(client_secret)


class Admin(APIView):

    def get(self, request):
        users = User.objects.all().order_by('-profile__registration')
        users = UserSerializer(users, many=True)
        res = {
            'users': users.data,
        }
        return Response(res)


class CheckInDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = int(request.GET.get('page', 1))
        per_page = 10

        checkIns = CheckIn.objects.order_by('-date', '-id')

        total = checkIns.count()

        if not request.GET.get('page'):
            per_page = total

        start = (page - 1) * per_page
        end = page * per_page

        serializer = CheckInGetSerializer(
            checkIns[start:end], many=True, context={'request': request})

        res = {
            'checkIns': serializer.data,
            'total': total,
            'page': page,
            'lastPage': math.ceil(total / per_page)
        }

        return Response(res)


class CheckInView(APIView):

    def get(self, request):
        firstDate = request.query_params.get('dateOne')
        secondDate = request.query_params.get('dateTwo')
        try:
            order = request.query_params.get('order')
        except:
            order = None

        checkIn = CheckIn.objects.filter(user=request.user)
        totalCheckIns = checkIn.count()

        checkIn = checkIn.filter(date__range=[firstDate, secondDate])
        if order and order == "newest":
            checkIn = checkIn.order_by('-id')
        checkIn = CheckInSerializer(checkIn, many=True)
        res = {
            'message': 'GET request hit',
            'checkIn': checkIn.data,
            "totalCount": totalCheckIns,
        }
        return Response(res)

    def post(self, request):
        letters = string.ascii_lowercase
        image_data = request.data['imgData']
        letters = string.ascii_lowercase
        image_name = ''.join(random.choice(letters) for i in range(10))

        try:
            format, image_data = image_data.split(';base64,')
        except:
            pass

        picture = ContentFile(base64.b64decode(
            image_data), name=image_name + ".jpeg")

        upload = Upload.objects.create(
            file=picture
        )

        img_url = upload.file.url

        data = {
            "user": request.user.id,
            "date": request.data['date'],
            "workoutLength": request.data['workoutDuration'],
            "workoutType": request.data['workoutType'],
            "picture": img_url
        }

        checkIn = CheckInSerializer(data=data)

        if checkIn.is_valid():
            checkIn.save()
            res = {
                'messages': 'CheckIn Successfully Created',
                'checkIn': checkIn.data
            }
        else:
            res = {
                'messages': 'CheckIn Unsuccessful',
                'Errors': checkIn.errors
            }
        return Response(res)


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

            Challenge.objects.create(
                title=challengeData['title'],
                summary=challengeData['summary'],
                repeat=repeat,
                response=response,
                deadline=request.data['deadline']
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


class ChallengeSubmissionAdmin(APIView):
    def get(self, request):
        challengeSubmissions = ChallengeSubmission.objects.all().order_by('challenge')

        response = {
            "challenges": ChallengeSubmissionSerializer(challengeSubmissions, many=True).data,
        }
        return Response(response)


@api_view(['GET'])
def UserChallengeSubmissions(request):

    title_value_list = get_user_challenge_submissions(request.user)

    return Response(title_value_list)


###### ReactionsViews#############################################################################################

class CategoryReaction(APIView):
    def get(self, request, pk, format=None):

        try:
            checkin = CheckIn.objects.get(id=pk)
        except CheckIn.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        reactions = CheckInReaction.objects.filter(
            check_in=checkin).order_by('-created_at')

        # Agrupa las reacciones por emoji y persona que reaccionó
        aggregated_reactions = reactions.values('user__username', 'reaction')

        response_data = []
        for entry in aggregated_reactions:
            user = entry['user__username']
            emoji = entry['reaction']
            response_data.append({'user': user, 'emoji': emoji})

        return Response(response_data)


class CreateCheckInreaction(APIView):
    def post(self, request, format=None):

        checkin_id = request.data.get('checkin_id')
        reaction = request.data.get('reaction')

        if not checkin_id:
            return Response({'error': 'checkin_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            checkin = CheckIn.objects.get(pk=checkin_id)
        except CheckIn.DoesNotExist:
            return Response({'error': 'checkin not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            checkin_reaction = CheckInReaction.objects.get(
                user=request.user, check_in=checkin)

            if checkin_reaction.reaction == reaction:
                checkin_reaction.delete()
                return Response({'error': 'Reaction remove'}, status=status.HTTP_200_OK)

            else:
                checkin_reaction.reaction = reaction
                checkin_reaction.save()
                return Response({'message': 'Reaction updated'}, status=status.HTTP_200_OK)
        except CheckInReaction.DoesNotExist:
            CheckInReaction.objects.create(
                user=request.user, check_in=checkin, reaction=reaction)
            return Response({'message': 'Reaction added'}, status=status.HTTP_201_CREATED)


class Comment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        check_in_id = request.data.get('check_in_id')
        comment = request.data.get('comment')

        if not check_in_id or not comment:
            return Response({'error': 'check_in_id and comment are required'}, status=status.HTTP_400_BAD_REQUEST)

        check_in = None
        try:
            check_in = CheckIn.objects.get(pk=check_in_id)
        except CheckIn.DoesNotExist:
            return Response({'error': 'checkin not found'}, status=status.HTTP_404_NOT_FOUND)

        comment = CheckInComment.objects.create(
            user=request.user, check_in=check_in, body=comment)

        return Response(CheckInCommentSerializer(comment).data)

    def get(self, request):
        check_in_id = request.GET.get('check_in_id')

        if not check_in_id:
            return Response({'error': 'check_in_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        check_in = None
        try:
            check_in = CheckIn.objects.get(pk=check_in_id)
        except CheckIn.DoesNotExist:
            return Response({'error': 'checkin not found'}, status=status.HTTP_404_NOT_FOUND)

        comments = CheckInComment.objects.order_by(
            '-created_at').filter(check_in=check_in)

        return Response(CheckInCommentSerializer(comments, many=True).data)

# class ActivityView(APIView):
#     def get(self, request):
#         firstDate = request.query_params.get('dateOne')
#         secondDate = request.query_params.get('dateTwo')

#         checkIn = CheckIn.objects.filter(user=request.user, date__range=[firstDate, secondDate])
#         checkIn = CheckInSerializer(checkIn, many=True)
#         res = {
#             'message': 'GET request hit',
#             'checkIn': checkIn.data,
#         }
#         return Response(res)
