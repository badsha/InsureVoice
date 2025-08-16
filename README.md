# InsureVoice - IDRA Grievance Management System

[![License](https://img.shields.io/badge/License-Government-blue.svg)](LICENSE)
[![Django](https://img.shields.io/badge/Django-5.2+-green.svg)](https://djangoproject.com/)
[![React Native](https://img.shields.io/badge/React_Native-Latest-blue.svg)](https://reactnative.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen.svg)](https://docker.com/)

**InsureVoice** - The official Grievance Management System for the Insurance Development and Regulatory Authority (IDRA) of Bangladesh. A comprehensive platform for managing insurance-related complaints and facilitating communication between policyholders, insurance companies, and regulatory authorities.

## 🏛️ Government Project

This system is developed for the **Insurance Development and Regulatory Authority (IDRA)**, Government of Bangladesh, to digitize and streamline the insurance grievance resolution process.

## 📱 Multi-Platform Support

- **Web Application**: Django-based responsive web interface
- **Mobile App**: React Native mobile application for iOS and Android
- **Admin Panel**: Comprehensive administrative dashboard
- **REST API**: Complete API for third-party integrations

## ✨ Key Features

### For Policyholders
- Submit insurance grievances with supporting documents
- Real-time tracking of complaint status
- Direct communication with insurance companies
- Access to insurance company directory
- Multi-language support (Bengali & English)

### For Insurance Companies
- Receive and respond to customer complaints
- Manage grievance resolution workflows
- Access regulatory guidelines and updates
- Performance analytics and reporting

### For IDRA Officials
- Monitor grievance resolution processes
- Generate compliance and statistical reports
- Oversight of insurance company performance
- Administrative controls and user management

### System Features
- **Multi-role Authentication**: Policyholders, Insurance Companies, IDRA Admins, Super Admins
- **Real-time Notifications**: Email and in-app notifications
- **Document Management**: Secure file upload and storage
- **Audit Trail**: Comprehensive activity logging
- **Analytics Dashboard**: Performance metrics and trends
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/badsha/InsureVoice.git
cd InsureVoice

# Start all services
docker-compose up -d

# Access the application
# Web: http://localhost:5000
# Mobile: http://localhost:8081
# Admin: http://localhost:5000/admin
```

### Manual Setup

```bash
# Backend setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_data
python manage.py runserver 0.0.0.0:5000

# Mobile app setup (in new terminal)
cd mobile/react-native/idra-grievance-app
npm install
npx expo start
```

## 📱 Mobile App

### Features
- Native iOS and Android applications
- Offline support for submitted grievances
- Push notifications for case updates
- Biometric authentication support
- Camera integration for document capture

### App Store Information
- **Bundle ID**: bd.gov.idra.grievance
- **App Name**: InsureVoice - IDRA Grievance Management
- **Category**: Government/Productivity
- **Target Platforms**: iOS 13+, Android 8+

### Testing
```bash
# Web preview
cd mobile/react-native/idra-grievance-app
npx expo start --web

# Mobile testing with Expo Go
npx expo start
# Scan QR code with Expo Go app
```

## 🏗️ Architecture

### Backend Stack
- **Framework**: Django 5.2+ with Django REST Framework
- **Database**: PostgreSQL with optimized schemas
- **Authentication**: Session-based with role-based permissions
- **API**: RESTful APIs with comprehensive documentation
- **Security**: CSRF protection, CORS configuration, data encryption

### Frontend Stack
- **Web**: Server-side rendered Django templates with Tailwind CSS
- **Mobile**: React Native with Expo for cross-platform development
- **Navigation**: React Navigation for mobile app routing
- **State Management**: React hooks and context API
- **HTTP Client**: Axios for API communication

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Web Server**: Nginx with SSL termination
- **Caching**: Redis for session storage and caching
- **Monitoring**: Health checks and logging
- **Deployment**: Production-ready configurations for cloud platforms

## 🗄️ Database Schema

### Core Models
- **Users & Profiles**: Multi-role user system with extended profiles
- **Insurance Companies**: Company registration and management
- **Grievances**: Complete grievance lifecycle management
- **Messages**: Communication threads between parties
- **Documents**: Secure file storage and retrieval
- **Audit Logs**: Comprehensive activity tracking
- **Notifications**: User notification system

## 🔐 Security Features

- Government-grade security protocols
- Data encryption in transit and at rest
- Role-based access control (RBAC)
- Session management with secure cookies
- CSRF and XSS protection
- Rate limiting on API endpoints
- Audit logging for compliance
- Secure file upload with validation

## 🌍 Localization

- **Primary Language**: Bengali (bn-BD)
- **Secondary Language**: English (en-US)
- **RTL Support**: Future-ready for Arabic/Urdu
- **Date Formats**: Localized date and time formats
- **Number Formats**: Bengali and English numeral support

## 📊 Demo Data

The system comes with comprehensive demo data for testing:

### Demo Users
- **alice@example.com** (Policyholder) - Password: demo123
- **bob@dhakainsurance.com** (Insurance Company) - Password: demo123
- **david@idra.gov.bd** (IDRA Administrator) - Password: demo123
- **admin@idra.gov.bd** (Super Admin) - Password: admin123

### Demo Data Includes
- 6 users across all roles
- 3 registered insurance companies
- 6 sample grievances with complete workflows
- Message threads and document attachments
- Administrative configurations

## 🚢 Deployment Options

### Cloud Platforms
- **AWS**: ECS, Fargate, or EC2 deployment
- **Google Cloud**: Cloud Run or Compute Engine
- **Microsoft Azure**: Container Instances or App Service
- **Digital Ocean**: App Platform or Droplets

### Container Orchestration
- **Docker Compose**: Development and small-scale production
- **Kubernetes**: Large-scale production deployment
- **Docker Swarm**: Simplified container orchestration

### Traditional Hosting
- **VPS Deployment**: Ubuntu/CentOS with systemd services
- **Shared Hosting**: cPanel/Plesk compatible
- **Government Cloud**: Specialized government cloud platforms

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Mobile App Testing
```bash
cd mobile/react-native/idra-grievance-app
npm test
```

### API Testing
```bash
# Test API endpoints
curl -X POST http://localhost:5000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"demo123"}'
```

## 📈 Performance

- **Response Time**: < 200ms for most API endpoints
- **Database**: Optimized queries with proper indexing
- **Caching**: Redis caching for frequently accessed data
- **CDN Ready**: Static file optimization for CDN deployment
- **Mobile Performance**: 60fps animations and smooth scrolling

## 🔄 API Documentation

Complete API documentation is available at:
- **Development**: http://localhost:5000/api/docs/
- **Interactive API**: http://localhost:5000/api/swagger/
- **OpenAPI Schema**: http://localhost:5000/api/schema/

### Key Endpoints
- `POST /api/accounts/login/` - User authentication
- `GET /api/grievances/` - List user grievances
- `POST /api/grievances/` - Submit new grievance
- `GET /api/companies/` - List insurance companies
- `GET /api/grievances/track/{id}/` - Track grievance status

## 🤝 Contributing

This is a government project with specific contribution guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow Django coding standards
- Write comprehensive tests
- Update documentation
- Ensure security compliance
- Test on both web and mobile platforms

## 📄 License

This project is proprietary software developed for the Government of Bangladesh. All rights reserved by the Insurance Development and Regulatory Authority (IDRA).

## 📞 Support

### Technical Support
- **Email**: tech@idra.gov.bd
- **Phone**: +880-2-XXXXXXX
- **Office Hours**: Sunday-Thursday, 9:00 AM - 5:00 PM (Bangladesh Time)

### Bug Reports
- **GitHub Issues**: For technical issues and feature requests
- **Email**: bugs@idra.gov.bd
- **Emergency**: urgent@idra.gov.bd

### General Inquiries
- **Website**: https://idra.gov.bd
- **Email**: info@idra.gov.bd
- **Address**: IDRA Bhaban, Motijheel, Dhaka-1000, Bangladesh

## 🏆 Acknowledgments

- **IDRA Leadership**: For project vision and requirements
- **Development Team**: For technical implementation
- **Insurance Industry**: For feedback and testing
- **Citizens of Bangladesh**: For using and improving the system

---

**Developed with ❤️ for the people of Bangladesh**

*This system supports the digital transformation of Bangladesh's insurance sector and contributes to the "Digital Bangladesh" initiative.*