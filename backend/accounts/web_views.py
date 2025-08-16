from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User, UserProfile


def login_view(request):
    """Login view with form handling"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if not email or not password:
            messages.error(request, 'Email and password are required.')
            return render(request, 'accounts/login.html')
        
        user = authenticate(request, username=email, password=password)
        
        if user:
            if user.is_active:
                login(request, user)
                messages.success(request, f'Welcome back, {user.first_name}!')
                return redirect('dashboard')
            else:
                messages.error(request, 'Your account is disabled.')
        else:
            messages.error(request, 'Invalid email or password.')
    
    return render(request, 'accounts/login.html')


@login_required
def logout_view(request):
    """Logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('landing')


@login_required
def user_profile(request):
    """User profile view"""
    try:
        profile = request.user.profile
        context = {
            'user': request.user,
            'profile': profile
        }
        return render(request, 'accounts/profile.html', context)
    except UserProfile.DoesNotExist:
        messages.error(request, 'User profile not found.')
        return redirect('dashboard')


def register_view(request):
    """User registration view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        # Handle registration form
        pass
    
    return render(request, 'accounts/register.html')