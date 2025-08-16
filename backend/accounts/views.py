from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    """User login endpoint"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Authenticate user
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'message': 'Login successful',
                'user': serializer.data
            })
        else:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {'error': 'Login failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    logout(request)
    return Response({'message': 'Logout successful'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """User registration endpoint"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone = request.data.get('phone')
        
        if not all([email, password, first_name, last_name]):
            return Response(
                {'error': 'All required fields must be provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        
        # Login the user
        login(request, user)
        
        serializer = UserSerializer(user)
        return Response({
            'message': 'Registration successful',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': 'Registration failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )