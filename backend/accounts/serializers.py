from rest_framework import serializers
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profiles"""
    class Meta:
        model = UserProfile
        fields = [
            'role', 'company', 'national_id', 'address',
            'designation', 'employee_id', 'is_verified'
        ]

class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'profile_image_url', 'is_active', 'date_joined', 'profile'
        ]
        read_only_fields = ['id', 'date_joined']