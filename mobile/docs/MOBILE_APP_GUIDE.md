# IDRA Grievance Management System - Mobile App Development Guide

## Overview
The IDRA GMS backend provides a complete REST API for mobile app development. The system supports both web interface and mobile API access with the same data and functionality.

## API Base URL
```
Production: https://your-replit-domain.replit.app
Development: http://localhost:5000
```

## Authentication

### Login
```http
POST /api/accounts/login/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
            "role": "policyholder",
            "phone": "+880123456789",
            "company": null
        }
    },
    "message": "Login successful"
}
```

### Registration
```http
POST /api/accounts/register/
Content-Type: application/json

{
    "email": "newuser@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "policyholder",
    "phone": "+880123456789"
}
```

## Insurance Companies

### List Companies
```http
GET /api/companies/
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "Dhaka Insurance Limited",
        "license_number": "DIN-001",
        "email": "info@dhakainsurance.com",
        "phone": "+880-2-123456789",
        "website": "https://dhakainsurance.com",
        "established_year": 1985,
        "is_active": true
    }
]
```

### Company Details
```http
GET /api/companies/1/
```

## Grievances

### List User Grievances
```http
GET /api/grievances/
Authorization: Session or Token
```

**Response:**
```json
[
    {
        "id": 1,
        "grievance_id": "GRV-2025-00001",
        "title": "Claim Settlement Delay",
        "description": "My motor insurance claim has been pending...",
        "status": "open",
        "priority": "high",
        "submitted_by": {
            "name": "John Doe",
            "email": "john@example.com"
        },
        "insurance_company": {
            "name": "Dhaka Insurance Limited"
        },
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T14:20:00Z"
    }
]
```

### Create Grievance
```http
POST /api/grievances/
Content-Type: application/json
Authorization: Session or Token

{
    "title": "Premium Calculation Error",
    "description": "There seems to be an error in my premium calculation...",
    "category": "premium",
    "insurance_company_id": 1,
    "policy_number": "POL-123456789",
    "priority": "medium"
}
```

### Track Grievance
```http
GET /api/grievances/track/GRV-2025-00001/
```

**Response:**
```json
{
    "grievance": {
        "grievance_id": "GRV-2025-00001",
        "title": "Claim Settlement Delay",
        "status": "in_progress",
        "priority": "high",
        "submitted_date": "2025-01-15",
        "last_updated": "2025-01-16"
    },
    "messages": [
        {
            "id": 1,
            "content": "Your grievance has been received and assigned to our team.",
            "sender": "IDRA Administrator",
            "timestamp": "2025-01-15T15:30:00Z",
            "is_internal": false
        }
    ]
}
```

## Mobile App Development Steps

### 1. Setup Development Environment
```bash
# For React Native
npx react-native init IDRAGrievanceApp
cd IDRAGrievanceApp

# Install dependencies
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @react-navigation/native
npm install axios
```

### 2. API Service Layer
Create `src/services/api.js`:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const sessionId = await AsyncStorage.getItem('sessionId');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `sessionid=${sessionId}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    return response.json();
  }

  // Authentication
  login(email, password) {
    return this.request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(userData) {
    return this.request('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Grievances
  getGrievances() {
    return this.request('/grievances/');
  }

  createGrievance(grievanceData) {
    return this.request('/grievances/', {
      method: 'POST',
      body: JSON.stringify(grievanceData),
    });
  }

  trackGrievance(trackingId) {
    return this.request(`/grievances/track/${trackingId}/`);
  }

  // Companies
  getCompanies() {
    return this.request('/companies/');
  }
}

export default new ApiService();
```

### 3. Key Mobile Features to Implement

#### Core Screens:
1. **Login/Registration** - User authentication
2. **Dashboard** - Overview of user's grievances
3. **File Grievance** - Form to submit new complaints
4. **Track Grievance** - Search and track by grievance ID
5. **Company Directory** - List of insurance companies
6. **Profile** - User profile management

#### Key Mobile Features:
- **Push Notifications** - Updates on grievance status
- **Offline Support** - Cache data for offline viewing
- **Document Upload** - Camera integration for evidence
- **Biometric Login** - Fingerprint/Face ID authentication
- **Multi-language Support** - Bengali and English

### 4. Sample Screen Implementation

**Login Screen (React Native)**:
```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import ApiService from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await ApiService.login(email, password);
      if (response.success) {
        // Store user data and navigate to dashboard
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDRA Grievance Management</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Testing the API

### Demo Accounts for Mobile Testing:
```
Policyholder: alice@example.com / demo123
Insurance Company: bob@dhakainsurance.com / demo123
IDRA Admin: david@idra.gov.bd / demo123
```

### API Testing with Postman or curl:
```bash
# Test login
curl -X POST http://localhost:5000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "demo123"}'

# Test grievance list (after login)
curl -X GET http://localhost:5000/api/grievances/ \
  -H "Cookie: sessionid=your_session_id"
```

## Deployment Considerations

1. **API Security**: Implement token-based authentication
2. **Rate Limiting**: Add API rate limiting for mobile clients
3. **Push Notifications**: Integrate Firebase or similar service
4. **App Store**: Prepare for iOS App Store and Google Play Store
5. **Analytics**: Implement crash reporting and user analytics

## Next Steps for Mobile Development

1. **Phase 1**: Basic authentication and grievance viewing
2. **Phase 2**: Grievance creation and tracking
3. **Phase 3**: Push notifications and offline support
4. **Phase 4**: Advanced features like document upload and biometrics

The API is fully functional and ready for mobile app development. All endpoints are tested and working with the existing web application data.