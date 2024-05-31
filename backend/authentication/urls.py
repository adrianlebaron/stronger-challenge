from django.urls import path
from .views import *
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/get-users/', AdminUsersView.as_view(), name="AdminUsersView"),
    path('user/', UserView.as_view(), name='UserView'), # GET, PUT & POST
    path('user/delete-account/', DeleteAccount.as_view(), name="DeleteAccount"),
    path('stripe/', Stripe.as_view(), name='stripe'),
    path('check-username/', CheckUsernameView.as_view(), name="CheckUsernameView"),
    path('user/login/', obtain_auth_token, name="obtain_auth_token"),
    path('user/password-reset/', ResetPasswordView.as_view(), name="password_reset"),
    path('user/verify-reset-token/', VerifyResetPasswordView.as_view(), name='verify-reset-token'),
    path('user/update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('user/push-token/', PushToken.as_view(), name="updatePushToken"),
    path('user/push-token/<token>/', PushToken.as_view(), name="deletePushToken"),
]
