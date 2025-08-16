from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import InsuranceCompany
from .serializers import InsuranceCompanySerializer

# Web Views for Company Management
def company_list(request):
    """List all active insurance companies (public view)"""
    companies = InsuranceCompany.objects.filter(is_active=True).order_by('name')
    
    # Pagination
    paginator = Paginator(companies, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'companies': page_obj,
        'total_companies': companies.count(),
    }
    
    return render(request, 'companies/list.html', context)

def company_detail(request, pk):
    """View single company detail (public view)"""
    company = get_object_or_404(InsuranceCompany, pk=pk, is_active=True)
    
    # Get grievance stats for this company
    grievance_stats = {
        'total': company.grievances.count(),
        'pending': company.grievances.filter(status='open').count(),
        'resolved': company.grievances.filter(status='resolved').count(),
    }
    
    context = {
        'company': company,
        'grievance_stats': grievance_stats,
    }
    
    return render(request, 'companies/detail.html', context)

@login_required
def company_create(request):
    """Create new insurance company (admin only)"""
    user_profile = request.user.profile
    
    if user_profile.role not in ['idra_admin', 'super_admin']:
        messages.error(request, 'Only IDRA administrators can register new companies.')
        return redirect('companies:list')
    
    if request.method == 'POST':
        # Handle company creation
        name = request.POST.get('name')
        license_number = request.POST.get('license_number')
        established_year = request.POST.get('established_year')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        website = request.POST.get('website')
        registration_date = request.POST.get('registration_date')
        license_expiry_date = request.POST.get('license_expiry_date')
        authorized_capital = request.POST.get('authorized_capital')
        paid_up_capital = request.POST.get('paid_up_capital')
        
        if not all([name, license_number, established_year, email, phone, address, registration_date, license_expiry_date]):
            messages.error(request, 'Please fill in all required fields.')
            return render(request, 'companies/create.html')
        
        try:
            company = InsuranceCompany.objects.create(
                name=name,
                license_number=license_number,
                established_year=int(established_year),
                email=email,
                phone=phone,
                address=address,
                website=website,
                registration_date=registration_date,
                license_expiry_date=license_expiry_date,
                authorized_capital=float(authorized_capital) if authorized_capital else 0,
                paid_up_capital=float(paid_up_capital) if paid_up_capital else 0,
                is_active=True
            )
            
            messages.success(request, f'Insurance company "{name}" has been registered successfully.')
            return redirect('companies:detail', pk=company.pk)
            
        except Exception as e:
            messages.error(request, f'Error creating company: {str(e)}')
    
    return render(request, 'companies/create.html')

# API Views (keep existing API functionality)
class InsuranceCompanyListView(generics.ListAPIView):
    """List all insurance companies"""
    queryset = InsuranceCompany.objects.filter(is_active=True)
    serializer_class = InsuranceCompanySerializer
    permission_classes = [AllowAny]

class InsuranceCompanyDetailView(generics.RetrieveAPIView):
    """Get details of a specific insurance company"""
    queryset = InsuranceCompany.objects.filter(is_active=True)
    serializer_class = InsuranceCompanySerializer
    permission_classes = [AllowAny]