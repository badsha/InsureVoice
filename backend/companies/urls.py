from django.urls import path
from . import views

app_name = 'companies'

urlpatterns = [
    # Web Views
    path('', views.company_list, name='list'),
    path('<int:pk>/', views.company_detail, name='detail'),
    path('create/', views.company_create, name='create'),
    
    # API Views
    path('api/', views.InsuranceCompanyListView.as_view(), name='api-list'),
    path('api/<int:pk>/', views.InsuranceCompanyDetailView.as_view(), name='api-detail'),
]