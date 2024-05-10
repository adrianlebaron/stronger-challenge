# Generated by Django 5.0.3 on 2024-05-10 02:32

import backend.storage_backends
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('Doing', 'Doing'), ('Achieved', 'Achieved'), ('Failed', 'Failed'), ('Discarded', 'Discarded')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProgressImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('before', 'BEFORE'), ('after', 'AFTER')], default='before', max_length=10)),
                ('file', models.FileField(storage=backend.storage_backends.ImageStorage(), upload_to='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WeightProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('starting_weight', models.FloatField(blank=True, null=True)),
                ('starting_video', models.FileField(blank=True, null=True, storage=backend.storage_backends.VideoStorage(), upload_to='')),
                ('starting_video_status', models.CharField(blank=True, max_length=20)),
                ('ending_weight', models.FloatField(blank=True, null=True)),
                ('ending_video', models.FileField(blank=True, null=True, storage=backend.storage_backends.VideoStorage(), upload_to='')),
                ('ending_video_status', models.CharField(blank=True, max_length=20)),
                ('units', models.CharField(default='lbs', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]