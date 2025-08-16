# IDRA Mobile App - Testing Guide

## 🚀 Quick Start Testing

### Option 1: Expo Go App (Easiest - Recommended)

**Step 1: Install Expo Go**
- **iPhone**: Download "Expo Go" from App Store
- **Android**: Download "Expo Go" from Google Play Store

**Step 2: Start the Development Server**
```bash
cd mobile/react-native/idra-grievance-app
npx expo start
```

**Step 3: Scan QR Code**
- A QR code will appear in your terminal
- **iPhone**: Open Camera app and scan the QR code
- **Android**: Open Expo Go app and tap "Scan QR Code"
- The app will load on your phone in 10-20 seconds

### Option 2: Web Browser Testing (Instant)

**Start Web Version:**
```bash
cd mobile/react-native/idra-grievance-app
npx expo start --web
```
- Opens automatically in your browser
- Great for quick UI testing
- All functionality works except camera features

### Option 3: Android/iOS Simulators

**Android Emulator:**
```bash
cd mobile/react-native/idra-grievance-app
npx expo start --android
```

**iOS Simulator (Mac only):**
```bash
cd mobile/react-native/idra-grievance-app
npx expo start --ios
```

## 📱 What to Test

### 1. Login Screen
- **Pre-filled credentials**: alice@example.com / demo123
- Test the "Sign In" button
- Try other demo accounts:
  - david@idra.gov.bd / demo123 (IDRA Admin)
  - bob@dhakainsurance.com / demo123 (Insurance Company)

### 2. Dashboard
- Check user welcome message
- Verify stats cards show correct numbers
- Test navigation to other screens
- Try the logout button

### 3. Grievances Screen
- Browse all grievances
- Check grievance details display
- Verify status and priority colors

### 4. Companies Screen
- Browse insurance company directory
- Check company details and contact info
- Verify all companies load properly

### 5. Track Grievance
- Enter sample grievance IDs:
  - GRV-2025-00001
  - GRV-2025-00002
  - GRV-2025-00003
- Test search functionality
- Verify results display

## 🔗 API Connection Testing

### Make Sure Django Backend is Running
Your Django server should be running on port 5000:
```bash
# Check if server is running
curl http://localhost:5000/api/accounts/login/
```

### Test API Endpoints in Mobile App
The mobile app connects to these endpoints:
- Login: `http://localhost:5000/api/accounts/login/`
- Grievances: `http://localhost:5000/api/grievances/`
- Companies: `http://localhost:5000/api/companies/`
- Track: `http://localhost:5000/api/grievances/track/{id}/`

## 📊 Demo Data Available

### Users (Email / Password)
- **alice@example.com / demo123** - Policyholder
- **bob@dhakainsurance.com / demo123** - Dhaka Insurance
- **carol@bginsurance.com / demo123** - Bangladesh General
- **david@idra.gov.bd / demo123** - IDRA Administrator
- **emma@example.com / demo123** - Policyholder

### Sample Grievance IDs
- GRV-2025-00001
- GRV-2025-00002
- GRV-2025-00003
- GRV-2025-00004
- GRV-2025-00005
- GRV-2025-00006

### Insurance Companies
- Dhaka Insurance Company Limited
- Bangladesh General Insurance Company
- National Insurance Company

## 🐛 Troubleshooting

### Mobile App Not Loading?
1. Make sure Django server is running on port 5000
2. Check your phone/computer are on the same WiFi network
3. Try restarting the Expo development server

### API Errors?
1. Verify Django server at http://localhost:5000
2. Check CORS settings in Django
3. Ensure demo data is populated

### Cannot Connect?
1. Try web version first: `npx expo start --web`
2. Check terminal for error messages
3. Restart Expo server: Press 'r' in terminal

### QR Code Not Working?
1. Make sure phone and computer on same network
2. Try typing the URL manually in Expo Go
3. Use tunnel mode: `npx expo start --tunnel`

## ⚡ Quick Testing Commands

```bash
# Start mobile app for phone testing
cd mobile/react-native/idra-grievance-app && npx expo start

# Start web version for browser testing
cd mobile/react-native/idra-grievance-app && npx expo start --web

# Check if Django backend is running
curl http://localhost:5000/api/companies/

# Test login API directly
curl -X POST http://localhost:5000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"demo123"}'
```

## 📱 Expected Results

### Successful Login
- Dashboard loads with user name
- Stats show: 6 grievances, 3 companies
- Navigation cards work properly

### Grievances List
- Shows 6 grievances with different statuses
- Each grievance displays ID, title, status, priority
- Scrolls smoothly

### Companies Directory
- Shows 3 insurance companies
- Displays license numbers, emails, phones
- Professional card layout

### Track Functionality
- Enter "GRV-2025-00001" should return grievance details
- Shows title, status, priority information
- Error handling for invalid IDs

The mobile app is fully functional and connects to your existing Django backend with all demo data available for testing!