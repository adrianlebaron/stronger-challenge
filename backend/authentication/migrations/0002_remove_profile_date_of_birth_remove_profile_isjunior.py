# Generated by Django 5.0.3 on 2024-05-04 05:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='date_of_birth',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='isJunior',
        ),
    ]