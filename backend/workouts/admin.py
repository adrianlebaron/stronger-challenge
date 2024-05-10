from django.contrib import admin
from .models import *

# Register your models here.
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', 'exercise')
    list_display_links  = ('id', 'user', 'date')
    search_fields = ('id',)
admin.site.register(Workout, WorkoutAdmin)

admin.site.register(WorkoutReaction)
admin.site.register(WorkoutComment)

class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'file')
admin.site.register(Upload, UploadAdmin)

admin.site.register(PushNotificationTicket)
admin.site.register(PushNotificationReceipt)
admin.site.register(PushNotificationToken)