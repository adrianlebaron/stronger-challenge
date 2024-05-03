from django.contrib import admin
from .models import *

# Register your models here.
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id','date')
admin.site.register(Workout, WorkoutAdmin)

class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'file')
admin.site.register(Upload, UploadAdmin)

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
admin.site.register(Challenge, ChallengeAdmin)

class ChallengeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
admin.site.register(ChallengeSubmission, ChallengeSubmissionAdmin)