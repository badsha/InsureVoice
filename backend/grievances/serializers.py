from rest_framework import serializers
from .models import Grievance, GrievanceMessage, GrievanceDocument
from companies.serializers import InsuranceCompanySerializer
from accounts.serializers import UserSerializer

class GrievanceSerializer(serializers.ModelSerializer):
    """Serializer for grievances"""
    insurance_company = InsuranceCompanySerializer(read_only=True)
    insurance_company_id = serializers.IntegerField(write_only=True)
    submitted_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = Grievance
        fields = [
            'id', 'grievance_id', 'title', 'description', 'category',
            'complainant_name', 'complainant_email', 'complainant_phone',
            'policy_number', 'insurance_company', 'insurance_company_id',
            'submitted_by', 'assigned_to', 'status', 'priority',
            'submitted_at', 'sla_deadline', 'resolved_at',
            'claim_amount', 'settlement_amount', 'is_public'
        ]
        read_only_fields = ['id', 'grievance_id', 'submitted_at']

class GrievanceMessageSerializer(serializers.ModelSerializer):
    """Serializer for grievance messages"""
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = GrievanceMessage
        fields = ['id', 'grievance', 'sender', 'content', 'is_internal', 'created_at']
        read_only_fields = ['id', 'created_at']

class GrievanceDocumentSerializer(serializers.ModelSerializer):
    """Serializer for grievance documents"""
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = GrievanceDocument
        fields = [
            'id', 'grievance', 'uploaded_by', 'file_name', 'file_path',
            'file_size', 'content_type', 'description', 'is_public', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']