from django.shortcuts import render
from rest_framework.response import Response
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, permissions

# Create your views here.
class UserView(APIView):
    def get(self, request):
        user = UserSerializer(request.user)
        data = {
            'message': 'get request recieved from getuserview',
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
        data = {
            'message': 'User Successfully Updated'
        }
        return Response(data)
    
    def post(self, request):
        print("Sign up view hit", request.data)
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