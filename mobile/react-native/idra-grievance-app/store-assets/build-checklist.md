# App Store & Play Store Submission Checklist

## 📱 Pre-Submission Requirements

### ✅ App Configuration
- [x] App name: "IDRA Grievance Management"
- [x] Bundle ID (iOS): bd.gov.idra.grievance
- [x] Package name (Android): bd.gov.idra.grievance
- [x] Version: 1.0.0 (Build 1)
- [x] Privacy policy included
- [x] Terms of service ready
- [x] App description prepared
- [x] Keywords for ASO defined

### ✅ Technical Requirements

#### iOS App Store
- [ ] Xcode latest version compatibility
- [ ] iOS 13+ minimum support
- [ ] 64-bit architecture support
- [ ] App Store Connect account setup
- [ ] Apple Developer account verification
- [ ] App Transport Security compliance
- [ ] TestFlight beta testing completed

#### Android Play Store
- [ ] Target SDK 34 (Android 14)
- [ ] 64-bit architecture support
- [ ] App Bundle (.aab) format
- [ ] Play Console account setup
- [ ] Google Developer account verification
- [ ] Play App Signing enabled
- [ ] Internal testing completed

### ✅ Legal & Compliance
- [x] Privacy policy (Bengali & English)
- [ ] Government authorization letter
- [ ] IDRA official endorsement
- [ ] Data protection compliance certificate
- [ ] Terms of service (Bengali & English)
- [ ] Content rating certification
- [ ] Accessibility compliance verification

## 🎨 Store Assets Required

### App Icons
- [ ] iOS: 1024x1024px (high-res PNG)
- [ ] Android: 512x512px (high-res PNG)
- [ ] Adaptive icon: 432x432px (Android)
- [ ] All icons include IDRA logo/branding

### Screenshots (Required Sizes)

#### iOS Screenshots
- [ ] iPhone 6.7": 1290x2796px (5 screenshots)
- [ ] iPhone 5.5": 1242x2208px (5 screenshots) 
- [ ] iPad 12.9": 2048x2732px (5 screenshots)
- [ ] Screenshots with text overlays

#### Android Screenshots
- [ ] Phone: 1080x1920px (8 screenshots)
- [ ] Tablet: 1920x1200px (8 screenshots)
- [ ] Feature graphic: 1024x500px
- [ ] Screenshots with captions

### Marketing Materials
- [ ] App preview video (30 seconds max)
- [ ] Feature graphic for Play Store
- [ ] App Store promotional text
- [ ] Keywords and ASO optimization

## 🔧 Build Process

### EAS Build Setup
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create development build
eas build --platform all --profile development

# Create production builds
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Build Verification
- [ ] App launches successfully
- [ ] All navigation works properly
- [ ] API connections functional
- [ ] Authentication flow working
- [ ] Push notifications setup
- [ ] Offline functionality tested
- [ ] Performance optimization completed
- [ ] Memory leaks checked
- [ ] Battery usage optimized

## 📝 Store Submission Steps

### iOS App Store
1. [ ] Create app in App Store Connect
2. [ ] Upload app binary via EAS Submit
3. [ ] Configure app information and metadata
4. [ ] Add screenshots and marketing materials
5. [ ] Set pricing (free)
6. [ ] Configure in-app purchases (if any)
7. [ ] Submit for review
8. [ ] Respond to review feedback
9. [ ] Release to App Store

### Google Play Store
1. [ ] Create app in Play Console
2. [ ] Upload app bundle via EAS Submit
3. [ ] Configure store listing
4. [ ] Add screenshots and marketing assets
5. [ ] Set up content rating
6. [ ] Configure pricing and distribution
7. [ ] Create release notes
8. [ ] Submit to production track
9. [ ] Respond to review feedback
10. [ ] Publish to Play Store

## 🔍 Testing Checklist

### Functional Testing
- [ ] User registration and login
- [ ] Grievance submission flow
- [ ] Grievance tracking functionality
- [ ] Company directory browsing
- [ ] Push notifications
- [ ] Offline data access
- [ ] Data synchronization
- [ ] Logout and session management

### Platform-Specific Testing
- [ ] iOS device compatibility (iPhone/iPad)
- [ ] Android device compatibility (various manufacturers)
- [ ] Different screen sizes and orientations
- [ ] iOS/Android specific UI guidelines
- [ ] Platform-specific features (Face ID, fingerprint)

### Performance Testing
- [ ] App startup time < 3 seconds
- [ ] API response handling
- [ ] Image loading optimization
- [ ] Memory usage monitoring
- [ ] Battery consumption testing
- [ ] Network connectivity scenarios

## 📊 Post-Submission Monitoring

### Review Process Monitoring
- [ ] App Store review status tracking
- [ ] Play Store review status tracking
- [ ] Response to reviewer questions
- [ ] Resolution of any rejection issues

### Launch Preparation
- [ ] Press release preparation
- [ ] Social media announcements
- [ ] Website updates
- [ ] User documentation
- [ ] Support team training
- [ ] Analytics setup (Firebase/App Center)

### Success Metrics Setup
- [ ] Download tracking
- [ ] User engagement metrics
- [ ] Crash reporting (Crashlytics)
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] App store rating monitoring

## 🚀 Launch Timeline

### Week 1-2: Preparation
- Complete all technical requirements
- Prepare store assets and marketing materials
- Conduct thorough testing
- Obtain necessary approvals

### Week 3-4: Submission
- Submit to both app stores
- Monitor review process
- Address any feedback or issues
- Prepare launch materials

### Week 5-6: Launch
- Apps approved and published
- Execute launch strategy
- Monitor initial user feedback
- Provide user support

### Week 7+: Post-Launch
- Monitor app performance
- Collect user feedback
- Plan future updates
- Analyze success metrics

## 📞 Contact Information

**Technical Support**: tech@idra.gov.bd
**Legal Compliance**: legal@idra.gov.bd  
**Marketing**: marketing@idra.gov.bd
**General**: info@idra.gov.bd

**Emergency Contacts:**
- App Store Review Issues: urgent@idra.gov.bd
- Critical Bug Reports: bugs@idra.gov.bd
- Security Issues: security@idra.gov.bd