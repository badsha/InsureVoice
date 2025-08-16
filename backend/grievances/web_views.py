from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import HttpResponseForbidden
from .models import Grievance, GrievanceMessage


@login_required
def grievance_list(request):
    """List all grievances based on user role"""
    user_profile = request.user.profile
    
    if user_profile.role == 'policyholder':
        # Policyholder sees only their grievances
        grievances = Grievance.objects.filter(submitted_by=request.user)
    elif user_profile.role == 'insurance_company':
        # Insurance company sees grievances assigned to them
        grievances = Grievance.objects.filter(insurance_company=user_profile.company)
    else:  # IDRA admin or super admin
        # Admin sees all grievances
        grievances = Grievance.objects.all()
    
    grievances = grievances.order_by('-created_at')
    
    # Pagination
    paginator = Paginator(grievances, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'grievances': page_obj,
        'user_role': user_profile.role,
    }
    
    return render(request, 'grievances/list.html', context)


@login_required
def grievance_detail(request, pk):
    """View single grievance detail"""
    grievance = get_object_or_404(Grievance, pk=pk)
    user_profile = request.user.profile
    
    # Check permissions
    if user_profile.role == 'policyholder' and grievance.submitted_by != request.user:
        messages.error(request, 'You can only view your own grievances.')
        return redirect('grievances:list')
    elif user_profile.role == 'insurance_company' and grievance.insurance_company != user_profile.company:
        messages.error(request, 'You can only view grievances assigned to your company.')
        return redirect('grievances:list')
    
    # Handle message posting
    if request.method == 'POST' and 'message_content' in request.POST:
        message_content = request.POST.get('message_content')
        if message_content.strip():
            # Create a new message
            GrievanceMessage.objects.create(
                grievance=grievance,
                sender=request.user,
                sender_role=user_profile.role,
                content=message_content.strip()
            )
            messages.success(request, 'Your message has been added.')
            return redirect('grievances:detail', pk=pk)
    
    # Get all messages for this grievance
    grievance_messages = grievance.messages.all().order_by('created_at')
    
    context = {
        'grievance': grievance,
        'messages': grievance_messages,
        'user_role': user_profile.role,
    }
    
    return render(request, 'grievances/detail.html', context)


@login_required
def grievance_create(request):
    """Create new grievance"""
    user_profile = request.user.profile
    
    if user_profile.role != 'policyholder':
        messages.error(request, 'Only policyholders can submit grievances.')
        return redirect('grievances:list')
    
    if request.method == 'POST':
        # Handle grievance creation
        title = request.POST.get('title')
        description = request.POST.get('description')
        category = request.POST.get('category')
        policy_number = request.POST.get('policy_number')
        
        if not all([title, description, category]):
            messages.error(request, 'Please fill in all required fields.')
            return render(request, 'grievances/create.html')
        
        # Create grievance with auto-generated ID
        import uuid
        grievance_id = f"GRV-{uuid.uuid4().hex[:8].upper()}"
        
        grievance = Grievance.objects.create(
            grievance_id=grievance_id,
            title=title,
            description=description,
            category=category,
            policy_number=policy_number,
            complainant_name=f"{request.user.first_name} {request.user.last_name}",
            complainant_email=request.user.email,
            complainant_phone=getattr(request.user, 'phone', ''),
            submitted_by=request.user,
            # Will need to assign insurance_company based on policy or manual assignment
        )
        
        messages.success(request, f'Grievance {grievance_id} has been submitted successfully.')
        return redirect('grievances:detail', pk=grievance.pk)
    
    return render(request, 'grievances/create.html')


@login_required
def grievance_update_status(request, pk):
    """Update grievance status and priority (admin/company only)"""
    grievance = get_object_or_404(Grievance, pk=pk)
    user_profile = request.user.profile
    
    # Check permissions - only admins and assigned insurance companies can update
    if user_profile.role == 'policyholder':
        messages.error(request, 'You do not have permission to update grievance status.')
        return redirect('grievances:detail', pk=pk)
    elif user_profile.role == 'insurance_company' and grievance.insurance_company != user_profile.company:
        messages.error(request, 'You can only update grievances assigned to your company.')
        return redirect('grievances:detail', pk=pk)
    
    if request.method == 'POST':
        new_status = request.POST.get('status')
        new_priority = request.POST.get('priority')
        
        # Validate status choices
        valid_statuses = ['submitted', 'under_review', 'in_progress', 'resolved']
        valid_priorities = ['low', 'medium', 'high']
        
        if new_status in valid_statuses:
            old_status = grievance.status
            old_priority = grievance.priority
            grievance.status = new_status
            
            if new_priority in valid_priorities:
                grievance.priority = new_priority
                
            grievance.save()
            
            # Create a message about the status update
            status_message = f"Status updated from '{old_status}' to '{new_status}'"
            if new_priority in valid_priorities and old_priority != new_priority:
                status_message += f" and priority changed from '{old_priority}' to '{new_priority}'"
            
            GrievanceMessage.objects.create(
                grievance=grievance,
                sender=request.user,
                sender_role=user_profile.role,
                content=status_message
            )
            
            messages.success(request, 'Grievance status updated successfully.')
        else:
            messages.error(request, 'Invalid status provided.')
    
    return redirect('grievances:detail', pk=pk)


def grievance_track(request):
    """Track grievance by ID (public view)"""
    grievance = None
    
    if request.method == 'POST':
        grievance_id = request.POST.get('grievance_id')
        if grievance_id:
            try:
                grievance = Grievance.objects.get(grievance_id=grievance_id)
            except Grievance.DoesNotExist:
                messages.error(request, 'Grievance not found with the provided ID.')
    
    context = {
        'grievance': grievance,
    }
    
    return render(request, 'grievances/track.html', context)