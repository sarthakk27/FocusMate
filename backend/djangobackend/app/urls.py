from django.urls import path
from . import views

urlpatterns = [
    
    path('csrf-token/', views.get_csrf_token),
    
    
    path('auth/register/', views.UserRegistrationView.as_view()),
    path('auth/login/', views.UserLoginView.as_view()),
    path('auth/logout/', views.UserLogoutView.as_view()),
    path('auth/user/', views.CurrentUserView.as_view()),
    
    
    path('dashboard/', views.DashboardView.as_view()),
    
    
    path('notes/', views.NoteListCreateView.as_view()),
    path('notes/<int:pk>/', views.NoteDetailView.as_view()),
    
    
    path('daily-plans/', views.DailyPlanListCreateView.as_view()),
    path('daily-plans/<int:pk>/', views.DailyPlanDetailView.as_view()),
    
    
    path('study-sessions/', views.StudySessionListCreateView.as_view()),
    path('study-sessions/<int:pk>/', views.StudySessionDetailView.as_view()),
    
    
    path('goals/', views.GoalListCreateView.as_view()),
    path('goals/<int:pk>/', views.GoalDetailView.as_view()),
    
    
    path('reminders/', views.ReminderListCreateView.as_view()),
    path('reminders/<int:pk>/', views.ReminderDetailView.as_view()),
    
    
    path('statistics/study/', views.study_statistics),
    path('statistics/productivity/', views.productivity_summary),
]
