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

export type DocumentCategory = "Identification" | "Income" | "Assets" | "Tax Returns" | "Bank Statements" | "Purchase Contract" | "Disclosures" | "Title / Escrow" | "Insurance" | "Conditions" | "Miscellaneous";
export type DocumentStatus = "Requested" | "Borrower Received" | "Uploaded" | "Under Review" | "Accepted" | "Needs Revision" | "Rejected";

export interface Document {
  id: string;
  name: string;
  borrowerId: string;
  loanFileId: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string | null;
  requestedBy: string;
  requestedAt: string;
  reviewerId: string | null;
  reviewNotes: string | null;
  borrowerVisibleNotes: string | null;
  notesCount: number;
}

export type ESignStatus = "Draft" | "Sent" | "Viewed" | "In Progress" | "Completed" | "Expired" | "Failed";

export interface ESignEventLog {
  action: string;
  userId: string;
  timestamp: string;
}

export interface ESignPackage {
  id: string;
  name: string;
  borrowerId: string;
  loanFileId: string;
  templateId: string | null;
  signerIds: string[];
  status: ESignStatus;
  sentAt: string | null;
  completedAt: string | null;
  documentUrl: string;
  eventLog: ESignEventLog[];
  recipientCount: number;
}

export interface ESignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  pageCount: number;
  fieldCount: number;
  lastUsed: string;
  usageCount: number;
}

export interface ESignField {
  id: string;
  packageId: string;
  type: "signature" | "initials" | "date_signed" | "date" | "full_name" | "text" | "checkbox";
  signerId: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  label: string;
  placeholder?: string;
}

export type ConditionStatus = "Requested" | "Borrower Uploaded" | "Under Review" | "Accepted" | "Needs Revision" | "Cleared" | "Overdue";
export type ConditionType = "income_verification" | "asset_verification" | "letter_of_explanation" | "updated_bank_statement" | "title_item" | "insurance_item" | "purchase_contract_revision" | "disclosure_item" | "miscellaneous";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface Condition {
  id: string;
  title: string;
  description: string;
  borrowerId: string;
  loanFileId: string;
  type: ConditionType;
  status: ConditionStatus;
  dueDate: string;
  priority: Priority;
  assignedReviewerId: string;
  linkedDocumentIds: string[];
  notes: string[];
  createdAt: string;
}

export type CommChannel = "sms" | "email" | "internal" | "portal";

export interface CommThread {
  id: string;
  borrowerId: string;
  loanFileId: string;
  channel: CommChannel;
  subject: string;
  unreadCount: number;
  lastMessageAt: string;
  participantIds: string[];
  pinned: boolean;
  loanStage: string;
}

export interface CommMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  channel: CommChannel;
  isInternal: boolean;
  attachments: string[];
}

export interface CannedResponse {
  id: string;
  category: string;
  title: string;
  content: string;
}

export type TaskStatus = "To Do" | "In Progress" | "Waiting" | "Completed" | "Overdue";
export type TaskType = "follow_up_call" | "request_document" | "review_condition" | "send_update" | "milestone_check" | "borrower_follow_up" | "processor_review" | "internal_review";

export interface Task {
  id: string;
  title: string;
  description: string;
  borrowerId: string;
  loanFileId: string;
  assigneeId: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  type: TaskType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TimelineEventType =
  | "document_requested" | "document_uploaded" | "document_reviewed"
  | "document_accepted" | "document_revision_requested"
  | "esign_sent" | "esign_viewed" | "esign_completed"
  | "condition_created" | "condition_status_changed"
  | "task_created" | "task_completed"
  | "message_sent" | "message_received"
  | ActivityType;

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  detail: string;
  userId: string;
  timestamp: string;
  entityId: string;
  entityType: "lead" | "borrower" | "loan" | "document" | "esign" | "condition" | "task" | "message";
  linkedObjectId?: string;
}
