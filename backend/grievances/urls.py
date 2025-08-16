from django.urls import path
from . import views, web_views

app_name = 'grievances'

urlpatterns = [
    # Web views
    path('', web_views.grievance_list, name='list'),
    path('create/', web_views.grievance_create, name='create'),
    path('<int:pk>/', web_views.grievance_detail, name='detail'),
    path('<int:pk>/update-status/', web_views.grievance_update_status, name='update_status'),
    path('track/', web_views.grievance_track, name='track'),
    
    # API views (for compatibility)
    path('api/', views.GrievanceListCreateView.as_view(), name='api-list-create'),
    path('api/<int:pk>/', views.GrievanceDetailView.as_view(), name='api-detail'),
    path('api/<int:pk>/messages/', views.GrievanceMessageListCreateView.as_view(), name='api-messages'),
    path('api/track/<str:grievance_id>/', views.GrievanceTrackView.as_view(), name='api-track'),
    path('api/analytics/', views.AnalyticsView.as_view(), name='api-analytics'),
]