import { pgTable, text, uuid, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table - base user information
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: ['policyholder', 'insurance_company', 'idra_admin', 'super_admin'] }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Insurance companies
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  licenseNumber: text('license_number'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// User profiles for additional role-specific data
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  companyId: uuid('company_id').references(() => companies.id),
  phone: text('phone'),
  address: text('address'),
  nidNumber: text('nid_number'),
  department: text('department'),
  designation: text('designation'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Grievances
export const grievances = pgTable('grievances', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  status: text('status', { enum: ['submitted', 'under_review', 'investigating', 'resolved', 'closed', 'rejected'] }).default('submitted'),
  submitterId: uuid('submitter_id').references(() => users.id).notNull(),
  assignedCompanyId: uuid('assigned_company_id').references(() => companies.id),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  policyNumber: text('policy_number'),
  incidentDate: timestamp('incident_date'),
  resolutionDetails: text('resolution_details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Grievance messages/communications
export const grievanceMessages = pgTable('grievance_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  grievanceId: uuid('grievance_id').references(() => grievances.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  isInternal: boolean('is_internal').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGrievanceSchema = createInsertSchema(grievances).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGrievanceMessageSchema = createInsertSchema(grievanceMessages).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertGrievance = z.infer<typeof insertGrievanceSchema>;
export type InsertGrievanceMessage = z.infer<typeof insertGrievanceMessageSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Grievance = typeof grievances.$inferSelect;
export type GrievanceMessage = typeof grievanceMessages.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

// Extended types for API responses
export type UserWithProfile = User & {
  profile?: UserProfile;
  company?: Company;
};

export type GrievanceWithDetails = Grievance & {
  submitter: User;
  assignedCompany?: Company;
  assignedTo?: User;
  messages?: GrievanceMessage[];
};