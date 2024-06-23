from django.template.loader import render_to_string
import stripe
from rest_framework.authtoken.models import Token
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.contrib.auth.models import User

from .models import ForgotPasswordToken

from datetime import timedelta
from timeloop import Timeloop

timeloop = Timeloop()

import string
from django.utils.crypto import get_random_string

stripe.api_key = 'sk_test_51GrtUoHuoQnP408hRCNMQHsnv6xGhKddTNKoSlpC3apsOarcLs23GnYmrqregvBNVaU7bU1SJuw8BRuFhRuX4f1U001f9qGXda'
sendgrid_api_key = ''

def create_stripe_payment(amount):
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='usd',
        metadata={'integration_check': 'accept_a_payment'},
    )
    return intent

def send_forgot_password_email(email_address, code):
    sg = SendGridAPIClient(sendgrid_api_key)

    # find user
    try:
        user = User.objects.get( email=email_address )

    except User.DoesNotExist:
        return

    context = {
        'name': user.first_name,
        'code': code,
    }

    email_html_message = render_to_string('email/user_reset_password.html', context)
    try:
        message = Mail(
                from_email="support@kosfitnessclub.com",
                to_emails=email_address,
                subject="Restore your password",
                html_content=email_html_message
            )

        sg.send(message).status_code
    except Exception as e:
        return

def generate_forgot_password_token(user):

    token = ForgotPasswordToken(user=user, token=get_random_string(42, allowed_chars=string.ascii_lowercase + string.digits))

    token.save()

    return token.get_token()

def reset_password(token, password):

    try:
        token = ForgotPasswordToken.objects.get(token=token)

        if token.is_expired():
            token.delete()
            return 'token not found'

        user = token.get_user()

        token.delete()

        user.set_password(password)

        user.save()

        return 'success'
    except ForgotPasswordToken.DoesNotExist:
        return 'token not found'

@timeloop.job(interval=timedelta(minutes=60))
def check_for_expired_tokens():
    queryset = ForgotPasswordToken.objects.all()
    for item in queryset:
        if item.is_expired():
            item.delete()

timeloop.start()
