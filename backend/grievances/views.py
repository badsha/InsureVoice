from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from datetime import datetime, timedelta
from .models import Grievance, GrievanceMessage
from .serializers import GrievanceSerializer, GrievanceMessageSerializer

class GrievanceListCreateView(generics.ListCreateAPIView):
    """List and create grievances"""
    serializer_class = GrievanceSerializer
    permission_classes = [AllowAny]  # Allow anonymous grievance submission
    
    def get_queryset(self):
        queryset = Grievance.objects.all()
        user = self.request.user
        
        if user.is_authenticated:
            # Filter based on user role
            if hasattr(user, 'profile'):
                if user.profile.role == 'insurance_company':
                    queryset = queryset.filter(insurance_company=user.profile.company)
                elif user.profile.role == 'policyholder':
                    queryset = queryset.filter(submitted_by=user)
        else:
            # Anonymous users can only see public grievances
            queryset = queryset.filter(is_public=True)
            
        return queryset.order_by('-submitted_at')

class GrievanceDetailView(generics.RetrieveUpdateAPIView):
    """Get and update grievance details"""
    serializer_class = GrievanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Grievance.objects.all()
        
        if hasattr(user, 'profile'):
            if user.profile.role == 'insurance_company':
                queryset = queryset.filter(insurance_company=user.profile.company)
            elif user.profile.role == 'policyholder':
                queryset = queryset.filter(submitted_by=user)
                
        return queryset

class GrievanceMessageListCreateView(generics.ListCreateAPIView):
    """List and create messages for a grievance"""
    serializer_class = GrievanceMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        grievance_id = self.kwargs['pk']
        return GrievanceMessage.objects.filter(grievance_id=grievance_id)
    
    def perform_create(self, serializer):
        grievance_id = self.kwargs['pk']
        serializer.save(sender=self.request.user, grievance_id=grievance_id)

class GrievanceTrackView(APIView):
    """Track grievance by ID (public endpoint)"""
    permission_classes = [AllowAny]
    
    def get(self, request, grievance_id):
        try:
            grievance = Grievance.objects.get(grievance_id=grievance_id)
            serializer = GrievanceSerializer(grievance)
            return Response(serializer.data)
        except Grievance.DoesNotExist:
            return Response(
                {'error': 'Grievance not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class AnalyticsView(APIView):
    """Analytics data for IDRA administrators"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Check if user is IDRA admin
        if not (hasattr(user, 'profile') and user.profile.role in ['idra_admin', 'super_admin']):
            return Response(
                {'error': 'Unauthorized'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Calculate analytics
        total_grievances = Grievance.objects.count()
        pending_grievances = Grievance.objects.filter(status='open').count()
        resolved_grievances = Grievance.objects.filter(status='resolved').count()
        
        # Monthly statistics
        current_month = datetime.now().replace(day=1)
        monthly_grievances = Grievance.objects.filter(
            submitted_at__gte=current_month
        ).count()
        
        # By category
        category_stats = Grievance.objects.values('category').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # By company
        company_stats = Grievance.objects.values(
            'insurance_company__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_grievances': total_grievances,
            'pending_grievances': pending_grievances,
            'resolved_grievances': resolved_grievances,
            'monthly_grievances': monthly_grievances,
            'category_stats': category_stats,
            'company_stats': company_stats,
        })