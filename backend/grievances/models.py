from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Grievance(models.Model):
    """Model for insurance grievances submitted to IDRA"""
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('pending_response', 'Pending Response'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('claim_settlement', 'Claim Settlement'),
        ('policy_terms', 'Policy Terms & Conditions'),
        ('premium_issues', 'Premium Issues'),
        ('service_quality', 'Service Quality'),
        ('agent_conduct', 'Agent Conduct'),
        ('documentation', 'Documentation Issues'),
        ('fraud_concern', 'Fraud Concern'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    grievance_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Parties involved
    complainant_name = models.CharField(max_length=100)
    complainant_email = models.EmailField()
    complainant_phone = models.CharField(max_length=20)
    policy_number = models.CharField(max_length=50, blank=True)
    
    # Company information
    insurance_company = models.ForeignKey(
        'companies.InsuranceCompany',
        on_delete=models.CASCADE,
        related_name='grievances'
    )
    
    # User relationships
    submitted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submitted_grievances'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_grievances'
    )
    
    # Status and priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Dates and deadlines
    submitted_at = models.DateTimeField(auto_now_add=True)
    sla_deadline = models.DateTimeField()
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Financial details
    claim_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    settlement_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Public visibility
    is_public = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Grievance"
        verbose_name_plural = "Grievances"
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['grievance_id']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
            models.Index(fields=['insurance_company']),
        ]
    
    def __str__(self):
        return f"{self.grievance_id} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.grievance_id:
            # Generate unique grievance ID
            from datetime import datetime
            year = datetime.now().year
            count = Grievance.objects.filter(created_at__year=year).count() + 1
            self.grievance_id = f"GRV-{year}-{count:05d}"
        super().save(*args, **kwargs)

class GrievanceMessage(models.Model):
    """Model for messages/responses in grievance conversations"""
    
    grievance = models.ForeignKey(
        Grievance,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal notes vs public responses
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Grievance Message"
        verbose_name_plural = "Grievance Messages"
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message for {self.grievance.grievance_id} by {self.sender.get_full_name()}"

class GrievanceDocument(models.Model):
    """Model for documents attached to grievances"""
    
    grievance = models.ForeignKey(
        Grievance,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.PositiveIntegerField()  # in bytes
    content_type = models.CharField(max_length=100)
    
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=False)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Grievance Document"
        verbose_name_plural = "Grievance Documents"
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.file_name} for {self.grievance.grievance_id}"

class AuditLog(models.Model):
    """Model for tracking all actions in the system"""
    
    ACTION_CHOICES = [
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
        ('view', 'Viewed'),
        ('assign', 'Assigned'),
        ('status_change', 'Status Changed'),
        ('message_sent', 'Message Sent'),
        ('file_upload', 'File Uploaded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    details = models.JSONField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['model_name']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user.get_full_name()} {self.get_action_display()} {self.model_name} at {self.timestamp}"