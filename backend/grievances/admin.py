from django.contrib import admin
from .models import Grievance, GrievanceMessage, GrievanceDocument

@admin.register(Grievance)
class GrievanceAdmin(admin.ModelAdmin):
    list_display = ('grievance_id', 'title', 'status', 'priority', 'submitted_by', 'insurance_company', 'created_at')
    list_filter = ('status', 'priority', 'category', 'insurance_company', 'created_at')
    search_fields = ('grievance_id', 'title', 'complainant_name', 'complainant_email', 'policy_number')
    ordering = ('-created_at',)
    readonly_fields = ('grievance_id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Grievance Information', {
            'fields': ('grievance_id', 'title', 'description', 'category', 'status', 'priority')
        }),
        ('Complainant Details', {
            'fields': ('complainant_name', 'complainant_email', 'complainant_phone', 'submitted_by')
        }),
        ('Policy & Company', {
            'fields': ('policy_number', 'claim_amount', 'insurance_company', 'assigned_to')
        }),
        ('Resolution', {
            'fields': ('resolution_summary', 'compensation_amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(GrievanceMessage)
class GrievanceMessageAdmin(admin.ModelAdmin):
    list_display = ('grievance', 'sender', 'is_internal', 'created_at')
    list_filter = ('is_internal', 'created_at')
    search_fields = ('grievance__grievance_id', 'sender__email', 'content')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

@admin.register(GrievanceDocument)
class GrievanceDocumentAdmin(admin.ModelAdmin):
    list_display = ('grievance', 'file_name', 'uploaded_by', 'uploaded_at')
    list_filter = ('is_public', 'uploaded_at')
    search_fields = ('grievance__grievance_id', 'file_name')
    ordering = ('-uploaded_at',)
    readonly_fields = ('uploaded_at',)
