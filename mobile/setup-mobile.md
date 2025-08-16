# Setup Mobile Development in Current Replit

## Quick Start (React Native with Expo)

1. **Install Expo CLI:**
```bash
cd mobile/react-native
npx create-expo-app@latest idra-grievance-app
cd idra-grievance-app
```

2. **Install Dependencies:**
```bash
npm install axios
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
```

3. **Configure API Connection:**
```javascript
// config/api.js
const API_CONFIG = {
  baseURL: __DEV__ 
    ? 'http://localhost:5000/api'  // Development
    : 'https://your-repl.replit.app/api', // Production
  timeout: 10000,
};

export default API_CONFIG;
```

4. **Start Development:**
```bash
npm start
# Scan QR code with Expo Go app on your phone
```

## Advantages of This Setup

✅ **Shared Backend** - Same Django API serves both web and mobile
✅ **Single Database** - All data synchronized across platforms  
✅ **Unified Auth** - Same user accounts work on web and mobile
✅ **Easy Testing** - Backend running on localhost:5000
✅ **Simple Deployment** - Deploy backend once, mobile apps connect to it

## API Endpoints Ready for Mobile

- **Authentication:** `/api/accounts/login/`, `/api/accounts/register/`
- **Companies:** `/api/companies/`
- **Grievances:** `/api/grievances/`, `/api/grievances/track/{id}/`

## Demo Accounts for Testing

- Policyholder: `alice@example.com` / `demo123`
- IDRA Admin: `david@idra.gov.bd` / `demo123`
- Insurance Company: `bob@dhakainsurance.com` / `demo123`

## File Structure

```
your-replit-project/
├── backend/          (Django API - already working)
├── mobile/
│   ├── react-native/
│   │   └── idra-grievance-app/  (Expo app)
│   ├── docs/
│   └── api-examples/
└── MOBILE_APP_GUIDE.md
```

Start mobile development immediately - your backend API is ready!