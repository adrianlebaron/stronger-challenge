import json
import os
from django.template.loader import render_to_string
import ffmpeg
import time
import requests
import stripe
from rest_framework.authtoken.models import Token
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
from django.contrib.auth.models import User

import challenges.models
import authentication.models
from datetime import timedelta
from timeloop import Timeloop
from .models import *
timeloop = Timeloop()

from django.core.files.base import ContentFile
import random
import string
import base64
from django.utils.crypto import get_random_string
from hashids import Hashids
from collections import Counter

stripe.api_key = 'sk_test_51GrtUoHuoQnP408hRCNMQHsnv6xGhKddTNKoSlpC3apsOarcLs23GnYmrqregvBNVaU7bU1SJuw8BRuFhRuX4f1U001f9qGXda'
# sendgrid_api_key = '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'

hashids = Hashids(min_length=8, alphabet='abcdefghijklmnopqrstuvwxyz')

def create_stripe_payment(amount):
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency='usd',
        metadata={'integration_check': 'accept_a_payment'},
    )
    return intent

# def send_forgot_password_email(email_address, code):
#     sg = SendGridAPIClient(sendgrid_api_key)

#     # find user
#     try:
#         user = User.objects.get( email=email_address )

#     except User.DoesNotExist:
#         return

#     context = {
#         'name': user.first_name,
#         'code': code,
#     }

#     email_html_message = render_to_string('email/user_reset_password.html', context)
#     try:
#         message = Mail(
#                 from_email="support@kosfitnessclub.com",
#                 to_emails=email_address,
#                 subject="Restore your password",
#                 html_content=email_html_message
#             )

#         sg.send(message)
#     except Exception as e:
#         return

# def generate_forgot_password_token(user):

#     token = api.models.ForgotPasswordToken(user=user, token=get_random_string(42, allowed_chars=string.ascii_lowercase + string.digits))

#     token.save()

#     return token.get_token()

# def reset_password(token, password):

#     try:
#         token = api.models.ForgotPasswordToken.objects.get(token=token)

#         if token.is_expired():
#             token.delete()
#             return 'token not found'

#         user = token.get_user()

#         token.delete()

#         user.set_password(password)

#         user.save()

#         return 'success'
#     except api.models.ForgotPasswordToken.DoesNotExist:
#         return 'token not found'

@timeloop.job(interval=timedelta(minutes=60))
def check_for_expired_tokens():
    queryset = authentication.models.ForgotPasswordToken.objects.all()
    for item in queryset:
        if item.is_expired():
            item.delete()


def get_user_challenge_submissions(user):

    submissions = challenges.models.ChallengeSubmission.objects.filter(user=user).order_by('-id')

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

def group_and_sort_reactions(reactions):
    reactions_count = Counter(reaction.reaction for reaction in reactions)
    sorted_reactions = sorted(reactions_count.items(), key=lambda x: x[1], reverse=True)
    return [emoji for emoji, _ in sorted_reactions[:4]]

def ImageUpload(image):
    letters = string.ascii_lowercase
    image_name = ''.join(random.choice(letters) for i in range(10))
    picture = ContentFile(base64.b64decode(image), name=image_name + ".jpeg")
    upload = api.models.Upload.objects.create(
            file = picture
        )
    img = upload

    return img

def h_encode(id):
    return hashids.encode(id)

def h_decode(h):
    z = hashids.decode(h)
    if z:
        return z[0]

def send_push_notification(tokens, notification_data):
    if not tokens:
        return

    url = 'https://exp.host/--/api/v2/push/send'
    notification_data["to"] = list(tokens.values_list('token', flat=True))
    res = requests.post(url, json=notification_data, headers={"Content-Type": "application/json"})
    maxTries = 10
    retryCount = 1
    while (res.status_code == 429 or res.status_code >= 500) and retryCount < maxTries:
        retryCount += 1
        sleep = 5 * (2 ** retryCount)
        time.sleep(sleep)
        res = requests.post(url, json=notification_data, headers={"Content-Type": "application/json"})

    if res.status_code == 429 or res.status_code >= 500:
        print(f'Failed to send push notification, status code {res.status_code} returned from expo message: {res.text}')
        return

    response_data = json.loads(res.text)
    for idx, data in enumerate(response_data['data']):
        if data['status'] == 'error':
            if data['details']['error'] == 'DeviceNotRegistered':
               workouts.models.PushNotificationToken.objects.get(token=tokens[idx].token).delete()
        else:
            workouts.models.PushNotificationTicket.objects.create(push_token=tokens[idx], ticket_id=data['id'], title=notification_data['title'], body=notification_data['body'])

@timeloop.job(interval=timedelta(minutes=15))
def check_push_reciepts():
    url = 'https://exp.host/--/api/v2/push/getReceipts'
    tickets =  workouts.models.PushNotificationTicket.objects
    if tickets.count() == 0:
        return

    tickets_ids = list(tickets.values_list('ticket_id', flat=True))

    res = requests.post(url, json={"ids": tickets_ids}, headers={"Content-Type": "application/json"})

    to_delete = []
    tickets_with_invalid_tokens = []
    if (res.status_code == 200):
        data = json.loads(res.text)
        for ticket_id in data['data']:
            receipt = data['data'][ticket_id]
            if receipt['status'] == 'error':
                print('reciept has error')
                print(receipt)
                if receipt['details']['error'] == 'DeviceNotRegistered':
                    tickets_with_invalid_tokens.append(tickets.get(ticket_id=ticket_id))
                else:
                    workouts.models.PushNotificationReceipt.objects.create(ticket=tickets.get(ticket_id=ticket_id, error=receipt['details']['error']))

            if receipt['status'] == 'ok':
                to_delete.append(ticket_id)

    for ticket in tickets_with_invalid_tokens:
        try:
            ticket.push_token.delete()
            ticket.delete()
        except workouts.models.PushNotificationToken.DoesNotExist:
            pass # deleted by another ticket

    # Delete all processed tickets
    workouts.models.PushNotificationTicket.objects.filter(ticket_id__in=to_delete).delete()

def compress_video(video_full_path, size_upper_bound, two_pass=True, filename_suffix='cps_'):
    """
    Compress video file to max-supported size.
    :param video_full_path: the video you want to compress.
    :param size_upper_bound: Max video size in bytes.
    :param two_pass: Set to True to enable two-pass calculation.
    :param filename_suffix: Add a suffix for new video.
    :return: out_put_name or error
    """
    filename, extension = os.path.splitext(video_full_path)
    extension = '.mp4'
    output_file_name = filename + filename_suffix + extension
    #output_file_name = 'test2filecps_.mp4'

    # Adjust them to meet your minimum requirements (in bps), or maybe this function will refuse your video!
    total_bitrate_lower_bound = 11000
    min_audio_bitrate = 32000
    max_audio_bitrate = 256000
    min_video_bitrate = 100000

    try:
        # Bitrate reference: https://en.wikipedia.org/wiki/Bit_rate#Encoding_bit_rate
        probe = ffmpeg.probe(video_full_path)
        # Video duration, in s.
        duration = float(probe['format']['duration'])
        # Audio bitrate, in bps.
        audio_bitrate = float(next((s for s in probe['streams'] if s['codec_type'] == 'audio'), {'bit_rate': min_audio_bitrate})['bit_rate'])
        # Target total bitrate, in bps.
        target_total_bitrate = (size_upper_bound * 8) / (1.073741824 * duration)
        if target_total_bitrate < total_bitrate_lower_bound:
            print('Bitrate is extremely low! Stop compress!')
            return False

        # Best min size, in kB.
        best_min_size = (min_audio_bitrate + min_video_bitrate) * (1.073741824 * duration) / (8 * 1024)
        if size_upper_bound < best_min_size:
            print('Quality not good! Recommended minimum size:', '{:,}'.format(int(best_min_size)), 'KB.')
            # return False

        # Target audio bitrate, in bps.
        audio_bitrate = audio_bitrate

        # target audio bitrate, in bps
        if 10 * audio_bitrate > target_total_bitrate:
            audio_bitrate = target_total_bitrate / 10
            if audio_bitrate < min_audio_bitrate < target_total_bitrate:
                audio_bitrate = min_audio_bitrate
            elif audio_bitrate > max_audio_bitrate:
                audio_bitrate = max_audio_bitrate

        # Target video bitrate, in bps.
        video_bitrate = target_total_bitrate - audio_bitrate
        if video_bitrate < 1000:
            print('Bitrate {} is extremely low! Stop compress.'.format(video_bitrate))
            return False

        i = ffmpeg.input(video_full_path)
        if two_pass:
            ffmpeg.output(i, os.devnull,
                          **{'c:v': 'libx264', 'b:v': video_bitrate, 'pass': 1, 'f': 'mp4'}
                          ).overwrite_output().run()
            ffmpeg.output(i, output_file_name,
                          **{'c:v': 'libx264', 'b:v': video_bitrate, 'pass': 2, 'c:a': 'aac', 'b:a': audio_bitrate}
                          ).overwrite_output().run()
        else:
            ffmpeg.output(i, output_file_name,
                          **{'c:v': 'libx264', 'b:v': video_bitrate, 'c:a': 'aac', 'b:a': audio_bitrate}
                          ).overwrite_output().run()

        if os.path.getsize(output_file_name) <= size_upper_bound * 1024:
            return output_file_name
        elif os.path.getsize(output_file_name) < os.path.getsize(video_full_path):  # Do it again
            return compress_video(output_file_name, size_upper_bound)
        else:
            return False
    except FileNotFoundError as e:
        print('You do not have ffmpeg installed!', e)
        print('You can install ffmpeg by reading https://github.com/kkroening/ffmpeg-python/issues/251')
        return False

# not really sure where to put this, but this is necessary to start the timeloop
timeloop.start()
# There was some other boiler plate code for killing the process,
# but it kept causing problems.
# This by itself works.
