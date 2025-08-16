from django.db import models

class InsuranceCompany(models.Model):
    """Model for insurance companies registered with IDRA"""
    
    name = models.CharField(max_length=200, unique=True)
    license_number = models.CharField(max_length=50, unique=True)
    established_year = models.PositiveIntegerField()
    
    # Contact information
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    
    # Registration details
    registration_date = models.DateField()
    license_expiry_date = models.DateField()
    
    # Financial information
    authorized_capital = models.DecimalField(max_digits=15, decimal_places=2)
    paid_up_capital = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Insurance Company"
        verbose_name_plural = "Insurance Companies"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def total_grievances(self):
        """Get total number of grievances for this company"""
        return self.grievances.count()
    
    @property
    def pending_grievances(self):
        """Get number of pending grievances for this company"""
        return self.grievances.filter(status='open').count()