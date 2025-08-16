import type { 
  User, Company, UserProfile, Grievance, GrievanceMessage, AuditLog,
  InsertUser, InsertCompany, InsertUserProfile, InsertGrievance, InsertGrievanceMessage, InsertAuditLog,
  UserWithProfile, GrievanceWithDetails
} from '../shared/schema.js';

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserWithProfile(id: string): Promise<UserWithProfile | null>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Company operations
  createCompany(company: InsertCompany): Promise<Company>;
  getCompanyById(id: string): Promise<Company | null>;
  getAllCompanies(): Promise<Company[]>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company | null>;
  deleteCompany(id: string): Promise<boolean>;

  // User profile operations
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfileByUserId(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | null>;

  // Grievance operations
  createGrievance(grievance: InsertGrievance): Promise<Grievance>;
  getGrievanceById(id: string): Promise<GrievanceWithDetails | null>;
  getAllGrievances(): Promise<GrievanceWithDetails[]>;
  getGrievancesBySubmitter(submitterId: string): Promise<GrievanceWithDetails[]>;
  getGrievancesByCompany(companyId: string): Promise<GrievanceWithDetails[]>;
  getGrievancesByAssignee(assigneeId: string): Promise<GrievanceWithDetails[]>;
  updateGrievance(id: string, grievance: Partial<InsertGrievance>): Promise<Grievance | null>;
  deleteGrievance(id: string): Promise<boolean>;

  // Grievance message operations
  createGrievanceMessage(message: InsertGrievanceMessage): Promise<GrievanceMessage>;
  getMessagesByGrievanceId(grievanceId: string): Promise<GrievanceMessage[]>;

  // Audit log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;

  // Authentication helpers
  authenticateUser(email: string, password: string): Promise<UserWithProfile | null>;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private users: User[] = [];
  private companies: Company[] = [];
  private userProfiles: UserProfile[] = [];
  private grievances: Grievance[] = [];
  private grievanceMessages: GrievanceMessage[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.seedDemoData();
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  private seedDemoData() {
    // Create demo companies
    const dhakaInsurance: Company = {
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

    const bgInsurance: Company = {
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
        role: 'policyholder' as const,
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
        role: 'insurance_company' as const,
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
        role: 'insurance_company' as const,
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
        role: 'idra_admin' as const,
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
        role: 'policyholder' as const,
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
        priority: 'high' as const,
        status: 'under_review' as const,
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
        priority: 'medium' as const,
        status: 'submitted' as const,
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
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.generateId(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getUserWithProfile(id: string): Promise<UserWithProfile | null> {
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

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...user,
      updatedAt: new Date()
    };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  // Company operations
  async createCompany(company: InsertCompany): Promise<Company> {
    const newCompany: Company = {
      id: this.generateId(),
      ...company,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async getCompanyById(id: string): Promise<Company | null> {
    return this.companies.find(company => company.id === id) || null;
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companies;
  }

  async updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company | null> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.companies[index] = {
      ...this.companies[index],
      ...company,
      updatedAt: new Date()
    };
    return this.companies[index];
  }

  async deleteCompany(id: string): Promise<boolean> {
    const index = this.companies.findIndex(company => company.id === id);
    if (index === -1) return false;
    this.companies.splice(index, 1);
    return true;
  }

  // User profile operations
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const newProfile: UserProfile = {
      id: this.generateId(),
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userProfiles.push(newProfile);
    return newProfile;
  }

  async getUserProfileByUserId(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.find(profile => profile.userId === userId) || null;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | null> {
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
  async createGrievance(grievance: InsertGrievance): Promise<Grievance> {
    const newGrievance: Grievance = {
      id: this.generateId(),
      ...grievance,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.grievances.push(newGrievance);
    return newGrievance;
  }

  async getGrievanceById(id: string): Promise<GrievanceWithDetails | null> {
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

  async getAllGrievances(): Promise<GrievanceWithDetails[]> {
    const grievances = await Promise.all(
      this.grievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null) as GrievanceWithDetails[];
  }

  async getGrievancesBySubmitter(submitterId: string): Promise<GrievanceWithDetails[]> {
    const userGrievances = this.grievances.filter(g => g.submitterId === submitterId);
    const grievances = await Promise.all(
      userGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null) as GrievanceWithDetails[];
  }

  async getGrievancesByCompany(companyId: string): Promise<GrievanceWithDetails[]> {
    const companyGrievances = this.grievances.filter(g => g.assignedCompanyId === companyId);
    const grievances = await Promise.all(
      companyGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null) as GrievanceWithDetails[];
  }

  async getGrievancesByAssignee(assigneeId: string): Promise<GrievanceWithDetails[]> {
    const assigneeGrievances = this.grievances.filter(g => g.assignedToId === assigneeId);
    const grievances = await Promise.all(
      assigneeGrievances.map(g => this.getGrievanceById(g.id))
    );
    return grievances.filter(g => g !== null) as GrievanceWithDetails[];
  }

  async updateGrievance(id: string, grievance: Partial<InsertGrievance>): Promise<Grievance | null> {
    const index = this.grievances.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.grievances[index] = {
      ...this.grievances[index],
      ...grievance,
      updatedAt: new Date()
    };
    return this.grievances[index];
  }

  async deleteGrievance(id: string): Promise<boolean> {
    const index = this.grievances.findIndex(g => g.id === id);
    if (index === -1) return false;
    this.grievances.splice(index, 1);
    return true;
  }

  // Grievance message operations
  async createGrievanceMessage(message: InsertGrievanceMessage): Promise<GrievanceMessage> {
    const newMessage: GrievanceMessage = {
      id: this.generateId(),
      ...message,
      createdAt: new Date()
    };
    this.grievanceMessages.push(newMessage);
    return newMessage;
  }

  async getMessagesByGrievanceId(grievanceId: string): Promise<GrievanceMessage[]> {
    return this.grievanceMessages.filter(m => m.grievanceId === grievanceId);
  }

  // Audit log operations
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: this.generateId(),
      ...log,
      createdAt: new Date()
    };
    this.auditLogs.push(newLog);
    return newLog;
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    return this.auditLogs.slice(-limit);
  }

  // Authentication helpers
  async authenticateUser(email: string, password: string): Promise<UserWithProfile | null> {
    const user = await this.getUserByEmail(email);
    if (!user || user.password !== password) return null;
    return this.getUserWithProfile(user.id);
  }
}

export const storage = new MemStorage();