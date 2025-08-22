from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Note, DailyPlan, StudySession, Goal, Reminder


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, max_length=150)

    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        name = validated_data.pop('name')
        
        
        name_parts = name.strip().split(' ', 1)
        validated_data['first_name'] = name_parts[0]
        validated_data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''
        
        
        validated_data['username'] = validated_data['email']
        
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'first_name', 'last_name', 'bio', 'location', 'birth_date', 'avatar')


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ('id', 'user', 'title', 'content', 'category', 'is_pinned', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DailyPlanSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DailyPlan
        fields = ('id', 'user', 'title', 'description', 'priority', 'is_completed', 
                 'planned_date', 'estimated_duration', 'completed_at', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class StudySessionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = StudySession
        fields = ('id', 'user', 'subject', 'duration_minutes', 'notes', 'rating', 
                 'session_date', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GoalSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Goal
        fields = ('id', 'user', 'title', 'description', 'target_date', 'status', 
                 'progress_percentage', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ReminderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Reminder
        fields = ('id', 'user', 'title', 'message', 'reminder_time', 'is_sent', 'created_at')
        read_only_fields = ('id', 'user', 'is_sent', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DashboardDataSerializer(serializers.Serializer):
    total_notes = serializers.IntegerField()
    total_daily_plans = serializers.IntegerField()
    completed_plans_today = serializers.IntegerField()
    total_study_sessions = serializers.IntegerField()
    total_study_time = serializers.IntegerField()
    active_goals = serializers.IntegerField()
    upcoming_reminders = serializers.IntegerField()
    recent_notes = NoteSerializer(many=True)
    today_plans = DailyPlanSerializer(many=True)
    recent_study_sessions = StudySessionSerializer(many=True)
