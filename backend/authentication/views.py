import random
from rest_framework.response import Response

from authentication.utils import send_forgot_password_email
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, permissions
from django.http import JsonResponse
from .permissions import IsAdminOrReadOnly

class AdminUsersView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        users = User.objects.all().order_by('-profile__registration')
        users = UserSerializer(users, many=True)
        res = {
            'users': users.data,
        }
        return Response(res)

class UserView(APIView):
    def get(self, request):
        user = UserSerializer(request.user)
        data = {
            'message': 'here is the current user',
            'user': user.data
        }
        return Response(data)

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
            if request.data.get('height'):
                user.profile.height = request.data['height']
            if request.data.get('weight'):
                user.profile.weight = request.data['weight']
            if request.data.get('shirt_size'):
                user.profile.shirt_size = request.data['shirt_size']
            if request.data.get('first_name'):
                user.first_name = request.data['first_name']
            if request.data.get('last_name'):
                user.last_name = request.data['last_name']
            if request.data.get('email'):
                user.email = request.data['email']
            if request.data.get('age'):
                user.age = request.data['age']
            if request.data.get('phone_number'):
                user.profile.phone_number = request.data['phone_number']

            user.save()

        userSerializer = UserSerializer(user)
        data = {
            'message': 'User Successfully Updated',
            'user': userSerializer.data
        }

        return Response(data)

    # signup function
    def post(self, request):
        userInfo = request.data
        data = {}
        if User.objects.filter(username=userInfo['username']).exists():
            return JsonResponse({'error': {'code': 'username_exists', 'message': 'cannot create account: username already in use, try a different one'}}, status=409)

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
        user.profile.phone_number = userInfo['phone_number']

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

class DeleteAccount(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user = User.objects.get(id=user.id)
        user.delete()
        return Response({'User deleted successfully'})

class Stripe(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        intent = create_stripe_payment(15000) # The price is still uncertain
        client_secret = intent.client_secret
        return Response(client_secret)

@api_view(["POST",])
@permission_classes([AllowAny])
def ForgotPasswordView(request):

    send_forgot_password_email(request.data['email'])

    return Response()


@permission_classes([AllowAny])
class ResetPasswordView(APIView):
    def post(self, request):
        user = User.objects.filter(email__iexact=request.data.get('email', '')).first()

        if not user:
            return Response({'token': '', 'expiration': ''}, status=status.HTTP_404_NOT_FOUND)

        code = f'{random.randrange(1, 10**6):06}'
        expiration = timezone.now() + timezone.timedelta(minutes=15)
        token = PasswordResetToken.objects.create(user=user, expiration=expiration, code=code)
        token_serializer = PasswordResetTokenSerializer(token)
        send_forgot_password_email(user.email, code)

        return Response(token_serializer.data, status=status.HTTP_200_OK)

@permission_classes([AllowAny])
class VerifyResetPasswordView(APIView):
    def post(self, request):
        code = request.data.get('code')
        token = request.data.get('token')

        if not code or not token:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        reset_token = None
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except:
            return Response({"error": "Invalid code."}, status=status.HTTP_404_NOT_FOUND)

        if code != reset_token.code:
            return Response({"error": "Invalid code."}, status=status.HTTP_404_NOT_FOUND)

        if reset_token.expiration < timezone.now():
            reset_token.delete()
            return Response({"error": "Token expired."}, status=status.HTTP_410_GONE)

        reset_token.verified = True
        reset_token.save()

        return Response({}, status=status.HTTP_200_OK)

@permission_classes([AllowAny])
class UpdatePasswordView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        new_password_confirm = request.data.get('new_password_confirm')

        if not token or not new_password or not new_password_confirm:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != new_password_confirm:
            return Response({"error": "The two password fields don't match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except:
            return Response({"error": "Unverified token."}, status=status.HTTP_400_BAD_REQUEST)

        if not reset_token.verified:
            return Response({'error': 'Unverified token.'}, status=status.HTTP_400_BAD_REQUEST)

        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.delete()

        api_token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': api_token.key}, status=status.HTTP_200_OK)

class CheckUsernameView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):

        user_name = request.query_params.get('user_name')

        if not user_name:
            return JsonResponse({'error': {'code': 'required_username',
                                           'message': 'user name is required'}})

        username_exists = User.objects.filter(username=user_name).exists()

        if username_exists:
            return JsonResponse({'error': {'code': 'username_exists', 'message': 'username already in use'}},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': {'code': 'username_available', 'message': 'Username is available'}},
                        status=status.HTTP_200_OK)

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
