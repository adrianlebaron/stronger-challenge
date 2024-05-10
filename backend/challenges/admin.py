from django.contrib import admin
from .models import *

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'summary')
    list_display_links  = ('id', 'title')
admin.site.register(Challenge, ChallengeAdmin)

class ChallengeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
admin.site.register(ChallengeSubmission, ChallengeSubmissionAdmin)