import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client directory during development
app.use(express.static(path.join(__dirname, '../client/dist')));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'IDRA API is working!' });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await storage.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user, token: 'demo_token_' + user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Company routes
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await storage.getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grievance routes
app.get('/api/grievances', async (req, res) => {
  try {
    const { submitterId, companyId, assigneeId } = req.query;
    
    let grievances;
    if (submitterId) {
      grievances = await storage.getGrievancesBySubmitter(submitterId);
    } else if (companyId) {
      grievances = await storage.getGrievancesByCompany(companyId);
    } else if (assigneeId) {
      grievances = await storage.getGrievancesByAssignee(assigneeId);
    } else {
      grievances = await storage.getAllGrievances();
    }
    
    res.json(grievances);
  } catch (error) {
    console.error('Get grievances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/grievances', async (req, res) => {
  try {
    const { title, description, category, submitterId } = req.body;
    
    if (!title || !description || !category || !submitterId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const grievanceData = {
      ...req.body,
      priority: req.body.priority || 'medium',
      status: req.body.status || 'submitted'
    };
    
    const newGrievance = await storage.createGrievance(grievanceData);
    res.status(201).json(newGrievance);
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(400).json({ error: error.message || 'Failed to create grievance' });
  }
});

// Analytics route
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const allGrievances = await storage.getAllGrievances();
    const allUsers = await storage.getAllUsers();
    const allCompanies = await storage.getAllCompanies();
    
    const analytics = {
      totalGrievances: allGrievances.length,
      totalUsers: allUsers.length,
      totalCompanies: allCompanies.length,
      grievancesByStatus: allGrievances.reduce((acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
      }, {}),
      grievancesByPriority: allGrievances.reduce((acc, g) => {
        acc[g.priority] = (acc[g.priority] || 0) + 1;
        return acc;
      }, {}),
      grievancesByCategory: allGrievances.reduce((acc, g) => {
        acc[g.category] = (acc[g.category] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all handler: serve React app for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For development, just send a simple HTML page
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">I</div>
          <h1>IDRA Grievance Management System</h1>
          <p>Insurance Development and Regulatory Authority - Bangladesh</p>
        </div>
        
        <h3>🚀 Backend API is Running!</h3>
        <p>The Express.js backend is successfully running and serving demo data.</p>
        
        <div class="demo-users">
          <h4>Demo Users Available:</h4>
          <div class="user-card">
            <strong>Alice Rahman</strong> - alice@example.com<br>
            <small>Role: Policyholder | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>Bob Ahmed</strong> - bob@dhakainsurance.com<br>
            <small>Role: Insurance Company (Dhaka Insurance) | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>Carol Davis</strong> - carol@bginsurance.com<br>
            <small>Role: Insurance Company (Bangladesh General) | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>David Wilson</strong> - david@idra.gov.bd<br>
            <small>Role: IDRA Administrator | Password: demo123</small>
          </div>
          <div class="user-card">
            <strong>Emma Brown</strong> - emma@example.com<br>
            <small>Role: Policyholder | Password: demo123</small>
          </div>
        </div>
        
        <h4>Test API Endpoints:</h4>
        <button class="test-button" onclick="testApi('/api/test')">Test API</button>
        <button class="test-button" onclick="testApi('/api/users')">Get Users</button>
        <button class="test-button" onclick="testApi('/api/companies')">Get Companies</button>
        <button class="test-button" onclick="testApi('/api/grievances')">Get Grievances</button>
        <button class="test-button" onclick="testLogin()">Test Login</button>
        
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
          const result = document.getElementById('result');
          result.style.display = 'block';
          result.textContent = 'Testing login...';
          
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: 'alice@example.com',
                password: 'demo123'
              })
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 IDRA Grievance Management System running on port ${PORT}`);
  console.log(`📊 Backend API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log('');
  console.log('Demo Users Available:');
  console.log('- alice@example.com (Policyholder) - Password: demo123');
  console.log('- bob@dhakainsurance.com (Insurance Company) - Password: demo123');
  console.log('- carol@bginsurance.com (Insurance Company) - Password: demo123');
  console.log('- david@idra.gov.bd (IDRA Administrator) - Password: demo123');
  console.log('- emma@example.com (Policyholder) - Password: demo123');
});