from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import *

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'
    list_display = ('id')

class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


class CheckInAdmin(admin.ModelAdmin):
    list_display = ('id','date')
admin.site.register(CheckIn, CheckInAdmin)

admin.site.register(CheckInReaction)
admin.site.register(CheckInComment)

class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'file')
admin.site.register(Upload, UploadAdmin)

class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
admin.site.register(Challenge, ChallengeAdmin)

class ChallengeSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
admin.site.register(ChallengeSubmission, ChallengeSubmissionAdmin)

class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
admin.site.register(Event, EventAdmin)
