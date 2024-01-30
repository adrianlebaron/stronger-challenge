from django.contrib.auth.models import User

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from django.http import JsonResponse


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
