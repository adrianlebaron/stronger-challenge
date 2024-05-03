import stripe
from rest_framework.authtoken.models import Token
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
from django.contrib.auth.models import User

from .models import ForgotPasswordToken, ChallengeSubmission, Upload

from datetime import timedelta
from timeloop import Timeloop

timeloop = Timeloop()

from django.core.files.base import ContentFile
import random
import string
import base64
from django.utils.crypto import get_random_string

def get_user_challenge_submissions(user):
    
    submissions = ChallengeSubmission.objects.filter(user=user).order_by('-id')
    
    title_value_list = []
    
    for submission in submissions:
        submissionObject = {}
        
        # print('======')
        # print(challenge.challenge.title)
        submissionObject['title'] = submission.challenge.title
        submissionObject['id'] = submission.id
        
        if submission.amount is not None:
            # print(challenge.amount)
            submissionObject['value'] = submission.amount
        elif submission.time is not None:
            # print(challenge.time)
            submissionObject['value'] = submission.time
        
        title_value_list.append(submissionObject)

    # print(title_value_list)

    return title_value_list


# not really sure where to put this, but this is necessary to start the timeloop
timeloop.start()
# There was some other boiler plate code for killing the process,
# but it kept causing problems.
# This by itself works. 

def ImageUpload(image):
    letters = string.ascii_lowercase
    format, image_data = image.split(';base64,')
    image_name = ''.join(random.choice(letters) for i in range(10))
    picture = ContentFile(base64.b64decode(image), name=image_name + ".jpeg")
    upload = Upload.objects.create(
            file = picture
        )
    img = upload

    return img