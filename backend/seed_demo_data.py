#!/usr/bin/env python
"""
Django demo data seeding script for IDRA Grievance Management System
"""
import os
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'idra_gms.settings')
django.setup()

from accounts.models import User, UserProfile
from companies.models import InsuranceCompany
from grievances.models import Grievance

def seed_demo_data():
    print("🌱 Seeding demo data...")
    
    # Create Insurance Companies
    companies_data = [
        {
            'name': 'Dhaka Insurance Limited',
            'license_number': 'DIN-001',
            'established_year': 1985,
            'address': 'Motijheel Commercial Area, Dhaka-1000',
            'phone': '+880-2-9560560',
            'email': 'info@dhakainsurance.com',
            'website': 'https://dhakainsurance.com',
            'registration_date': datetime(1985, 3, 15).date(),
            'license_expiry_date': datetime(2025, 12, 31).date(),
            'authorized_capital': 1000000000.00,
            'paid_up_capital': 500000000.00,
        },
        {
            'name': 'Bangladesh General Insurance',
            'license_number': 'BGI-002',
            'established_year': 1973,
            'address': 'Gulshan Avenue, Dhaka-1212',
            'phone': '+880-2-8851234',
            'email': 'contact@bginsurance.com',
            'website': 'https://bginsurance.com',
            'registration_date': datetime(1973, 8, 20).date(),
            'license_expiry_date': datetime(2025, 12, 31).date(),
            'authorized_capital': 800000000.00,
            'paid_up_capital': 400000000.00,
        },
        {
            'name': 'United Insurance Company',
            'license_number': 'UIC-003',
            'established_year': 1990,
            'address': 'Dhanmondi, Dhaka-1205',
            'phone': '+880-2-9661234',
            'email': 'info@unitedinsurance.bd',
            'website': 'https://unitedinsurance.bd',
            'registration_date': datetime(1990, 5, 10).date(),
            'license_expiry_date': datetime(2025, 12, 31).date(),
            'authorized_capital': 600000000.00,
            'paid_up_capital': 300000000.00,
        }
    ]
    
    companies = []
    for company_data in companies_data:
        company, created = InsuranceCompany.objects.get_or_create(
            license_number=company_data['license_number'],
            defaults=company_data
        )
        companies.append(company)
        if created:
            print(f"✓ Created insurance company: {company.name}")
    
    # Create Demo Users
    users_data = [
        {
            'email': 'alice@example.com',
            'first_name': 'Alice',
            'last_name': 'Rahman',
            'phone': '+880-1711-123456',
            'profile': {
                'role': 'policyholder',
                'national_id': '1234567890123',
                'address': 'House 15, Road 7, Dhanmondi, Dhaka'
            }
        },
        {
            'email': 'bob@dhakainsurance.com',
            'first_name': 'Bob',
            'last_name': 'Ahmed',
            'phone': '+880-1711-234567',
            'profile': {
                'role': 'insurance_company',
                'company': companies[0],  # Dhaka Insurance
                'designation': 'Claims Manager',
                'employee_id': 'EMP-001'
            }
        },
        {
            'email': 'carol@bginsurance.com',
            'first_name': 'Carol',
            'last_name': 'Khan',
            'phone': '+880-1711-345678',
            'profile': {
                'role': 'insurance_company',
                'company': companies[1],  # Bangladesh General Insurance
                'designation': 'Customer Relations Manager',
                'employee_id': 'EMP-002'
            }
        },
        {
            'email': 'david@idra.gov.bd',
            'first_name': 'David',
            'last_name': 'Hassan',
            'phone': '+880-1711-456789',
            'profile': {
                'role': 'idra_admin',
                'designation': 'Senior Regulatory Officer',
                'employee_id': 'IDRA-001'
            }
        },
        {
            'email': 'emma@example.com',
            'first_name': 'Emma',
            'last_name': 'Begum',
            'phone': '+880-1711-567890',
            'profile': {
                'role': 'policyholder',
                'national_id': '9876543210987',
                'address': 'Flat 3B, Building 25, Uttara, Dhaka'
            }
        }
    ]
    
    for user_data in users_data:
        profile_data = user_data.pop('profile')
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={**user_data, 'username': user_data['email']}
        )
        
        if created:
            user.set_password('demo123')  # Demo password
            user.save()
            print(f"✓ Created user: {user.get_full_name()}")
        
        # Create or update profile
        profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults=profile_data
        )
        if profile_created:
            print(f"  ✓ Created profile for {user.get_full_name()}")
    
    # Create Sample Grievances
    grievances_data = [
        {
            'title': 'Claim Settlement Delay for Motor Insurance',
            'description': 'My motor insurance claim has been pending for over 45 days without any response from the company.',
            'category': 'claim_settlement',
            'complainant_name': 'Alice Rahman',
            'complainant_email': 'alice@example.com',
            'complainant_phone': '+880-1711-123456',
            'policy_number': 'MOT-2024-001234',
            'insurance_company': companies[0],
            'priority': 'high',
            'claim_amount': 150000.00,
        },
        {
            'title': 'Premium Calculation Discrepancy',
            'description': 'There is a significant discrepancy in my health insurance premium calculation compared to what was initially quoted.',
            'category': 'premium_issues',
            'complainant_name': 'Emma Begum',
            'complainant_email': 'emma@example.com',
            'complainant_phone': '+880-1711-567890',
            'policy_number': 'HLT-2024-005678',
            'insurance_company': companies[1],
            'priority': 'medium',
            'claim_amount': 75000.00,
        },
        {
            'title': 'Agent Misconduct and Misrepresentation',
            'description': 'The insurance agent provided false information about policy coverage and benefits during the sales process.',
            'category': 'agent_conduct',
            'complainant_name': 'Mohammad Karim',
            'complainant_email': 'karim@example.com',
            'complainant_phone': '+880-1711-987654',
            'policy_number': 'LIF-2024-009876',
            'insurance_company': companies[2],
            'priority': 'urgent',
        }
    ]
    
    for grievance_data in grievances_data:
        # Calculate SLA deadline (7 days from now)
        grievance_data['sla_deadline'] = datetime.now() + timedelta(days=7)
        
        grievance = Grievance.objects.create(**grievance_data)
        print(f"✓ Created grievance: {grievance.grievance_id}")
    
    print("✅ Demo data seeding completed successfully!")
    print("\nDemo Users Created:")
    print("- alice@example.com (Policyholder)")
    print("- bob@dhakainsurance.com (Insurance Company - Dhaka Insurance)")
    print("- carol@bginsurance.com (Insurance Company - Bangladesh General)")
    print("- david@idra.gov.bd (IDRA Administrator)")
    print("- emma@example.com (Policyholder)")
    print("\nPassword for all demo users: demo123")

if __name__ == '__main__':
    try:
        seed_demo_data()
    except Exception as e:
        print(f"❌ Error seeding demo data: {e}")
        import traceback
        traceback.print_exc()