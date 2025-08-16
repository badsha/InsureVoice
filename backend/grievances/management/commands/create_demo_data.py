from django.core.management.base import BaseCommand
from accounts.models import User, UserProfile
from companies.models import InsuranceCompany
from grievances.models import Grievance, GrievanceMessage
from django.utils import timezone
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Create demo data for IDRA Grievance Management System'

    def add_arguments(self, parser):
        parser.add_argument('--noinput', action='store_true', help='Skip user interaction')

    def handle(self, *args, **options):
        # Check if demo data already exists (check for actual demo users, not admin)
        demo_users_exist = (
            User.objects.filter(email='alice@example.com').exists() and
            User.objects.filter(email='bob@dhakainsurance.com').exists() and
            User.objects.filter(email='david@idra.gov.bd').exists()
        )
        
        if demo_users_exist:
            self.stdout.write('Demo users already exist, skipping creation.')
            return
            
        self.stdout.write('Creating demo data for IDRA GMS...')

        # Create companies
        companies_data = [
            {
                'name': 'Dhaka Insurance Limited',
                'email': 'contact@dhakainsurance.com', 
                'phone': '+8801711111111',
                'license_number': 'LIC-001-2020',
                'established_year': 1985,
                'address': 'Dhaka, Bangladesh',
                'registration_date': datetime(2020, 1, 15).date(),
                'license_expiry_date': datetime(2025, 1, 15).date(),
                'authorized_capital': 500000000,
                'paid_up_capital': 300000000
            },
            {
                'name': 'Bangladesh General Insurance Company',
                'email': 'info@bginsurance.com', 
                'phone': '+8801722222222',
                'license_number': 'LIC-002-2020',
                'established_year': 1990,
                'address': 'Chittagong, Bangladesh',
                'registration_date': datetime(2020, 2, 20).date(),
                'license_expiry_date': datetime(2025, 2, 20).date(),
                'authorized_capital': 400000000,
                'paid_up_capital': 250000000
            },
            {
                'name': 'United Insurance Company Ltd',
                'email': 'support@unitedinsurance.com', 
                'phone': '+8801733333333',
                'license_number': 'LIC-003-2020',
                'established_year': 1995,
                'address': 'Sylhet, Bangladesh',
                'registration_date': datetime(2020, 3, 25).date(),
                'license_expiry_date': datetime(2025, 3, 25).date(),
                'authorized_capital': 350000000,
                'paid_up_capital': 200000000
            }
        ]

        companies = []
        for company_data in companies_data:
            company, created = InsuranceCompany.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            companies.append(company)
            if created:
                self.stdout.write(f'Created company: {company.name}')

        # Create admin user
        admin_user, created = User.objects.get_or_create(
            email='admin@idra.gov.bd',
            defaults={
                'username': 'admin_idra',
                'first_name': 'Admin', 
                'last_name': 'User', 
                'is_staff': True, 
                'is_superuser': True,
                'phone': '+8801700000000'
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user')

        # Create admin profile
        admin_profile, created = UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={'role': 'super_admin'}
        )

        # Create demo users
        demo_users_data = [
            {'email': 'alice@example.com', 'username': 'alice_johnson', 'first_name': 'Alice', 'last_name': 'Johnson', 'role': 'policyholder'},
            {'email': 'bob@dhakainsurance.com', 'username': 'bob_smith', 'first_name': 'Bob', 'last_name': 'Smith', 'role': 'insurance_company', 'company': companies[0]},
            {'email': 'carol@bginsurance.com', 'username': 'carol_brown', 'first_name': 'Carol', 'last_name': 'Brown', 'role': 'insurance_company', 'company': companies[1]},
            {'email': 'david@idra.gov.bd', 'username': 'david_wilson', 'first_name': 'David', 'last_name': 'Wilson', 'role': 'idra_admin'},
            {'email': 'emma@example.com', 'username': 'emma_davis', 'first_name': 'Emma', 'last_name': 'Davis', 'role': 'policyholder'}
        ]

        users = []
        for user_data in demo_users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'phone': f'+88017{random.randint(10000000, 99999999)}'
                }
            )
            if created:
                user.set_password('demo123')
                if user_data['role'] == 'idra_admin':
                    user.is_staff = True
                user.save()
                self.stdout.write(f'Created user: {user.email}')

            # Create user profile
            profile_data = {
                'role': user_data['role']
            }
            if 'company' in user_data:
                profile_data['company'] = user_data['company']

            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults=profile_data
            )
            users.append(user)

        # Create demo grievances
        grievances_data = [
            {
                'title': 'Claim Settlement Delay',
                'description': 'My motor insurance claim has been pending for over 3 months without any update.',
                'category': 'claim_settlement',
                'complainant_name': 'Alice Johnson',
                'complainant_email': 'alice@example.com',
                'complainant_phone': '+8801711111111',
                'policy_number': 'POL-2024-001',
                'submitted_by': users[0],  # Alice
                'insurance_company': companies[0],
                'claim_amount': 150000
            },
            {
                'title': 'Premium Calculation Error',
                'description': 'The premium calculated for my health insurance seems incorrect based on my age group.',
                'category': 'premium_issues',
                'complainant_name': 'Emma Davis',
                'complainant_email': 'emma@example.com',
                'complainant_phone': '+8801722222222',
                'policy_number': 'POL-2024-002',
                'submitted_by': users[4],  # Emma
                'insurance_company': companies[1],
                'claim_amount': 75000
            },
            {
                'title': 'Policy Cancellation Issue',
                'description': 'Unable to cancel my policy despite multiple requests and proper documentation.',
                'category': 'policy_terms',
                'complainant_name': 'Alice Johnson',
                'complainant_email': 'alice@example.com',
                'complainant_phone': '+8801733333333',
                'policy_number': 'POL-2024-003',
                'submitted_by': users[0],  # Alice
                'insurance_company': companies[2],
                'claim_amount': 100000
            }
        ]

        for grievance_data in grievances_data:
            # Calculate SLA deadline (30 days from now)
            sla_deadline = timezone.now() + timedelta(days=30)
            
            grievance, created = Grievance.objects.get_or_create(
                title=grievance_data['title'],
                defaults={
                    'description': grievance_data['description'],
                    'category': grievance_data['category'],
                    'complainant_name': grievance_data['complainant_name'],
                    'complainant_email': grievance_data['complainant_email'],
                    'complainant_phone': grievance_data['complainant_phone'],
                    'policy_number': grievance_data['policy_number'],
                    'submitted_by': grievance_data['submitted_by'],
                    'insurance_company': grievance_data['insurance_company'],
                    'claim_amount': grievance_data['claim_amount'],
                    'sla_deadline': sla_deadline,
                    'status': random.choice(['open', 'under_review', 'pending_response'])
                }
            )
            if created:
                self.stdout.write(f'Created grievance: {grievance.title}')

                # Add some messages to each grievance
                GrievanceMessage.objects.create(
                    grievance=grievance,
                    sender=grievance.submitted_by,
                    content=f"Initial complaint: {grievance.description}"
                )

        self.stdout.write(self.style.SUCCESS('Demo data created successfully!'))
        self.stdout.write('\nDemo Login Credentials:')
        self.stdout.write('- Admin: admin@idra.gov.bd / admin123')
        self.stdout.write('- Alice (Policyholder): alice@example.com / demo123')
        self.stdout.write('- Bob (Insurance Company): bob@dhakainsurance.com / demo123')
        self.stdout.write('- Carol (Insurance Company): carol@bginsurance.com / demo123')
        self.stdout.write('- David (IDRA Admin): david@idra.gov.bd / demo123')
        self.stdout.write('- Emma (Policyholder): emma@example.com / demo123')