from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from grievances.models import Grievance
from companies.models import InsuranceCompany
from accounts.models import UserProfile


def landing_page(request):
    """Landing page with system overview statistics."""
    stats = {
        'total_grievances': Grievance.objects.count(),
        'resolved_grievances': Grievance.objects.filter(status='resolved').count(),
        'total_companies': InsuranceCompany.objects.filter(is_active=True).count(),
        'total_users': UserProfile.objects.count(),
    }
    
    return render(request, 'landing.html', {'stats': stats})


@login_required
def dashboard(request):
    """Main dashboard for authenticated users."""
    try:
        user_profile = request.user.profile
    except UserProfile.DoesNotExist:
        # Create default profile if it doesn't exist
        user_profile = UserProfile.objects.create(user=request.user, role='policyholder')
    
    # Get user-specific statistics
    if user_profile.role == 'policyholder':
        # Policyholder sees only their grievances
        user_grievances = Grievance.objects.filter(submitted_by=request.user)
        stats = {
            'total_grievances': user_grievances.count(),
            'submitted': user_grievances.filter(status='submitted').count(),
            'under_review': user_grievances.filter(status='under_review').count(),
            'resolved': user_grievances.filter(status='resolved').count(),
        }
        recent_grievances = user_grievances.order_by('-created_at')[:5]
        
    elif user_profile.role == 'insurance_company':
        # Insurance company sees grievances assigned to them
        company_grievances = Grievance.objects.filter(insurance_company=user_profile.company)
        stats = {
            'total_grievances': company_grievances.count(),
            'pending_action': company_grievances.filter(status__in=['submitted', 'under_review']).count(),
            'in_progress': company_grievances.filter(status='in_progress').count(),
            'resolved': company_grievances.filter(status='resolved').count(),
        }
        recent_grievances = company_grievances.order_by('-created_at')[:5]
        
    else:  # IDRA admin or super admin
        # Admin sees all grievances
        all_grievances = Grievance.objects.all()
        stats = {
            'total_grievances': all_grievances.count(),
            'submitted': all_grievances.filter(status='submitted').count(),
            'under_review': all_grievances.filter(status='under_review').count(),
            'in_progress': all_grievances.filter(status='in_progress').count(),
            'resolved': all_grievances.filter(status='resolved').count(),
        }
        recent_grievances = all_grievances.order_by('-created_at')[:5]
    
    context = {
        'stats': stats,
        'recent_grievances': recent_grievances,
        'user_role': user_profile.role,
    }
    
    return render(request, 'dashboard.html', context)