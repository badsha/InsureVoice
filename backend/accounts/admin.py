from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone', 'profile_image_url')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'company', 'created_at')
    list_filter = ('role', 'company', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'national_id', 'employee_id')
    raw_id_fields = ('user', 'company')
    
    fieldsets = (
        ('User Information', {'fields': ('user', 'role')}),
        ('Company Details', {'fields': ('company', 'designation', 'employee_id')}),
        ('Personal Details', {'fields': ('national_id', 'address')}),
    )
