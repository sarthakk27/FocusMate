from django.urls import path
from . import views

urlpatterns = [
    # CSRF Token
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
    
    # Authentication URLs
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/logout/', views.UserLogoutView.as_view(), name='logout'),
    path('auth/user/', views.CurrentUserView.as_view(), name='current-user'),
    
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # Notes
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', views.NoteDetailView.as_view(), name='note-detail'),
    
    # Daily Plans
    path('daily-plans/', views.DailyPlanListCreateView.as_view(), name='daily-plan-list-create'),
    path('daily-plans/<int:pk>/', views.DailyPlanDetailView.as_view(), name='daily-plan-detail'),
    
    # Study Sessions
    path('study-sessions/', views.StudySessionListCreateView.as_view(), name='study-session-list-create'),
    path('study-sessions/<int:pk>/', views.StudySessionDetailView.as_view(), name='study-session-detail'),
    
    # Goals
    path('goals/', views.GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', views.GoalDetailView.as_view(), name='goal-detail'),
    
    # Reminders
    path('reminders/', views.ReminderListCreateView.as_view(), name='reminder-list-create'),
    path('reminders/<int:pk>/', views.ReminderDetailView.as_view(), name='reminder-detail'),
    
    # Statistics
    path('statistics/study/', views.study_statistics, name='study-statistics'),
    path('statistics/productivity/', views.productivity_summary, name='productivity-summary'),
]
