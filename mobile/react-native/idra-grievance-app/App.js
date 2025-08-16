import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service
class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const sessionId = await AsyncStorage.getItem('sessionId');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `sessionid=${sessionId}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  }

  static async login(email, password) {
    return this.request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async getGrievances() {
    return this.request('/grievances/');
  }

  static async getCompanies() {
    return this.request('/companies/');
  }

  static async trackGrievance(trackingId) {
    return this.request(`/grievances/track/${trackingId}/`);
  }
}

// Login Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await ApiService.login(email, password);
    setLoading(false);

    if (result.success) {
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user || {}));
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Login Failed', result.data?.message || 'Invalid credentials');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>IDRA</Text>
          <Text style={styles.subtitle}>Grievance Management System</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <Text style={styles.demoText}>Policyholder: alice@example.com / demo123</Text>
            <Text style={styles.demoText}>IDRA Admin: david@idra.gov.bd / demo123</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Dashboard Screen
function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load grievances and companies
      const [grievancesResult, companiesResult] = await Promise.all([
        ApiService.getGrievances(),
        ApiService.getCompanies(),
      ]);

      if (grievancesResult.success) {
        setGrievances(grievancesResult.data || []);
      }

      if (companiesResult.success) {
        setCompanies(companiesResult.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.first_name || 'User'}
        </Text>
        <Text style={styles.roleText}>
          Role: {user?.profile?.role || 'Unknown'}
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Grievances')}
        >
          <Text style={styles.cardTitle}>My Grievances</Text>
          <Text style={styles.cardValue}>{grievances.length}</Text>
          <Text style={styles.cardSubtext}>Active complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Companies')}
        >
          <Text style={styles.cardTitle}>Insurance Companies</Text>
          <Text style={styles.cardValue}>{companies.length}</Text>
          <Text style={styles.cardSubtext}>Registered providers</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('TrackGrievance')}
        >
          <Text style={styles.cardTitle}>Track Grievance</Text>
          <Text style={styles.cardSubtext}>Search by ID</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Grievances</Text>
        {grievances.length > 0 ? (
          grievances.slice(0, 3).map((grievance, index) => (
            <View key={index} style={styles.grievanceItem}>
              <Text style={styles.grievanceTitle}>
                {grievance.grievance_id}: {grievance.title}
              </Text>
              <Text style={styles.grievanceStatus}>
                Status: {grievance.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No grievances found</Text>
        )}
      </View>
    </ScrollView>
  );
}

// Companies Screen
function CompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const result = await ApiService.getCompanies();
    if (result.success) {
      setCompanies(result.data || []);
    }
    setLoading(false);
  };

  const renderCompany = ({ item }) => (
    <View style={styles.companyItem}>
      <Text style={styles.companyName}>{item.name}</Text>
      <Text style={styles.companyInfo}>License: {item.license_number}</Text>
      <Text style={styles.companyInfo}>Email: {item.email}</Text>
      <Text style={styles.companyInfo}>Phone: {item.phone}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading companies...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={companies}
      renderItem={renderCompany}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      contentContainerStyle={styles.listContainer}
    />
  );
}

// Track Grievance Screen
function TrackGrievanceScreen() {
  const [trackingId, setTrackingId] = useState('');
  const [grievanceData, setGrievanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      Alert.alert('Error', 'Please enter a grievance ID');
      return;
    }

    setLoading(true);
    const result = await ApiService.trackGrievance(trackingId.trim());
    setLoading(false);

    if (result.success) {
      setGrievanceData(result.data);
    } else {
      Alert.alert('Not Found', 'Grievance not found or invalid ID');
      setGrievanceData(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.trackContainer}>
        <Text style={styles.sectionTitle}>Track Your Grievance</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Grievance ID (e.g., GRV-2025-00001)"
          value={trackingId}
          onChangeText={setTrackingId}
          autoCapitalize="characters"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleTrack}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Searching...' : 'Track Grievance'}
          </Text>
        </TouchableOpacity>

        {grievanceData && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Grievance Details</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>ID:</Text>
              <Text style={styles.resultValue}>{grievanceData.grievance?.grievance_id}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Title:</Text>
              <Text style={styles.resultValue}>{grievanceData.grievance?.title}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Status:</Text>
              <Text style={styles.resultValue}>{grievanceData.grievance?.status}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Priority:</Text>
              <Text style={styles.resultValue}>{grievanceData.grievance?.priority}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Grievances Screen
function GrievancesScreen() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    const result = await ApiService.getGrievances();
    if (result.success) {
      setGrievances(result.data || []);
    }
    setLoading(false);
  };

  const renderGrievance = ({ item }) => (
    <View style={styles.grievanceCard}>
      <Text style={styles.grievanceCardTitle}>
        {item.grievance_id}
      </Text>
      <Text style={styles.grievanceCardSubtitle}>{item.title}</Text>
      <View style={styles.grievanceCardInfo}>
        <Text style={styles.grievanceCardStatus}>
          Status: {item.status}
        </Text>
        <Text style={styles.grievanceCardPriority}>
          Priority: {item.priority}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading grievances...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={grievances}
      renderItem={renderGrievance}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
      contentContainerStyle={styles.listContainer}
    />
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'IDRA Dashboard' }}
        />
        <Stack.Screen 
          name="Companies" 
          component={CompaniesScreen}
          options={{ title: 'Insurance Companies' }}
        />
        <Stack.Screen 
          name="TrackGrievance" 
          component={TrackGrievanceScreen}
          options={{ title: 'Track Grievance' }}
        />
        <Stack.Screen 
          name="Grievances" 
          component={GrievancesScreen}
          options={{ title: 'My Grievances' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 5,
  },
  demoText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  dashboardHeader: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    flex: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  recentSection: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  grievanceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  grievanceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  grievanceStatus: {
    fontSize: 12,
    color: '#666',
  },
  noDataText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  listContainer: {
    padding: 10,
  },
  companyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  trackContainer: {
    padding: 20,
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 80,
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  grievanceCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  grievanceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  grievanceCardSubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  grievanceCardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grievanceCardStatus: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  grievanceCardPriority: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});
