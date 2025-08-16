from django.urls import path
from . import views, web_views

app_name = 'accounts'

urlpatterns = [
    # Web views
    path('login/', web_views.login_view, name='login'),
    path('logout/', web_views.logout_view, name='logout'),
    path('profile/', web_views.user_profile, name='profile'),
    path('register/', web_views.register_view, name='register'),
    
    # API views (for compatibility)
    path('api/login/', views.login_view, name='api-login'),
    path('api/logout/', views.logout_view, name='api-logout'),
    path('api/user/', views.user_profile, name='api-user-profile'),
    path('api/register/', views.register_view, name='api-register'),
]