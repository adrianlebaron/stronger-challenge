from django.db import models
from django.contrib.auth.models import User
from backend.storage_backends import ImageStorage, VideoStorage

class Goal(models.Model):
    DOING_STATUS = 'Doing'
    ACHIEVED_STATUS = 'Achieved'
    FAILED_STATUS= 'Failed'
    DISCARDED_STATUS = 'Discarded'

    STATUS = (
            ('Doing', DOING_STATUS),
            ('Achieved', ACHIEVED_STATUS),
            ('Failed', FAILED_STATUS),
            ('Discarded', DISCARDED_STATUS)
        )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class ProgressImage(models.Model):
    BEFORE = 'before'
    AFTER = 'after'

    TYPE_OPTIONS = (
        (BEFORE, 'BEFORE'),
        (AFTER, 'AFTER')
    )

    def delete(self, using=None, keep_parents=False):
        self.file.delete()
        return super(ProgressImage, self).delete(using, keep_parents)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TYPE_OPTIONS, default=BEFORE)
    file = models.FileField(storage=ImageStorage())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class WeightProgress(models.Model):
    def delete(self, using=None, keep_parents=False):
        self.starting_video.delete()
        self.ending_video.delete()
        return super(WeightProgress, self).delete(using, keep_parents)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    starting_weight = models.FloatField(blank=True, null=True)
    starting_video = models.FileField(storage=VideoStorage(), blank=True, null=True)
    starting_video_status = models.CharField(max_length=20, blank=True)
    ending_weight = models.FloatField(blank=True, null=True)
    ending_video = models.FileField(storage=VideoStorage(), blank=True, null=True)
    ending_video_status = models.CharField(max_length=20, blank=True)
    units = models.CharField(max_length=10, default="lbs")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
