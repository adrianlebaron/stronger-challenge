# Generated by Django 5.0.1 on 2024-01-24 23:52

import django.db.models.deletion
import womenKos.storage_backends
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('summary', models.TextField()),
                ('repeat', models.CharField(choices=[('Never', 'Never'), ('Weekly', 'Weekly'), ('Bi-Weekly', 'Bi-Weekly'), ('Bi-Monthly', 'Bi-Monthly'), ('Monthly', 'Monthly')], default='Never', max_length=10)),
                ('response', models.CharField(choices=[('Time', 'Time'), ('Amount', 'Amount')], default='Amount', max_length=10)),
                ('deadline', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Upload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('file', models.FileField(storage=womenKos.storage_backends.ImageStorage(), upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='ChallengeSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.TimeField(blank=True, null=True)),
                ('amount', models.DecimalField(blank=True, decimal_places=5, max_digits=20, null=True)),
                ('details', models.TextField(blank=True, null=True)),
                ('challenge', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='challenge', to='api.challenge')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CheckIn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('workoutLength', models.TimeField()),
                ('workoutType', models.CharField(max_length=100)),
                ('picture', models.URLField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CheckInComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('check_in', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.checkin')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CheckInReaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reaction', models.CharField(choices=[('💪', 'Muscle'), ('👍', 'Thumbs Up'), ('🏆', 'Trophy'), ('😎', 'Sunglasses'), ('🥵', 'Face with Heat'), ('💯', '100')], max_length=2)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('check_in', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.checkin')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('summary', models.TextField()),
                ('video', models.URLField(blank=True, null=True)),
                ('images', models.URLField(blank=True, null=True)),
                ('challenges', models.ManyToManyField(to='api.challenge')),
            ],
        ),
        migrations.CreateModel(
            name='ForgotPasswordToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('token', models.TextField(unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('age', models.DateField(blank=True, null=True)),
                ('isJunior', models.BooleanField(default=False)),
                ('height', models.IntegerField(blank=True, null=True)),
                ('weight', models.IntegerField(blank=True, null=True)),
                ('roles', models.CharField(choices=[('ADMIN', 'Admin'), ('USER', 'User')], default='USER', max_length=5)),
                ('shirt_size', models.CharField(choices=[('SMALL', 'Small'), ('MEDIUM', 'Medium'), ('LARGE', 'Large'), ('EXTRA-LARGE', 'Extra-Large'), ('2XL', '2XL'), ('3XL', '3XL')], default='LARGE', max_length=20)),
                ('language', models.CharField(choices=[('ENGLISH', 'English'), ('SPANISH', 'Spanish')], default='ENGLISH', max_length=20)),
                ('registration', models.BooleanField(default='False')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('registrationSubmission', models.ManyToManyField(blank=True, to='api.upload')),
            ],
        ),
    ]