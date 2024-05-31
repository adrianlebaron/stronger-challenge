import threading
from django.contrib.auth.models import User
from django.core.files import File
from django.core.files.uploadedfile import UploadedFile
from django.db.models.fields.files import default_storage
from .serializers import *
from .utils import (compress_video)
from .models import *
from django.core.files.base import ContentFile
import random
import string
import base64
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.authtoken.models import Token

class GoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        goals = Goal.objects.filter(user=user).order_by('created_at')
        data = GoalSerializer(goals, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        title = request.data.get('title')
        if not title:
            return Response({'error': 'title is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        goalStatus = request.data.get('status', Goal.DOING_STATUS)
        goal = Goal.objects.create(user=user, title=title, status=goalStatus)

        data = GoalSerializer(goal).data
        return Response(data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        newStatus = request.data.get('status')
        if not newStatus:
            return Response({'error': 'status field is required'}, status=status.HTTP_400_BAD_REQUEST)

        goal = None
        try:
            goal = Goal.objects.get(user=request.user, id=pk)
        except Goal.DoesNotExist:
            return Response({'error': 'goal not found'}, status=status.HTTP_404_NOT_FOUND)

        goal.status = newStatus
        goal.save()
        data = GoalSerializer(goal).data
        return Response(data, status=status.HTTP_200_OK)

class ProgressImageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        before = ProgressImage.objects.filter(user=request.user, type=ProgressImage.BEFORE)
        after = ProgressImage.objects.filter(user=request.user, type=ProgressImage.AFTER)

        beforeData = ProgressImageSerializer(before, many=True).data
        afterData = ProgressImageSerializer(after, many=True).data

        return Response({'before': beforeData, 'after': afterData}, status=status.HTTP_200_OK)

    def post(self, request):
        images = request.data.get('images')
        type = request.data.get('type')

        if not images or not type:
            return Response({'error': 'images and type are required'}, status=status.HTTP_400_BAD_REQUEST)

        progressImages = []
        for image in images:
            letters = string.ascii_lowercase
            image_name = ''.join(random.choice(letters) for i in range(10))
            picture = ContentFile(base64.b64decode(image), name=image_name + ".jpeg")
            progressImages.append(
                ProgressImage(
                user=request.user,
                file=picture,
                type=type
                )
            )

        #This doesn't return the ids in development but should work on production since it's postgress db
        #https://docs.djangoproject.com/en/2.1/ref/models/querysets/#bulk-create
        images = ProgressImage.objects.bulk_create(progressImages)

        data = ProgressImageSerializer(images, many=True).data
        return Response(data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        try:
            ProgressImage.objects.get(id=pk, user=request.user).delete()
        except PushNotificationToken.DoesNotExist:
            return Response({'error': 'token not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)

class WeightEvidence(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}
        try:
            progress = WeightProgress.objects.get(user=request.user)
            data = WeightProgressSerializer(progress).data
        except WeightProgress.DoesNotExist:
            pass

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        #TODO: refactor this function
        video = request.FILES.get('video')
        wp = None

        data = {
            's_weight': request.data.get('starting_weight'),
            'e_weight': request.data.get('ending_weight'),
            'units': request.data.get('units', 'lbs'),
            's_video': None,
            's_video_status': '',
            'e_video': None,
            'e_video_status': '',
        }

        compressVideo = False
        type = ''
        if video:
            letters = string.ascii_lowercase
            videoName = ''.join(random.choice(letters) for _ in range(10))
            video.name = videoName

            maxFileSize = 3 * 1024 * 1024 # 3MB in bytes
            if video.size > maxFileSize:
                compressVideo = True

            type = request.data.get('type')

            if type == 'starting':
                if compressVideo:
                    data['s_video_status'] = 'processing'
                else:
                    data['s_video'] = video
            if type == 'ending':
                if compressVideo:
                    data['e_video_status'] = 'processing'
                else:
                    data['e_video'] = video

        try:
            wp = WeightProgress.objects.get(user=request.user)
            wp.starting_weight = data['s_weight']
            wp.ending_weight = data['e_weight']
            wp.units = data['units']
            wp.starting_video_status = data['s_video_status']
            wp.ending_video_status = data['e_video_status']

            if wp.starting_video and (data['s_video'] or data['s_video_status'] == 'processing'):
                wp.starting_video.delete()
            if data['s_video']:
                wp.starting_video = data['s_video']

            if wp.ending_video and (data['e_video'] or data['e_video_status'] == 'processing'):
                wp.ending_video.delete()
            if data['e_video']:
                wp.ending_video = data['e_video']

            wp.save()
        except WeightProgress.DoesNotExist:
            wp = WeightProgress.objects.create(
                    user=request.user,
                    starting_weight=data['s_weight'],
                    starting_video=data['s_video'],
                    starting_video_status=data['s_video_status'],
                    units=data['units'],
                    ending_weight=data['e_weight'],
                    ending_video=data['e_video'],
                    ending_video_status=data['e_video_status']
                )

        #TODO: do this on another thread and do it after creasting the model to pass the id
        if compressVideo:
            print('starting thread', video)
            compressThread = threading.Thread(target=self.compress_video, args=(video, maxFileSize, videoName, wp, type))
            compressThread.start()

        data = WeightProgressSerializer(wp).data
        return Response(data, status=status.HTTP_200_OK)

    def compress_video(self, video, maxFileSize, videoName, model, type):
        status = 'ready'
        newVideo = None
        try:
            #TODO: check if I can do this another way
            path = default_storage.save("tmp/" + videoName + ".mp4", ContentFile(video.read()))
            newpath = compress_video(path, maxFileSize)
            newVideo = File(open(newpath, 'rb'), name=videoName)
        except Exception as e:
            print(repr(e))
            status = 'failed'

        if type == 'starting':
            model.starting_video = newVideo
            model.starting_video_status = status
        elif type == 'ending':
            model.ending_video = newVideo
            model.ending_video_status = status

        model.save()
