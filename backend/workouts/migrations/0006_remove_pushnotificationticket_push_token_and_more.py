# Generated by Django 5.0.3 on 2024-05-31 14:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0005_season'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pushnotificationticket',
            name='push_token',
        ),
        migrations.RemoveField(
            model_name='pushnotificationtoken',
            name='user',
        ),
        migrations.DeleteModel(
            name='PushNotificationReceipt',
        ),
        migrations.DeleteModel(
            name='PushNotificationTicket',
        ),
        migrations.DeleteModel(
            name='PushNotificationToken',
        ),
    ]
