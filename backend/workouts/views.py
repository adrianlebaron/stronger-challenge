from django.contrib.auth.models import User
from .serializers import *
from .models import *
from django.core.files.base import ContentFile
from django.core import serializers
import random
import string
import base64
import math
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

    def put(self, request, pk):
        workout = None

        try:
            workout = Workout.objects.get(id=pk)
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        img = request.data.get('imgData')
        date = request.data.get('date')
        duration = request.data.get('duration')
        exercise = request.data.get('exercise')
        if not img.startswith('http'):
            upload = self.__uploadImage(img)
            img = upload.file.url

        if img:
            workout.picture = img
        if date:
            workout.date = date
        if duration:
            workout.duration = duration
        if exercise:
            workout.exercise = exercise

        workout.save()
        serializer = WorkoutGetSerializer(workout, context={'request': request})

        return Response({'workout': serializer.data})

    def delete(self, request, pk):
        workout = None

        try:
            workout = Workout.objects.get(id=pk)
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        workout.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

        serializer = WorkoutGetSerializer(
            workouts[start:end], many=True, context={'request': request})

        res = {
            'workouts': serializer.data,
            'total': total,
            'page': page,
            'lastPage': math.ceil(total / per_page)
        }

        return Response(res)

    def getSingleWorkout(self, pk, request):
        workout = None
        pk = h_decode(pk)
        try:
            workout = Workout.objects.get(id=pk)
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WorkoutGetSerializer(workout, context={'request': request})

        return Response(serializer.data)

class WorkoutImage(APIView):
    permission_classes = [AllowAny]

    # Used to get the image for meta tags when sharing a workout
    def get(self, request, pk):
        pictureUrl = None
        pk = h_decode(pk)
        try:
            pictureUrl = Workout.objects.get(id=pk).picture
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return redirect(pictureUrl)

class WorkoutMetaData(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):

        workout = None
        pk = h_decode(pk)
        try:
            workout = Workout.objects.select_related('user').get(id=pk)
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        hours, minutes = workout.duration.strftime("%H:%M").split(':')
        duration = hours + ":" + minutes
        if (hours == "00"):
            duration = minutes + ' mins'
        if (minutes == "00"):
            duration = hours + ' hrs'

        title = workout.exercise.capitalize() + " - " + workout.user.first_name + "'s " + duration + " workout"
        image = workout.picture

        data = {
            'title': title,
            'image': image,
            'description': ""
        }

        return Response(data, status.HTTP_200_OK);

# Workout reactions' views, comments and notifications
class CategoryReaction(APIView):
    def get(self, request, pk, format=None):

        try:
            workout = Workout.objects.get(id=pk)
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        reactions = WorkoutReaction.objects.filter(
            workout=workout).order_by('-created_at')

        # Agrupa las reacciones por emoji y persona que reaccionó
        aggregated_reactions = reactions.values('user__username', 'reaction')

        response_data = []
        for entry in aggregated_reactions:
            user = entry['user__username']
            emoji = entry['reaction']
            response_data.append({'user': user, 'emoji': emoji})

        return Response(response_data)


class CreateWorkoutReaction(APIView):
    def post(self, request, format=None):

        workout_id = request.data.get('workout_id')
        reaction = request.data.get('reaction')
        reaction_added = reaction

        if not workout_id:
            return Response({'error': 'workout_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            workout = Workout.objects.get(pk=workout_id)
        except Workout.DoesNotExist:
            return Response({'error': 'workout not found'}, status=status.HTTP_404_NOT_FOUND)

        status_code = status.HTTP_200_OK;
        workout_reaction = None
        try:
            workout_reaction = WorkoutReaction.objects.get(
                user=request.user, workout=workout)

            if workout_reaction.reaction == reaction:
                workout_reaction.delete()
                reaction_added = None

            else:
                workout_reaction.reaction = reaction
                workout_reaction.save()

        except WorkoutReaction.DoesNotExist:
            workout_reaction = WorkoutReaction.objects.create(
                user=request.user, workout=workout, reaction=reaction)
            status_code = status.HTTP_201_CREATED

        if reaction_added and workout_reaction.user != workout_reaction.workout.user:
            notifyThread = threading.Thread(target=self.notifyUser, args=(workout_reaction,))
            notifyThread.start()

        reactions = WorkoutReaction.objects.filter(workout=workout)
        latest_reactions = group_and_sort_reactions(reactions)
        return Response({'message': 'Reaction updated', 'reaction_added': reaction_added, 'total_reactions': reactions.count(), 'latest_reactions': latest_reactions}, status=status_code)

    def notifyUser(self, reaction):
      fullName = reaction.user.first_name + " " + reaction.user.last_name
      title = fullName + " reacted to your workout";
      pushTokens = PushNotificationToken.objects.filter(user=reaction.workout.user)
      if pushTokens:
        data = {
            "sound": "default",
            "title": title,
            "body": reaction.reaction,
            "data": {"url": reaction.workout.get_share_url()}
        }
        send_push_notification(pushTokens, data)

class Comment(APIView):
    permission_classes = [IsAuthenticated]

    def notifyUser(self, comment):
      fullName = comment.user.first_name + " " + comment.user.last_name
      title = fullName + " commented on your workout";
      pushTokens = PushNotificationToken.objects.filter(user=comment.workout.user)

      if pushTokens:
        data = {
            "sound": "default",
            "title": title,
            "body": comment.body,
            "data": {"url": comment.workout.get_share_url()}
        }
        send_push_notification(pushTokens, data)

    def post(self, request):
        workout_id = request.data.get('workout_id')
        comment = request.data.get('comment')

        if not workout_id or not comment:
            return Response({'error': 'workout_id and comment are required'}, status=status.HTTP_400_BAD_REQUEST)

        workout = None
        try:
            workout = Workout.objects.get(pk=workout_id)
        except Workout.DoesNotExist:
            return Response({'error': 'workout not found'}, status=status.HTTP_404_NOT_FOUND)

        comment = WorkoutComment.objects.create(
            user=request.user, workout=workout, body=comment)

        if comment.workout.user != comment.user:
            notifyThread = threading.Thread(target=self.notifyUser, args=(comment,))
            notifyThread.start()

        return Response(WorkoutCommentSerializer(comment).data)

    def get(self, request):
        workout_id = request.GET.get('workout_id')

        if not workout_id:
            return Response({'error': 'workout_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        #If the int parsing fails it means it's a hash so we need to decode it
        try:
            int(workout_id)
        except ValueError:
            workout_id = h_decode(workout_id)

        workout = None
        try:
            workout = Workout.objects.get(pk=workout_id)
        except Workout.DoesNotExist:
            return Response({'error': 'workout not found'}, status=status.HTTP_404_NOT_FOUND)

        comments = WorkoutComment.objects.order_by(
            '-created_at').filter(workout=workout)

        return Response(WorkoutCommentSerializer(comments, many=True).data)


class PushToken(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        device_id = request.data.get('device_id')
        token = request.data.get('token')
        user = request.user

        if device_id == None or token == None:
          return Response({'error': 'device_id and token are required'}, status=status.HTTP_400_BAD_REQUEST)


        if not PushNotificationToken.objects.filter(user_id=user.id, token=token).exists():
          try:
            tokenObject = PushNotificationToken.objects.get(user=user, device_id=device_id)
            tokenObject.token = token
            tokenObject.save()
          except PushNotificationToken.DoesNotExist:
            tokenObject = PushNotificationToken.objects.create(
              user=user, token=token, device_id=device_id
            )
            token = tokenObject.token


        return Response({'token': token})

    def delete(self, request, token):
        try:
            PushNotificationToken.objects.get(user=request.user, token=token).delete()
        except PushNotificationToken.DoesNotExist:
            return Response({'error': 'token not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
