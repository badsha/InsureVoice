from rest_framework import serializers
from .models import InsuranceCompany

class InsuranceCompanySerializer(serializers.ModelSerializer):
    """Serializer for insurance companies"""
    total_grievances = serializers.ReadOnlyField()
    pending_grievances = serializers.ReadOnlyField()
    
    class Meta:
        model = InsuranceCompany
        fields = [
            'id', 'name', 'license_number', 'established_year',
            'address', 'phone', 'email', 'website',
            'registration_date', 'license_expiry_date',
            'authorized_capital', 'paid_up_capital',
            'is_active', 'total_grievances', 'pending_grievances'
        ]