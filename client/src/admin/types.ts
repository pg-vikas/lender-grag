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

export type AutomationStatus = "Active" | "Draft" | "Paused" | "Failed";
export type AutomationTrigger = "lead_created" | "no_contact_timeout" | "lead_status_changed" | "application_started" | "application_abandoned" | "document_uploaded" | "document_revision_needed" | "condition_created" | "condition_overdue" | "loan_stage_changed" | "esign_sent" | "esign_completed" | "closing_approaching" | "file_inactive" | "borrower_birthday" | "loan_anniversary";
export type AutomationAction = "assign_user" | "create_task" | "send_sms" | "send_email" | "send_portal_notification" | "add_tag" | "update_status" | "move_stage" | "notify_manager" | "create_condition" | "request_document" | "create_alert";
export type AutomationModule = "leads" | "borrowers" | "pipeline" | "documents" | "esign" | "conditions" | "communications" | "tasks";

export interface Automation {
  id: string;
  name: string;
  triggerType: AutomationTrigger;
  actionTypes: AutomationAction[];
  status: AutomationStatus;
  ownerId: string;
  module: AutomationModule;
  createdAt: string;
  lastRunAt: string | null;
  runCount: number;
  description: string;
  stepCount: number;
  isTemplate?: boolean;
}

export type ComplianceFlagType = "missing_disclosure" | "unsigned_document" | "overdue_condition" | "stale_file" | "missing_assignee" | "missing_milestone_date" | "missing_critical_document" | "lock_expiration_risk";
export type ComplianceSeverity = "critical" | "high" | "medium" | "low";
export type ComplianceFlagStatus = "Open" | "In Review" | "Resolved" | "Dismissed";

export interface ComplianceFlag {
  id: string;
  loanFileId: string;
  borrowerId: string;
  type: ComplianceFlagType;
  severity: ComplianceSeverity;
  status: ComplianceFlagStatus;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string | null;
  assignedTo: string;
  resolvedAt: string | null;
}

export interface AuditEvent {
  id: string;
  type: string;
  description: string;
  userId: string;
  loanFileId: string | null;
  timestamp: string;
  module: string;
}

export interface ReportPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  lastViewed: string | null;
  isFavorite: boolean;
}

export interface PricingScenarioInput {
  loanType: string;
  purpose: string;
  ficoBucket: string;
  ltv: number;
  occupancy: string;
  propertyType: string;
  loanAmount: number;
  term: number;
  lockTerm: number;
}

export interface PricingResult {
  productId: string;
  productName: string;
  rate: number;
  points: number;
  estimatedPayment: number;
  fitNotes: string;
  eligible: boolean;
}

export interface PricingScenario {
  id: string;
  loanFileId: string;
  borrowerId: string;
  inputs: PricingScenarioInput;
  comparedProducts: PricingResult[];
  selectedProductId: string | null;
  lockDate: string | null;
  lockExpiration: string | null;
  notes: string;
  createdAt: string;
}

export interface LockRecord {
  id: string;
  borrowerId: string;
  loanFileId: string;
  productId: string;
  productName: string;
  rate: number;
  lockDate: string;
  lockExpiration: string;
  daysRemaining: number;
  status: "Active" | "Expiring" | "Expired" | "Extended";
}

export interface MortgageProduct {
  id: string;
  name: string;
  category: string;
  active: boolean;
  minFico: number;
  maxLtv: number;
  occupancyAllowed: string[];
  propertyTypesAllowed: string[];
  overlays: string[];
  talkingPoints: string[];
  updatedAt: string;
}

export type TeamRole = "Loan Officer" | "Processor" | "Branch Manager" | "Admin" | "Executive";
export type TeamStatus = "Active" | "Inactive" | "Suspended";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  branchId: string;
  activeLeadCount: number;
  activeFileCount: number;
  responseTime: number;
  fundedVolume: number;
  status: TeamStatus;
  permissionsSetId: string;
  avatar?: string;
}

export interface PermissionSet {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

export type ExecutiveAlertSeverity = "critical" | "warning" | "info";

export interface ExecutiveAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: ExecutiveAlertSeverity;
  module: string;
  impactedCount: number;
  createdAt: string;
  dismissed: boolean;
}
