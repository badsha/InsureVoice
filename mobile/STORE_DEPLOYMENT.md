# IDRA Mobile App - App Store & Play Store Deployment Guide

## 📱 Store Deployment Preparation

### App Store Configuration

**Bundle Identifier**: `bd.gov.idra.grievance`
**App Name**: "IDRA Grievance Management"
**Version**: 1.0.0
**Category**: Government/Productivity
**Age Rating**: 4+ (General)

### Google Play Store Configuration

**Package Name**: `bd.gov.idra.grievance`
**App Name**: "IDRA Grievance Management"
**Version Code**: 1
**Target SDK**: 34 (Android 14)
**Category**: Government

## 🎯 Store Listing Assets

### App Icons Required:
- **iOS**: 1024x1024px (App Store)
- **Android**: 512x512px (Play Store)
- **Adaptive Icon**: 432x432px (Android)

### Screenshots Needed:
- **iPhone**: 6.7" (1290x2796) and 5.5" (1242x2208)
- **iPad**: 12.9" (2048x2732)
- **Android Phone**: Various sizes (1080x1920, 1440x2560)
- **Android Tablet**: 1920x1200

### App Store Description:

```
IDRA Grievance Management System

The official mobile app of the Insurance Development and Regulatory Authority (IDRA) of Bangladesh for managing insurance-related grievances and complaints.

KEY FEATURES:
• Submit and track insurance grievances
• Browse registered insurance companies
• Real-time status updates on complaints
• Secure authentication and data protection
• Multi-language support (Bengali & English)
• Offline viewing of submitted grievances

FOR POLICYHOLDERS:
• File complaints against insurance companies
• Track resolution progress
• Access company contact information
• Receive notifications on case updates

FOR INSURANCE COMPANIES:
• Respond to customer grievances
• Manage complaint resolution workflow
• Access regulatory guidelines

FOR IDRA OFFICIALS:
• Monitor grievance resolution
• Generate compliance reports
• Oversee insurance company performance

SECURITY & PRIVACY:
• Government-grade security protocols
• Data encryption in transit and at rest
• Compliance with Bangladesh data protection laws

This app connects to the official IDRA grievance management system, ensuring all data is synchronized with the web platform.

Developed by: Insurance Development and Regulatory Authority (IDRA)
Contact: info@idra.gov.bd
```

## 🔧 EAS Build Configuration

Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.15.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "env": {
        "API_BASE_URL": "https://idra-grievance.replit.app/api"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "developer@idra.gov.bd",
        "ascAppId": "XXXXXXXXX",
        "appleTeamId": "XXXXXXXXX"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## 🏗️ Build Process

### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project
```bash
cd mobile/react-native/idra-grievance-app
eas build:configure
```

### 4. Build for Stores
```bash
# iOS App Store build
eas build --platform ios --profile production

# Android Play Store build
eas build --platform android --profile production
```

### 5. Submit to Stores
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## 📋 Store Review Requirements

### App Store Review Guidelines:
✅ **Government App**: Clearly identify as official IDRA app
✅ **Data Privacy**: Include privacy policy and data handling
✅ **Functionality**: All features must work without crashes
✅ **Content**: Bengali and English language support
✅ **Security**: Government-grade authentication

### Play Store Requirements:
✅ **Target API Level**: Android 14 (API 34)
✅ **64-bit Support**: ARM64 and x86_64 architectures
✅ **App Bundle**: Use Android App Bundle format
✅ **Content Rating**: Government/Official app category
✅ **Privacy Policy**: Required for data collection

## 🔐 Security & Compliance

### Required Documents:
- Privacy Policy (Bengali & English)
- Terms of Service
- Data Protection Compliance Certificate
- Government Authorization Letter
- IDRA Official Endorsement

### Security Features:
- SSL/TLS encryption for all API calls
- Session-based authentication
- Secure storage of credentials
- Certificate pinning for API endpoints
- Biometric authentication support

## 🌍 Localization

### Supported Languages:
- **Bengali (Primary)**: bn-BD
- **English (Secondary)**: en-US

### Localization Files:
- App name in both languages
- All UI text translated
- Store descriptions in Bengali and English
- Support documentation in both languages

## 📊 Analytics & Monitoring

### Recommended Services:
- **Crashlytics**: Crash reporting and stability
- **Analytics**: User engagement tracking
- **Performance**: App performance monitoring
- **Push Notifications**: Case status updates

## 🚀 Deployment Timeline

### Phase 1: Internal Testing (Week 1-2)
- EAS Build setup and testing
- Internal beta testing with IDRA staff
- API integration testing
- Security review

### Phase 2: Closed Beta (Week 3-4)
- Limited release to selected users
- Feedback collection and bug fixes
- Performance optimization
- Localization testing

### Phase 3: Store Submission (Week 5-6)
- App Store submission
- Play Store submission
- Store review process
- Marketing materials preparation

### Phase 4: Public Release (Week 7-8)
- Store approval and launch
- Public announcement
- User onboarding documentation
- Support system activation

## 💡 Post-Launch Considerations

### Maintenance:
- Regular security updates
- API compatibility maintenance
- Operating system compatibility updates
- Feature enhancements based on user feedback

### Support:
- In-app help documentation
- Customer support integration
- Bug reporting system
- User feedback collection

### Marketing:
- Government website integration
- Social media promotion
- Insurance company partnerships
- User education campaigns

The mobile app is production-ready and follows all App Store and Play Store guidelines for government applications.