import express from 'express';
import { storage } from './storage.js';

const router = express.Router();

// Validation helper
const validateRequired = (fields, body) => {
  const missing = fields.filter(field => !body[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

// Authentication routes
router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await storage.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, you'd create a session or JWT token here
    res.json({ user, token: 'demo_token_' + user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    validateRequired(['email', 'password', 'firstName', 'lastName', 'role'], req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const userData = {
      email,
      password,
      firstName,
      lastName,
      role,
      isActive: true
    };

    const newUser = await storage.createUser(userData);
    const userWithProfile = await storage.getUserWithProfile(newUser.id);
    
    res.status(201).json({ user: userWithProfile, token: 'demo_token_' + newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// User routes
router.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await storage.getUserWithProfile(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedUser = await storage.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Company routes
router.get('/api/companies', async (req, res) => {
  try {
    const companies = await storage.getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/companies', async (req, res) => {
  try {
    const { name, email } = req.body;
    validateRequired(['name', 'email'], req.body);
    
    const companyData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };
    
    const newCompany = await storage.createCompany(companyData);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(400).json({ error: error.message || 'Failed to create company' });
  }
});

router.get('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const company = await storage.getCompanyById(id);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile routes
router.post('/api/user-profiles', async (req, res) => {
  try {
    const { userId } = req.body;
    validateRequired(['userId'], req.body);
    
    const newProfile = await storage.createUserProfile(req.body);
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(400).json({ error: error.message || 'Failed to create profile' });
  }
});

router.get('/api/user-profiles/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await storage.getUserProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grievance routes
router.get('/api/grievances', async (req, res) => {
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

router.post('/api/grievances', async (req, res) => {
  try {
    const { title, description, category, submitterId } = req.body;
    validateRequired(['title', 'description', 'category', 'submitterId'], req.body);
    
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

router.get('/api/grievances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await storage.getGrievanceById(id);
    
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    
    res.json(grievance);
  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/api/grievances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedGrievance = await storage.updateGrievance(id, updateData);
    if (!updatedGrievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    
    res.json(updatedGrievance);
  } catch (error) {
    console.error('Update grievance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grievance message routes
router.get('/api/grievances/:grievanceId/messages', async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const messages = await storage.getMessagesByGrievanceId(grievanceId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/grievances/:grievanceId/messages', async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { senderId, message } = req.body;
    
    validateRequired(['senderId', 'message'], req.body);
    
    const messageData = {
      grievanceId,
      senderId,
      message,
      isInternal: req.body.isInternal || false
    };
    
    const newMessage = await storage.createGrievanceMessage(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(400).json({ error: error.message || 'Failed to create message' });
  }
});

// Analytics routes
router.get('/api/analytics/dashboard', async (req, res) => {
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

export default router;