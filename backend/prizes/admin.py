from django.contrib import admin
from .models import *

class GoalAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')
admin.site.register(Goal, GoalAdmin)

class ProgressImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'user')
    search_fields = ('id', 'type', 'user__username')
admin.site.register(ProgressImage, ProgressImageAdmin)

admin.site.register(WeightProgress)