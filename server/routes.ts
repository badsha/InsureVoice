import express from 'express';
import { z } from 'zod';
import { storage } from './storage.js';
import { 
  insertUserSchema, 
  insertCompanySchema, 
  insertUserProfileSchema, 
  insertGrievanceSchema, 
  insertGrievanceMessageSchema 
} from '../shared/schema.js';

const router = express.Router();

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
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/auth/register', async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const newUser = await storage.createUser(userData);
    const userWithProfile = await storage.getUserWithProfile(newUser.id);
    
    res.status(201).json({ user: userWithProfile, token: 'demo_token_' + newUser.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
router.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = insertUserSchema.partial().parse(req.body);
    
    const updatedUser = await storage.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Company routes
router.get('/api/companies', async (req, res) => {
  try {
    const companies = await storage.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/companies', async (req, res) => {
  try {
    const companyData = insertCompanySchema.parse(req.body);
    const newCompany = await storage.createCompany(companyData);
    res.status(201).json(newCompany);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile routes
router.post('/api/user-profiles', async (req, res) => {
  try {
    const profileData = insertUserProfileSchema.parse(req.body);
    const newProfile = await storage.createUserProfile(profileData);
    res.status(201).json(newProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grievance routes
router.get('/api/grievances', async (req, res) => {
  try {
    const { submitterId, companyId, assigneeId } = req.query;
    
    let grievances;
    if (submitterId) {
      grievances = await storage.getGrievancesBySubmitter(submitterId as string);
    } else if (companyId) {
      grievances = await storage.getGrievancesByCompany(companyId as string);
    } else if (assigneeId) {
      grievances = await storage.getGrievancesByAssignee(assigneeId as string);
    } else {
      grievances = await storage.getAllGrievances();
    }
    
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/grievances', async (req, res) => {
  try {
    const grievanceData = insertGrievanceSchema.parse(req.body);
    const newGrievance = await storage.createGrievance(grievanceData);
    res.status(201).json(newGrievance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/api/grievances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = insertGrievanceSchema.partial().parse(req.body);
    
    const updatedGrievance = await storage.updateGrievance(id, updateData);
    if (!updatedGrievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    
    res.json(updatedGrievance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/grievances/:grievanceId/messages', async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const messageData = insertGrievanceMessageSchema.parse({
      ...req.body,
      grievanceId
    });
    
    const newMessage = await storage.createGrievanceMessage(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
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
      }, {} as Record<string, number>),
      grievancesByPriority: allGrievances.reduce((acc, g) => {
        acc[g.priority] = (acc[g.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      grievancesByCategory: allGrievances.reduce((acc, g) => {
        acc[g.category] = (acc[g.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;