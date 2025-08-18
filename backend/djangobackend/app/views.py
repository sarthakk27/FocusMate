from django.shortcuts import render
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum, Count
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import date, timedelta
from .models import UserProfile, Note, DailyPlan, StudySession, Goal, Reminder
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    NoteSerializer, DailyPlanSerializer, StudySessionSerializer,
    GoalSerializer, ReminderSerializer, DashboardDataSerializer
)

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'message': 'User created successfully', 'user_id': user.id},
            status=status.HTTP_201_CREATED
        )


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        user_serializer = UserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data
        })


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        
        # Calculate dashboard statistics
        total_notes = Note.objects.filter(user=user).count()
        total_daily_plans = DailyPlan.objects.filter(user=user, planned_date=today).count()
        completed_plans_today = DailyPlan.objects.filter(
            user=user, planned_date=today, is_completed=True
        ).count()
        
        total_study_sessions = StudySession.objects.filter(user=user).count()
        total_study_time = StudySession.objects.filter(user=user).aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0
        
        active_goals = Goal.objects.filter(
            user=user, status__in=['not_started', 'in_progress']
        ).count()
        
        upcoming_reminders = Reminder.objects.filter(
            user=user, is_sent=False, reminder_time__gte=timezone.now()
        ).count()
        
        # Get recent data
        recent_notes = Note.objects.filter(user=user)[:5]
        today_plans = DailyPlan.objects.filter(user=user, planned_date=today)
        recent_study_sessions = StudySession.objects.filter(user=user)[:5]
        
        dashboard_data = {
            'total_notes': total_notes,
            'total_daily_plans': total_daily_plans,
            'completed_plans_today': completed_plans_today,
            'total_study_sessions': total_study_sessions,
            'total_study_time': total_study_time,
            'active_goals': active_goals,
            'upcoming_reminders': upcoming_reminders,
            'recent_notes': NoteSerializer(recent_notes, many=True).data,
            'today_plans': DailyPlanSerializer(today_plans, many=True).data,
            'recent_study_sessions': StudySessionSerializer(recent_study_sessions, many=True).data,
        }
        
        return Response(dashboard_data)


# Note Views
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


# Daily Plan Views
class DailyPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = DailyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        date_param = self.request.query_params.get('date', None)
        queryset = DailyPlan.objects.filter(user=self.request.user)
        if date_param:
            queryset = queryset.filter(planned_date=date_param)
        return queryset


class DailyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DailyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyPlan.objects.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        plan = self.get_object()
        if 'is_completed' in request.data and request.data['is_completed']:
            plan.completed_at = timezone.now()
            plan.save()
        return super().patch(request, *args, **kwargs)


# Study Session Views
class StudySessionListCreateView(generics.ListCreateAPIView):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)


class StudySessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)


# Goal Views
class GoalListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)


class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)


# Reminder Views
class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)


class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)


# Statistics Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def study_statistics(request):
    user = request.user
    
    # Get study statistics for the last 7 days
    last_week = timezone.now().date() - timedelta(days=7)
    sessions = StudySession.objects.filter(
        user=user, 
        session_date__date__gte=last_week
    )
    
    daily_stats = {}
    for i in range(7):
        day = last_week + timedelta(days=i)
        day_sessions = sessions.filter(session_date__date=day)
        daily_stats[str(day)] = {
            'sessions': day_sessions.count(),
            'total_minutes': day_sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
        }
    
    total_sessions = sessions.count()
    total_minutes = sessions.aggregate(total=Sum('duration_minutes'))['total'] or 0
    avg_session_length = total_minutes / total_sessions if total_sessions > 0 else 0
    
    return Response({
        'daily_stats': daily_stats,
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'average_session_length': round(avg_session_length, 2)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def productivity_summary(request):
    user = request.user
    today = date.today()
    
    # Today's productivity
    today_plans = DailyPlan.objects.filter(user=user, planned_date=today)
    completed_today = today_plans.filter(is_completed=True).count()
    total_today = today_plans.count()
    completion_rate = (completed_today / total_today * 100) if total_today > 0 else 0
    
    # This week's productivity
    week_start = today - timedelta(days=today.weekday())
    week_plans = DailyPlan.objects.filter(
        user=user, 
        planned_date__gte=week_start,
        planned_date__lte=today
    )
    completed_week = week_plans.filter(is_completed=True).count()
    total_week = week_plans.count()
    week_completion_rate = (completed_week / total_week * 100) if total_week > 0 else 0
    
    return Response({
        'today': {
            'completed': completed_today,
            'total': total_today,
            'completion_rate': round(completion_rate, 2)
        },
        'this_week': {
            'completed': completed_week,
            'total': total_week,
            'completion_rate': round(week_completion_rate, 2)
        }
    })
