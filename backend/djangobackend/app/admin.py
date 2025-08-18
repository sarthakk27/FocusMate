from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Note, DailyPlan, StudySession, Goal, Reminder

# Register your models here.

# Unregister the default User admin and register a custom one
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-date_joined',)
    inlines = (UserProfileInline,)
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Ensure UserProfile exists
        if not hasattr(obj, 'profile'):
            UserProfile.objects.create(user=obj)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email')


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'is_pinned', 'created_at')
    list_filter = ('category', 'is_pinned', 'created_at')
    search_fields = ('title', 'content', 'user__username')
    list_editable = ('is_pinned',)


@admin.register(DailyPlan)
class DailyPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'priority', 'is_completed', 'planned_date')
    list_filter = ('priority', 'is_completed', 'planned_date')
    search_fields = ('title', 'description', 'user__username')
    list_editable = ('is_completed',)


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ('subject', 'user', 'duration_minutes', 'rating', 'session_date')
    list_filter = ('rating', 'session_date')
    search_fields = ('subject', 'user__username')


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'target_date', 'progress_percentage')
    list_filter = ('status', 'target_date')
    search_fields = ('title', 'description', 'user__username')
    list_editable = ('status', 'progress_percentage')


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'reminder_time', 'is_sent')
    list_filter = ('is_sent', 'reminder_time')
    search_fields = ('title', 'message', 'user__username')
    list_editable = ('is_sent',)
