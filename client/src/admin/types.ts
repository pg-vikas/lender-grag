export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface LoanOfficer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branchId: string;
  avatar?: string;
  volume: number;
  closedLoans: number;
  avgResponseTime: number;
}

export interface Processor {
  id: string;
  fullName: string;
  email: string;
  branchId: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  status: LeadStatus;
  assignedLOId: string;
  branchId: string;
  createdAt: string;
  lastContactAt: string | null;
  tags: string[];
  estimatedLoanAmount: number;
  loanPurpose: string;
  notes: string[];
}

export type LeadStatus =
  | "New"
  | "Attempted Contact"
  | "Contacted"
  | "Qualified"
  | "Pre Approval Started"
  | "Application Started"
  | "Nurture"
  | "Cold"
  | "Lost"
  | "Converted";

export interface Borrower {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  assignedLOId: string;
  processorId: string;
  branchId: string;
  loanFileId: string;
  tags: string[];
  lastActivityAt: string;
  createdAt: string;
}

export type LoanStage =
  | "Lead"
  | "Consultation"
  | "Pre Qualified"
  | "Pre Approved"
  | "Shopping"
  | "Application Submitted"
  | "Processing"
  | "Submitted to Underwriting"
  | "Conditional Approval"
  | "Clear to Close"
  | "Closing Scheduled"
  | "Funded"
  | "Closed"
  | "Lost / Withdrawn";

export interface Milestone {
  stage: LoanStage;
  date: string | null;
  owner: string;
  status: "completed" | "current" | "upcoming";
}

export interface LoanFile {
  id: string;
  borrowerIds: string[];
  stage: LoanStage;
  loanType: string;
  purpose: "Purchase" | "Refinance" | "Cash-Out Refinance";
  amount: number;
  rate: number;
  propertyAddress: string;
  assignedLOId: string;
  processorId: string;
  branchId: string;
  estimatedClose: string;
  createdAt: string;
  updatedAt: string;
  flags: string[];
  milestoneHistory: Milestone[];
}

export type ActivityType =
  | "lead_created"
  | "borrower_created"
  | "loan_created"
  | "stage_changed"
  | "note_added"
  | "assignment_changed"
  | "lead_converted"
  | "docs_requested";

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  entityId: string;
  entityType: "lead" | "borrower" | "loan";
  timestamp: string;
  userId: string;
}

export interface Alert {
  id: string;
  type: "lock_expiring" | "stale_lead" | "inactive_borrower" | "stage_aging" | "missing_milestone";
  title: string;
  description: string;
  severity: "warning" | "critical" | "info";
  entityId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  entityId: string;
  entityType: "lead" | "borrower" | "loan";
  content: string;
  author: string;
  createdAt: string;
  pinned?: boolean;
  category?: string;
}

export type RecordType = "Lead" | "Borrower" | "Co Borrower" | "Agent";

export interface CRMRecord {
  id: string;
  name: string;
  recordType: RecordType;
  status: string;
  source: string;
  assignedLO: string;
  branch: string;
  lastActivity: string;
  nextFollowUp: string | null;
  tags: string[];
  phone: string;
  email: string;
}

export type DashboardMode = "Executive" | "Sales" | "Operations";
