from django.contrib import admin
from .models import InsuranceCompany

@admin.register(InsuranceCompany)
class InsuranceCompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'license_number', 'email', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'license_number', 'email')
    ordering = ('name',)
    
    fieldsets = (
        ('Company Information', {
            'fields': ('name', 'license_number', 'established_year')
        }),
        ('Contact Details', {
            'fields': ('email', 'phone', 'website', 'address')
        }),
        ('Registration Details', {
            'fields': ('registration_date', 'license_expiry_date')
        }),
        ('Financial Information', {
            'fields': ('authorized_capital', 'paid_up_capital')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
