// In-memory storage implementation for IDRA Grievance Management System

class MemStorage {
  constructor() {
    this.users = [];
    this.companies = [];
    this.userProfiles = [];
    this.grievances = [];
    this.grievanceMessages = [];
    this.auditLogs = [];
    this.seedDemoData();
  }

  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  seedDemoData() {
    // Create demo companies
    const dhakaInsurance = {
      id: this.generateId(),
      name: 'Dhaka Insurance Limited',
      email: 'info@dhakainsurance.com',
      phone: '+880-2-123456789',
      address: 'Dhaka, Bangladesh',
      licenseNumber: 'DI-2023-001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const bgInsurance = {
      id: this.generateId(),
      name: 'Bangladesh General Insurance Company',
      email: 'contact@bginsurance.com',
      phone: '+880-2-987654321',
      address: 'Chittagong, Bangladesh',
      licenseNumber: 'BG-2023-002',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.companies.push(dhakaInsurance, bgInsurance);

    // Create demo users
    const users = [
      {
        id: this.generateId(),
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
        id: this.generateId(),
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
        id: this.generateId(),
        email: 'carol@bginsurance.com',
        password: 'demo123',
        firstName: 'Carol',
        lastName: 'Davis',
        role: 'insurance_company',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        email: 'david@idra.gov.bd',
        password: 'demo123',
        firstName: 'David',
        lastName: 'Wilson',
        role: 'idra_admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        email: 'emma@example.com',
        password: 'demo123',
        firstName: 'Emma',
        lastName: 'Brown',
        role: 'policyholder',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.users.push(...users);

    // Create user profiles
    const profiles = [
      {
        id: this.generateId(),
        userId: users[1].id, // Bob
        companyId: dhakaInsurance.id,
        phone: '+880-1711-123456',
        address: 'Dhaka, Bangladesh',
        nidNumber: null,
        department: 'Claims',
        designation: 'Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        userId: users[2].id, // Carol
        companyId: bgInsurance.id,
        phone: '+880-1911-654321',
        address: 'Chittagong, Bangladesh',
        nidNumber: null,
        department: 'Customer Service',
        designation: 'Senior Officer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.userProfiles.push(...profiles);

    // Create sample grievances
    const sampleGrievances = [
      {
        id: this.generateId(),
        title: 'Claim Settlement Delay',
        description: 'My motor insurance claim has been pending for over 3 months without any response.',
        category: 'Claim Settlement',
        priority: 'high',
        status: 'under_review',
        submitterId: users[0].id, // Alice
        assignedCompanyId: dhakaInsurance.id,
        assignedToId: users[1].id, // Bob
        policyNumber: 'POL-2023-001',
        incidentDate: new Date('2023-08-01'),
        resolutionDetails: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        title: 'Premium Calculation Error',
        description: 'There seems to be an error in my life insurance premium calculation.',
        category: 'Premium Issues',
        priority: 'medium',
        status: 'submitted',
        submitterId: users[4].id, // Emma
        assignedCompanyId: bgInsurance.id,
        assignedToId: users[2].id, // Carol
        policyNumber: 'POL-2023-002',
        incidentDate: new Date('2023-09-15'),
        resolutionDetails: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.grievances.push(...sampleGrievances);
  }

  // User operations
  async createUser(user) {
    const newUser = {
      id: this.generateId(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async getUserWithProfile(id) {
    const user = await this.getUserById(id);
    if (!user) return null;

    const profile = await this.getUserProfileByUserId(id);
    let company = null;
    if (profile?.companyId) {
      company = await this.getCompanyById(profile.companyId);
    }

    return {
      ...user,
      profile: profile || undefined,
      company: company || undefined
    };
  }

  async updateUser(id, user) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...user,
      updatedAt: new Date()
    };
    return this.users[index];
  }

  async deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  async getAllUsers() {
    return this.users;
  }

  // Company operations
  async createCompany(company) {
    const newCompany = {
      id: this.generateId(),
      ...company,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async getCompanyById(id) {
    return this.companies.find(company => company.id === id) || null;
  }

  async getAllCompanies() {
    return this.companies;
  }

  async updateCompany(id, company) {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.companies[index] = {
      ...this.companies[index],
      ...company,
      updatedAt: new Date()
    };
    return this.companies[index];
  }

  async deleteCompany(id) {
    const index = this.companies.findIndex(company => company.id === id);
    if (index === -1) return false;
    this.companies.splice(index, 1);
    return true;
  }

  // User profile operations
  async createUserProfile(profile) {
    const newProfile = {
      id: this.generateId(),
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.push(newProfile);
    return newProfile;
  }

  async getUserProfileByUserId(userId) {
    return this.userProfiles.find(profile => profile.userId === userId) || null;
  }

  async updateUserProfile(userId, profile) {
    const index = this.userProfiles.findIndex(p => p.userId === userId);
    if (index === -1) return null;

    this.userProfiles[index] = {
      ...this.userProfiles[index],
      ...profile,
      updatedAt: new Date()
    };
    return this.userProfiles[index];
  }

  // Grievance operations
  async createGrievance(grievance) {
    const newGrievance = {
      id: this.generateId(),
      ...grievance,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.grievances.push(newGrievance);
    return newGrievance;
  }

  async getGrievanceById(id) {
    const grievance = this.grievances.find(g => g.id === id);
    if (!grievance) return null;

    const submitter = await this.getUserById(grievance.submitterId);
    const assignedCompany = grievance.assignedCompanyId ? await this.getCompanyById(grievance.assignedCompanyId) : undefined;
    const assignedTo = grievance.assignedToId ? await this.getUserById(grievance.assignedToId) : undefined;
    const messages = await this.getMessagesByGrievanceId(id);

    if (!submitter) return null;

    return {
      ...grievance,
      submitter,
      assignedCompany,
      assignedTo,
      messages
    };
  }

  async getAllGrievances() {
    const grievances = await Promise.all(
      this.grievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null);
  }

  async getGrievancesBySubmitter(submitterId) {
    const userGrievances = this.grievances.filter(g => g.submitterId === submitterId);
    const grievances = await Promise.all(
      userGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null);
  }

  async getGrievancesByCompany(companyId) {
    const companyGrievances = this.grievances.filter(g => g.assignedCompanyId === companyId);
    const grievances = await Promise.all(
      companyGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null);
  }

  async getGrievancesByAssignee(assigneeId) {
    const assigneeGrievances = this.grievances.filter(g => g.assignedToId === assigneeId);
    const grievances = await Promise.all(
      assigneeGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null);
  }

  async updateGrievance(id, grievance) {
    const index = this.grievances.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.grievances[index] = {
      ...this.grievances[index],
      ...grievance,
      updatedAt: new Date()
    };
    return this.grievances[index];
  }

  async deleteGrievance(id) {
    const index = this.grievances.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.grievances.splice(index, 1);
    return true;
  }

  // Grievance message operations
  async createGrievanceMessage(message) {
    const newMessage = {
      id: this.generateId(),
      ...message,
      createdAt: new Date()
    };
    this.grievanceMessages.push(newMessage);
    return newMessage;
  }

  async getMessagesByGrievanceId(grievanceId) {
    return this.grievanceMessages.filter(m => m.grievanceId === grievanceId);
  }

  // Audit log operations
  async createAuditLog(log) {
    const newLog = {
      id: this.generateId(),
      ...log,
      createdAt: new Date()
    };
    this.auditLogs.push(newLog);
    return newLog;
  }

  async getAuditLogs(limit = 100) {
    return this.auditLogs.slice(-limit);
  }

  // Authentication helpers
  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || user.password !== password) return null;
    return this.getUserWithProfile(user.id);
  }
}

export const storage = new MemStorage();