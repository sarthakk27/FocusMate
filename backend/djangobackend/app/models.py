from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Note(models.Model):
    CATEGORY_CHOICES = [
        ('study', 'Study'),
        ('personal', 'Personal'),
        ('work', 'Work'),
        ('project', 'Project'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='study')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return self.title


class DailyPlan(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_plans')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_completed = models.BooleanField(default=False)
    planned_date = models.DateField(default=timezone.now)
    estimated_duration = models.PositiveIntegerField(help_text="Duration in minutes", null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', 'is_completed', 'created_at']

    def __str__(self):
        return f"{self.title} - {self.planned_date}"


class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    session_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-session_date']

    def __str__(self):
        return f"{self.subject} - {self.duration_minutes} mins"


class Goal(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress_percentage = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date', '-created_at']

    def __str__(self):
        return self.title


class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    title = models.CharField(max_length=200)
    message = models.TextField()
    reminder_time = models.DateTimeField()
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['reminder_time']

    def __str__(self):
        return f"{self.title} - {self.reminder_time}"
