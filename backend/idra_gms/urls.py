"""
URL configuration for IDRA Grievance Management System project.
"""
from django.contrib import admin
from django.urls import path, include
from core.views import landing_page, dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_page, name='landing'),
    path('dashboard/', dashboard, name='dashboard'),
    path('accounts/', include('accounts.urls')),
    path('grievances/', include('grievances.urls')),
    path('companies/', include('companies.urls')),
    
    # API endpoints (separate namespace)
    path('api/auth/', include('accounts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/grievances/', include('grievances.urls')),
]