const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.REPLIT_DEV_DOMAIN ? 5000 : 3000;

// In-memory storage
const users = [
  {
    id: 'user1',
    email: 'alice@example.com',
    password: 'demo123',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'policyholder',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user2',
    email: 'bob@dhakainsurance.com',
    password: 'demo123',
    firstName: 'Bob',
    lastName: 'Smith',
    role: 'insurance_company',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user3',
    email: 'david@idra.gov.bd',
    password: 'demo123',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'idra_admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const companies = [
  {
    id: 'comp1',
    name: 'Dhaka Insurance Limited',
    email: 'info@dhakainsurance.com',
    phone: '+880-2-123456789',
    address: 'Dhaka, Bangladesh',
    licenseNumber: 'DI-2023-001',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'comp2',
    name: 'Bangladesh General Insurance Company',
    email: 'contact@bginsurance.com',
    phone: '+880-2-987654321',
    address: 'Chittagong, Bangladesh',
    licenseNumber: 'BG-2023-002',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const grievances = [
  {
    id: 'griev1',
    title: 'Claim Settlement Delay',
    description: 'My motor insurance claim has been pending for over 3 months without any response.',
    category: 'Claim Settlement',
    priority: 'high',
    status: 'under_review',
    submitterId: 'user1',
    assignedCompanyId: 'comp1',
    policyNumber: 'POL-2023-001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'griev2',
    title: 'Premium Calculation Error',
    description: 'There seems to be an error in my life insurance premium calculation.',
    category: 'Premium Issues',
    priority: 'medium',
    status: 'submitted',
    submitterId: 'user1',
    assignedCompanyId: 'comp2',
    policyNumber: 'POL-2023-002',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'IDRA API is working!' });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user, token: 'demo_token_' + user.id });
});

// Users
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Companies
app.get('/api/companies', (req, res) => {
  res.json(companies);
});

// Grievances
app.get('/api/grievances', (req, res) => {
  const { submitterId } = req.query;
  
  let result = grievances;
  if (submitterId) {
    result = grievances.filter(g => g.submitterId === submitterId);
  }
  
  // Add submitter info to each grievance
  result = result.map(g => {
    const submitter = users.find(u => u.id === g.submitterId);
    const assignedCompany = companies.find(c => c.id === g.assignedCompanyId);
    return {
      ...g,
      submitter,
      assignedCompany
    };
  });
  
  res.json(result);
});

app.post('/api/grievances', (req, res) => {
  const { title, description, category, submitterId } = req.body;
  
  if (!title || !description || !category || !submitterId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newGrievance = {
    id: 'griev_' + Date.now(),
    title,
    description,
    category,
    priority: req.body.priority || 'medium',
    status: 'submitted',
    submitterId,
    assignedCompanyId: req.body.assignedCompanyId || null,
    policyNumber: req.body.policyNumber || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  grievances.push(newGrievance);
  
  // Return with submitter info
  const submitter = users.find(u => u.id === newGrievance.submitterId);
  const assignedCompany = companies.find(c => c.id === newGrievance.assignedCompanyId);
  
  res.status(201).json({
    ...newGrievance,
    submitter,
    assignedCompany
  });
});

// Analytics
app.get('/api/analytics/dashboard', (req, res) => {
  const analytics = {
    totalGrievances: grievances.length,
    totalUsers: users.length,
    totalCompanies: companies.length,
    grievancesByStatus: grievances.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {}),
    grievancesByPriority: grievances.reduce((acc, g) => {
      acc[g.priority] = (acc[g.priority] || 0) + 1;
      return acc;
    }, {}),
    grievancesByCategory: grievances.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json(analytics);
});

// Serve static files for React app
app.use('/react', express.static(__dirname + '/../client/dist'));

// Landing page route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IDRA Grievance Management System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .demo-users {
          background: #f8fafc;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .user-card {
          background: white;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
        .test-button {
          background: #3b82f6;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 5px;
        }
        .test-button:hover {
          background: #2563eb;
        }
        .status {
          color: #059669;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">I</div>
          <h1>IDRA Grievance Management System</h1>
          <p>Insurance Development and Regulatory Authority - Bangladesh</p>
          <div class="status">✅ System Running Successfully</div>
        </div>
        
        <h3>🚀 Backend API is Running!</h3>
        <p>The Express.js backend is successfully running and serving demo data.</p>
        
        <div class="demo-users">
          <h4>Demo Users Available:</h4>
          <div class="user-card">
            <strong>Alice Johnson</strong> - alice@example.com<br>
            <small>Role: Policyholder | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>Bob Smith</strong> - bob@dhakainsurance.com<br>
            <small>Role: Insurance Company (Dhaka Insurance) | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>David Wilson</strong> - david@idra.gov.bd<br>
            <small>Role: IDRA Administrator | Password: demo123</small>
          </div>
        </div>
        
        <h4>Available Pages:</h4>
        <button class="test-button" onclick="window.location.href='/login'">Login Page</button>
        <button class="test-button" onclick="window.location.href='/dashboard'">Dashboard</button>
        <button class="test-button" onclick="window.location.href='/grievances'">Grievances</button>
        
        <h4>Test API Endpoints:</h4>
        <button class="test-button" onclick="testApi('/api/test')">Test API</button>
        <button class="test-button" onclick="testApi('/api/users')">Get Users</button>
        <button class="test-button" onclick="testApi('/api/companies')">Get Companies</button>
        <button class="test-button" onclick="testApi('/api/grievances')">Get Grievances</button>
        <button class="test-button" onclick="testLogin()">Test Login</button>
        <button class="test-button" onclick="testAnalytics()">Analytics</button>
        
        <div id="result" style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 4px; white-space: pre-wrap; font-family: monospace; display: none;"></div>
      </div>
      
      <script>
        async function testApi(endpoint) {
          const result = document.getElementById('result');
          result.style.display = 'block';
          result.textContent = 'Loading...';
          
          try {
            const response = await fetch(endpoint);
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            result.textContent = 'Error: ' + error.message;
          }
        }
        
        async function testLogin() {
          testApiCall('/api/auth/login', 'POST', {
            email: 'alice@example.com',
            password: 'demo123'
          });
        }
        
        async function testAnalytics() {
          testApi('/api/analytics/dashboard');
        }
        
        async function testApiCall(endpoint, method, body) {
          const result = document.getElementById('result');
          result.style.display = 'block';
          result.textContent = 'Loading...';
          
          try {
            const response = await fetch(endpoint, {
              method: method,
              headers: {
                'Content-Type': 'application/json'
              },
              body: body ? JSON.stringify(body) : undefined
            });
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            result.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - IDRA GMS</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 100px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        input[type="email"], input[type="password"] {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
        }
        .login-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }
        .login-button:hover {
          background: #2563eb;
        }
        .demo-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .demo-user {
          background: #f8fafc;
          padding: 10px;
          margin: 5px 0;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .demo-user:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .message {
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          display: none;
        }
        .success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }
        .error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">I</div>
          <h1>Sign In</h1>
          <p>IDRA Grievance Management System</p>
        </div>
        
        <div id="message" class="message"></div>
        
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          
          <button type="submit" class="login-button" id="loginBtn">Sign In</button>
        </form>
        
        <div class="demo-section">
          <h4>Demo Users (Click to login):</h4>
          <div class="demo-user" onclick="quickLogin('alice@example.com', 'demo123')">
            <strong>Alice Johnson</strong> - Policyholder<br>
            <small>alice@example.com</small>
          </div>
          <div class="demo-user" onclick="quickLogin('bob@dhakainsurance.com', 'demo123')">
            <strong>Bob Smith</strong> - Insurance Company<br>
            <small>bob@dhakainsurance.com</small>
          </div>
          <div class="demo-user" onclick="quickLogin('david@idra.gov.bd', 'demo123')">
            <strong>David Wilson</strong> - IDRA Administrator<br>
            <small>david@idra.gov.bd</small>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="/" style="color: #3b82f6; text-decoration: none;">← Back to Home</a>
        </div>
      </div>
      
      <script>
        function showMessage(text, type = 'success') {
          const message = document.getElementById('message');
          message.textContent = text;
          message.className = 'message ' + type;
          message.style.display = 'block';
          
          if (type === 'success') {
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          }
        }
        
        function quickLogin(email, password) {
          document.getElementById('email').value = email;
          document.getElementById('password').value = password;
          document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const loginBtn = document.getElementById('loginBtn');
          loginBtn.textContent = 'Signing in...';
          loginBtn.disabled = true;
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('currentUser', JSON.stringify(data.user));
              showMessage('Login successful! Redirecting...', 'success');
            } else {
              showMessage(data.error || 'Login failed', 'error');
            }
          } catch (error) {
            showMessage('Network error. Please try again.', 'error');
          } finally {
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - IDRA GMS</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logout-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #3b82f6;
        }
        .stat-label {
          color: #666;
          margin-top: 5px;
        }
        .section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .grievance-item {
          padding: 15px;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          margin: 10px 0;
        }
        .grievance-title {
          font-weight: bold;
          color: #333;
        }
        .grievance-meta {
          color: #666;
          font-size: 0.9rem;
          margin-top: 5px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-submitted {
          background: #dbeafe;
          color: #1e40af;
        }
        .status-under_review {
          background: #fef3c7;
          color: #92400e;
        }
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <div class="logo-icon">I</div>
          <div>
            <h2 style="margin: 0;">IDRA GMS</h2>
            <small>Grievance Management System</small>
          </div>
        </div>
        <div class="user-info">
          <span id="userWelcome">Loading...</span>
          <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
      </div>
      
      <div class="container">
        <div class="stats-grid" id="statsGrid">
          <div class="loading">Loading dashboard data...</div>
        </div>
        
        <div class="section">
          <h3>Recent Grievances</h3>
          <div id="recentGrievances">
            <div class="loading">Loading grievances...</div>
          </div>
        </div>
      </div>
      
      <script>
        // Check authentication
        const token = localStorage.getItem('authToken');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!token) {
          window.location.href = '/login';
        }
        
        // Display user info
        if (currentUser.firstName) {
          document.getElementById('userWelcome').textContent = 'Welcome, ' + currentUser.firstName + ' ' + currentUser.lastName;
        }
        
        function logout() {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/';
        }
        
        // Load dashboard data
        async function loadDashboard() {
          try {
            // Load analytics
            const analyticsResponse = await fetch('/api/analytics/dashboard');
            const analytics = await analyticsResponse.json();
            
            // Display stats
            document.getElementById('statsGrid').innerHTML = 
              '<div class="stat-card"><div class="stat-number">' + analytics.totalGrievances + '</div><div class="stat-label">Total Grievances</div></div>' +
              '<div class="stat-card"><div class="stat-number">' + analytics.totalUsers + '</div><div class="stat-label">Total Users</div></div>' +
              '<div class="stat-card"><div class="stat-number">' + analytics.totalCompanies + '</div><div class="stat-label">Insurance Companies</div></div>';
            
            // Load grievances
            const grievancesResponse = await fetch('/api/grievances' + (currentUser.role === 'policyholder' ? '?submitterId=' + currentUser.id : ''));
            const grievances = await grievancesResponse.json();
            
            if (grievances.length === 0) {
              document.getElementById('recentGrievances').innerHTML = '<p>No grievances found.</p>';
            } else {
              document.getElementById('recentGrievances').innerHTML = grievances.map(g => 
                '<div class="grievance-item">' +
                  '<div class="grievance-title">' + g.title + '</div>' +
                  '<div class="grievance-meta">' +
                    '<span class="status-badge status-' + g.status + '">' + g.status.replace('_', ' ') + '</span> ' +
                    '• Priority: ' + g.priority + ' • ' + new Date(g.createdAt).toLocaleDateString() +
                  '</div>' +
                '</div>'
              ).join('');
            }
          } catch (error) {
            console.error('Error loading dashboard:', error);
            document.getElementById('statsGrid').innerHTML = '<div class="loading">Error loading data</div>';
            document.getElementById('recentGrievances').innerHTML = '<div class="loading">Error loading grievances</div>';
          }
        }
        
        loadDashboard();
      </script>
    </body>
    </html>
  `);
});

// Grievances page
app.get('/grievances', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Grievances - IDRA GMS</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .nav-links a {
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
        }
        .nav-links a:hover {
          background: rgba(255,255,255,0.2);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .grievance-grid {
          display: grid;
          gap: 20px;
        }
        .grievance-card {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px;
          background: white;
        }
        .grievance-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .grievance-title {
          font-weight: bold;
          color: #333;
          font-size: 1.1rem;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-submitted {
          background: #dbeafe;
          color: #1e40af;
        }
        .status-under_review {
          background: #fef3c7;
          color: #92400e;
        }
        .priority-high {
          border-left: 4px solid #ef4444;
        }
        .priority-medium {
          border-left: 4px solid #f59e0b;
        }
        .grievance-meta {
          color: #666;
          font-size: 0.9rem;
          margin: 10px 0;
        }
        .grievance-description {
          color: #555;
          line-height: 1.5;
          margin: 10px 0;
        }
        .create-btn {
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .create-btn:hover {
          background: #2563eb;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <div class="logo-icon">I</div>
          <div>
            <h2 style="margin: 0;">IDRA GMS</h2>
            <small>Grievance Management</small>
          </div>
        </div>
        <div class="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/grievances">Grievances</a>
          <a href="/" onclick="logout()">Logout</a>
        </div>
      </div>
      
      <div class="container">
        <div class="section">
          <h2>Grievances</h2>
          <button class="create-btn" onclick="showCreateForm()">+ Submit New Grievance</button>
          
          <div id="createFormSection" style="display: none; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h3>Submit New Grievance</h3>
            <form id="createGrievanceForm">
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
                <input type="text" id="title" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Category:</label>
                <select id="category" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                  <option value="">Select Category</option>
                  <option value="Claim Settlement">Claim Settlement</option>
                  <option value="Premium Issues">Premium Issues</option>
                  <option value="Policy Terms">Policy Terms</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Priority:</label>
                <select id="priority" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Policy Number (optional):</label>
                <input type="text" id="policyNumber" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Description:</label>
                <textarea id="description" required rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;"></textarea>
              </div>
              
              <button type="submit" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Submit Grievance</button>
              <button type="button" onclick="hideCreateForm()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Cancel</button>
            </form>
          </div>
          
          <div id="grievancesList">
            <div class="loading">Loading grievances...</div>
          </div>
        </div>
      </div>
      
      <script>
        const token = localStorage.getItem('authToken');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!token) {
          window.location.href = '/login';
        }
        
        function logout() {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/';
        }
        
        function showCreateForm() {
          document.getElementById('createFormSection').style.display = 'block';
        }
        
        function hideCreateForm() {
          document.getElementById('createFormSection').style.display = 'none';
          document.getElementById('createGrievanceForm').reset();
        }
        
        document.getElementById('createGrievanceForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            description: document.getElementById('description').value,
            policyNumber: document.getElementById('policyNumber').value || null,
            submitterId: currentUser.id
          };
          
          try {
            const response = await fetch('/api/grievances', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            
            if (response.ok) {
              hideCreateForm();
              loadGrievances(); // Reload the list
              alert('Grievance submitted successfully!');
            } else {
              const error = await response.json();
              alert('Error: ' + (error.error || 'Failed to submit grievance'));
            }
          } catch (error) {
            alert('Network error. Please try again.');
          }
        });
        
        async function loadGrievances() {
          try {
            const url = currentUser.role === 'policyholder' ? 
              '/api/grievances?submitterId=' + currentUser.id : 
              '/api/grievances';
              
            const response = await fetch(url);
            const grievances = await response.json();
            
            if (grievances.length === 0) {
              document.getElementById('grievancesList').innerHTML = '<p>No grievances found.</p>';
            } else {
              document.getElementById('grievancesList').innerHTML = 
                '<div class="grievance-grid">' + 
                grievances.map(g => 
                  '<div class="grievance-card priority-' + g.priority + '">' +
                    '<div class="grievance-header">' +
                      '<div class="grievance-title">' + g.title + '</div>' +
                      '<span class="status-badge status-' + g.status + '">' + g.status.replace('_', ' ') + '</span>' +
                    '</div>' +
                    '<div class="grievance-meta">' +
                      'Category: ' + g.category + ' • ' +
                      'Priority: ' + g.priority + ' • ' +
                      'Created: ' + new Date(g.createdAt).toLocaleDateString() +
                      (g.policyNumber ? ' • Policy: ' + g.policyNumber : '') +
                    '</div>' +
                    '<div class="grievance-description">' + g.description + '</div>' +
                    (g.submitter && currentUser.role !== 'policyholder' ? 
                      '<div class="grievance-meta">Submitted by: ' + g.submitter.firstName + ' ' + g.submitter.lastName + ' (' + g.submitter.email + ')</div>' : 
                      '') +
                    (g.assignedCompany ? 
                      '<div class="grievance-meta">Assigned to: ' + g.assignedCompany.name + '</div>' : 
                      '') +
                  '</div>'
                ).join('') +
                '</div>';
            }
          } catch (error) {
            console.error('Error loading grievances:', error);
            document.getElementById('grievancesList').innerHTML = '<div class="loading">Error loading grievances</div>';
          }
        }
        
        loadGrievances();
      </script>
    </body>
    </html>
  `);
});

// Catch-all for unknown routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Redirect unknown routes to home
  res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 IDRA Grievance Management System running on port ${PORT}`);
  console.log(`📊 Backend API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log('');
  console.log('Demo Users Available:');
  console.log('- alice@example.com (Policyholder) - Password: demo123');
  console.log('- bob@dhakainsurance.com (Insurance Company) - Password: demo123');
  console.log('- david@idra.gov.bd (IDRA Administrator) - Password: demo123');
});