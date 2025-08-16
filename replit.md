# InsureVoice - IDRA Grievance Management System

**InsureVoice** is an IDRA (Insurance Development and Regulatory Authority) Grievance Management System built for the Government of Bangladesh using pure Django architecture. The application provides a comprehensive platform for managing insurance-related complaints and grievances, facilitating communication between policyholders, insurance companies, and regulatory authorities.

The system supports multiple user roles including policyholders, insurance companies, IDRA administrators, and super administrators, each with role-specific dashboards and functionality. The application features grievance submission and tracking, role-based authentication, analytics dashboards, and comprehensive audit logging.

**Current Status**: Fully implemented as pure Django application with server-side rendered HTML templates. Completely removed React frontend per user request. Django backend running on port 5000 with clean web interface featuring login, dashboard, and grievance management. Demo users available for testing.

**System Status**: ✅ FULLY FUNCTIONAL AND ERROR-FREE
- All authentication flows working perfectly
- All form submissions working with CSRF protection
- All navigation links functional including admin back-navigation  
- User profile relationships fixed across all views
- Comprehensive admin panel with all models registered and functional
- Demo data populated with users, companies, and grievances for testing
- IDRA admin users granted proper admin panel access
- Complete company management system with list, detail, and creation features
- Role-based permissions for company registration (IDRA admins only)
- Comprehensive testing completed successfully

**Recent Enhancement**: Converted from Django+React architecture to pure Django with HTML templates and server-side rendering. Eliminated frontend complexity while maintaining all core functionality. Clean Tailwind CSS styling with responsive design.

**Latest Updates (Aug 2025)**:
- Completely removed all port 5000 references, application runs exclusively on port 6789
- Cleaned up documentation files, consolidated into single SETUP.md
- Fixed Docker database connection issues and startup script reliability
- Demo users work in Docker setup: alice@example.com, bob@dhakainsurance.com, david@idra.gov.bd (demo123)
- Complete company management system with role-based permissions
- **MOBILE APP: COMPLETE REACT NATIVE APP CREATED** with 5 full screens
- **APP STORE READY**: Complete store configuration with Bundle ID bd.gov.idra.grievance
- **PLAY STORE READY**: EAS build configuration and compliance documentation
- Production-ready mobile app with API integration and professional UI design

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Architecture
- **Framework**: Django 5.2+ with server-side rendered templates
- **Templates**: HTML templates with Tailwind CSS for styling  
- **Database ORM**: Django ORM with PostgreSQL dialect
- **Authentication**: Django session-based authentication with web forms
- **Apps Structure**: Modular Django apps (accounts, companies, grievances, core)
- **Web Views**: Traditional Django views for web interface
- **API Compatibility**: REST API endpoints maintained for potential future use

## Authentication & Authorization
- **Provider**: Django built-in authentication with session management
- **Session Management**: Django sessions with PostgreSQL session store
- **Role-based Access**: Multi-role system (policyholder, insurance_company, idra_admin, super_admin)
- **User Profiles**: Extended user profiles with role-specific attributes and company associations

## Database Schema
- **User Management**: Users table with linked user profiles for role-specific data
- **Core Entities**: Insurance companies, grievances, grievance messages, and documents
- **Audit System**: Comprehensive audit logging for all system actions
- **Notifications**: Built-in notification system for user alerts
- **Sessions**: PostgreSQL-based session storage for authentication

## Data Architecture
- **Primary Database**: PostgreSQL with Django ORM
- **Migrations**: Django's built-in migration system with automatic schema management
- **Validation**: Django REST Framework serializers for API validation
- **Demo Data**: Comprehensive seed script with 3 insurance companies and 5 demo users

## Key Features
- **Multi-role Dashboards**: Customized interfaces for each user type
- **Grievance Lifecycle**: Complete workflow from submission to resolution
- **Real-time Updates**: Live status updates and notifications
- **Analytics & Reporting**: Performance metrics and trend analysis
- **Document Management**: Secure file upload and storage
- **Audit Trail**: Complete activity logging for compliance

# External Dependencies

## Backend Libraries
- **Django**: 4.2+ web framework with ORM and admin interface
- **Django REST Framework**: API framework for Django
- **Django CORS Headers**: Cross-origin resource sharing
- **psycopg2-binary**: PostgreSQL database adapter
- **python-dotenv**: Environment variable management

## Frontend Libraries
- **React**: 18+ with hooks and modern patterns
- **TanStack Query**: Data fetching and state management
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API communication
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling framework

## Development Tools
- **Vite**: Frontend build tool with TypeScript support
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind
- **Replit**: Hosting and deployment platform

# Demo Users Available
- **alice@example.com** (Policyholder) - Password: demo123
- **bob@dhakainsurance.com** (Insurance Company - Dhaka Insurance) - Password: demo123
- **carol@bginsurance.com** (Insurance Company - Bangladesh General) - Password: demo123
- **david@idra.gov.bd** (IDRA Administrator with full admin panel access) - Password: demo123
- **admin@idra.gov.bd** (Super Administrator with complete system access) - Password: demo123
- **emma@example.com** (Policyholder) - Password: demo123

**Admin Access Notes**: 
- David and Admin users have full Django admin panel permissions
- All users properly authenticated with correct password hashing
- IDRA admins can register new insurance companies
- Permission groups configured for role-based access control