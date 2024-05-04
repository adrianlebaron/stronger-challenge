from django.urls import path
from .views import *
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('user/', UserView.as_view(), name='user'), # GET, PUT & POST
    path('delete-account/', DeleteAccount.as_view(), name='delete_account'),
    path('stripe/', Stripe.as_view(), name='stripe'),
    path('check-username/', CheckUsernameView.as_view(), name="check_user_name"),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('forgot-password/', ForgotPasswordView, name='forgot_password'),
    path('password-reset/', ResetPasswordView, name='password_reset'),
]