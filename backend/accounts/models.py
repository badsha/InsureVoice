from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model for IDRA GMS"""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    profile_image_url = models.URLField(blank=True)
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class UserProfile(models.Model):
    """Extended user profile for role-specific information"""
    
    ROLE_CHOICES = [
        ('policyholder', 'Policyholder'),
        ('insurance_company', 'Insurance Company'),
        ('idra_admin', 'IDRA Administrator'),
        ('super_admin', 'Super Administrator'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    company = models.ForeignKey(
        'companies.InsuranceCompany', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Insurance company (for insurance company users)"
    )
    
    # Policyholder specific fields
    national_id = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Company representative fields
    designation = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()}"