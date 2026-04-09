import type {
  Automation, ComplianceFlag, AuditEvent, ReportPreset, PricingScenario, LockRecord,
  MortgageProduct, TeamMember, PermissionSet, ExecutiveAlert
} from "../types";

export const automations: Automation[] = [
  { id: "aut-1", name: "New Lead Immediate Follow-Up", triggerType: "lead_created", actionTypes: ["create_task", "send_sms"], status: "Active", ownerId: "lo-1", module: "leads", createdAt: "2026-03-01T09:00:00Z", lastRunAt: "2026-04-09T08:00:00Z", runCount: 47, description: "Sends welcome SMS and creates follow-up call task within 5 minutes of new lead", stepCount: 3 },
  { id: "aut-2", name: "Stale Lead Escalation", triggerType: "no_contact_timeout", actionTypes: ["notify_manager", "add_tag", "create_alert"], status: "Active", ownerId: "lo-1", module: "leads", createdAt: "2026-03-05T09:00:00Z", lastRunAt: "2026-04-09T06:00:00Z", runCount: 23, description: "Escalates lead to manager if no contact after 24 hours", stepCount: 4 },
  { id: "aut-3", name: "Missing Document Reminder", triggerType: "condition_created", actionTypes: ["send_email", "create_task"], status: "Active", ownerId: "pr-1", module: "documents", createdAt: "2026-03-10T09:00:00Z", lastRunAt: "2026-04-08T14:00:00Z", runCount: 31, description: "Sends borrower reminder when document request is created", stepCount: 2 },
  { id: "aut-4", name: "Condition Overdue Alert", triggerType: "condition_overdue", actionTypes: ["create_alert", "notify_manager", "send_email"], status: "Active", ownerId: "pr-1", module: "conditions", createdAt: "2026-03-12T09:00:00Z", lastRunAt: "2026-04-08T10:00:00Z", runCount: 8, description: "Alerts team and manager when any condition passes due date", stepCount: 3 },
  { id: "aut-5", name: "Milestone Status Update", triggerType: "loan_stage_changed", actionTypes: ["send_sms", "send_email"], status: "Active", ownerId: "lo-1", module: "pipeline", createdAt: "2026-03-15T09:00:00Z", lastRunAt: "2026-04-08T11:00:00Z", runCount: 18, description: "Sends borrower update when loan moves to new stage", stepCount: 2 },
  { id: "aut-6", name: "Closing Prep Reminder", triggerType: "closing_approaching", actionTypes: ["send_email", "create_task", "send_sms"], status: "Active", ownerId: "lo-4", module: "pipeline", createdAt: "2026-03-20T09:00:00Z", lastRunAt: "2026-04-06T09:00:00Z", runCount: 5, description: "Reminds borrower 7 days before closing with prep checklist", stepCount: 4 },
  { id: "aut-7", name: "E-Sign Completion Follow-Up", triggerType: "esign_completed", actionTypes: ["update_status", "create_task"], status: "Draft", ownerId: "lo-2", module: "esign", createdAt: "2026-04-05T09:00:00Z", lastRunAt: null, runCount: 0, description: "Updates loan status and creates review task when e-sign package is completed", stepCount: 3 },
  { id: "aut-8", name: "Post-Close Follow-Up", triggerType: "loan_stage_changed", actionTypes: ["send_email", "create_task", "add_tag"], status: "Paused", ownerId: "lo-1", module: "pipeline", createdAt: "2026-03-25T09:00:00Z", lastRunAt: "2026-04-01T09:00:00Z", runCount: 3, description: "Sends thank you and review request 7 days after funding", stepCount: 5 },
  { id: "aut-9", name: "Application Abandoned Recovery", triggerType: "application_abandoned", actionTypes: ["send_sms", "create_task", "notify_manager"], status: "Active", ownerId: "lo-1", module: "leads", createdAt: "2026-04-01T09:00:00Z", lastRunAt: "2026-04-07T15:00:00Z", runCount: 6, description: "Triggers recovery outreach if application started but not completed in 48 hours", stepCount: 4 },
  { id: "aut-10", name: "Document Upload Acknowledgment", triggerType: "document_uploaded", actionTypes: ["send_sms", "create_task"], status: "Draft", ownerId: "pr-1", module: "documents", createdAt: "2026-04-08T09:00:00Z", lastRunAt: null, runCount: 0, description: "Confirms receipt and creates processor review task on upload", stepCount: 2 },
];

export const automationTemplates: Automation[] = [
  { id: "atpl-1", name: "New Lead Immediate Follow-Up", triggerType: "lead_created", actionTypes: ["create_task", "send_sms"], status: "Draft", ownerId: "", module: "leads", createdAt: "", lastRunAt: null, runCount: 0, description: "Send welcome SMS + create call task within 5 minutes", stepCount: 3, isTemplate: true },
  { id: "atpl-2", name: "Stale Lead Escalation", triggerType: "no_contact_timeout", actionTypes: ["notify_manager", "add_tag"], status: "Draft", ownerId: "", module: "leads", createdAt: "", lastRunAt: null, runCount: 0, description: "Escalate after 24h no contact", stepCount: 4, isTemplate: true },
  { id: "atpl-3", name: "Missing Document Reminder", triggerType: "condition_created", actionTypes: ["send_email", "create_task"], status: "Draft", ownerId: "", module: "documents", createdAt: "", lastRunAt: null, runCount: 0, description: "Auto-remind borrower for missing docs", stepCount: 2, isTemplate: true },
  { id: "atpl-4", name: "Condition Overdue Alert", triggerType: "condition_overdue", actionTypes: ["create_alert", "notify_manager"], status: "Draft", ownerId: "", module: "conditions", createdAt: "", lastRunAt: null, runCount: 0, description: "Alert team on overdue conditions", stepCount: 3, isTemplate: true },
  { id: "atpl-5", name: "Milestone Update to Borrower", triggerType: "loan_stage_changed", actionTypes: ["send_sms", "send_email"], status: "Draft", ownerId: "", module: "pipeline", createdAt: "", lastRunAt: null, runCount: 0, description: "Notify borrower on stage change", stepCount: 2, isTemplate: true },
  { id: "atpl-6", name: "Closing Prep Reminder", triggerType: "closing_approaching", actionTypes: ["send_email", "create_task"], status: "Draft", ownerId: "", module: "pipeline", createdAt: "", lastRunAt: null, runCount: 0, description: "7-day closing prep checklist", stepCount: 4, isTemplate: true },
  { id: "atpl-7", name: "Post-Close Follow-Up", triggerType: "loan_stage_changed", actionTypes: ["send_email", "add_tag"], status: "Draft", ownerId: "", module: "pipeline", createdAt: "", lastRunAt: null, runCount: 0, description: "Thank you + review request after funding", stepCount: 3, isTemplate: true },
];

export const complianceFlags: ComplianceFlag[] = [
  { id: "cf-1", loanFileId: "ln-1", borrowerId: "bw-1", type: "missing_critical_document", severity: "high", status: "Open", title: "Missing Tax Returns", description: "2024 federal tax returns not yet uploaded — required for processing", createdAt: "2026-04-05T10:00:00Z", dueDate: "2026-04-12", assignedTo: "pr-1", resolvedAt: null },
  { id: "cf-2", loanFileId: "ln-2", borrowerId: "bw-2", type: "lock_expiration_risk", severity: "critical", status: "Open", title: "Rate Lock Expiring", description: "Rate lock expires 4/12 — 3 days remaining, conditions still outstanding", createdAt: "2026-04-08T09:00:00Z", dueDate: "2026-04-12", assignedTo: "lo-2", resolvedAt: null },
  { id: "cf-3", loanFileId: "ln-2", borrowerId: "bw-2", type: "unsigned_document", severity: "medium", status: "In Review", title: "Unsigned Conditional Approval", description: "Conditional approval letter sent but not yet fully signed", createdAt: "2026-04-08T15:00:00Z", dueDate: "2026-04-11", assignedTo: "lo-2", resolvedAt: null },
  { id: "cf-4", loanFileId: "ln-6", borrowerId: "bw-6", type: "overdue_condition", severity: "critical", status: "Open", title: "FHA Case Number Overdue", description: "FHA case number assignment overdue since 4/7", createdAt: "2026-04-08T10:00:00Z", dueDate: "2026-04-07", assignedTo: "pr-2", resolvedAt: null },
  { id: "cf-5", loanFileId: "ln-6", borrowerId: "bw-6", type: "stale_file", severity: "high", status: "Open", title: "File Aging in Stage", description: "Application Submitted for 7+ days without movement", createdAt: "2026-04-09T06:00:00Z", dueDate: null, assignedTo: "lo-2", resolvedAt: null },
  { id: "cf-6", loanFileId: "ln-1", borrowerId: "bw-1", type: "missing_disclosure", severity: "medium", status: "Open", title: "Missing Privacy Notice", description: "Initial privacy notice disclosure not yet acknowledged", createdAt: "2026-04-07T09:00:00Z", dueDate: "2026-04-14", assignedTo: "lo-1", resolvedAt: null },
  { id: "cf-7", loanFileId: "ln-3", borrowerId: "bw-3", type: "missing_milestone_date", severity: "low", status: "Resolved", title: "Missing UW Submit Date", description: "Underwriting submission date was missing — now recorded", createdAt: "2026-04-06T09:00:00Z", dueDate: null, assignedTo: "pr-2", resolvedAt: "2026-04-07T16:00:00Z" },
  { id: "cf-8", loanFileId: "ln-4", borrowerId: "bw-4", type: "missing_critical_document", severity: "high", status: "Open", title: "Missing Gift Letter", description: "Gift funds documentation required for down payment verification", createdAt: "2026-04-09T08:30:00Z", dueDate: "2026-04-16", assignedTo: "lo-1", resolvedAt: null },
  { id: "cf-9", loanFileId: "ln-5", borrowerId: "bw-5", type: "unsigned_document", severity: "medium", status: "Open", title: "Closing Disclosure Draft", description: "Closing disclosure drafted but not yet sent for signature", createdAt: "2026-04-09T09:00:00Z", dueDate: "2026-04-11", assignedTo: "lo-4", resolvedAt: null },
];

export const auditEvents: AuditEvent[] = [
  { id: "ae-1", type: "document_reviewed", description: "Jessica reviewed W-2 Form — Accepted", userId: "pr-1", loanFileId: "ln-1", timestamp: "2026-04-04T09:00:00Z", module: "documents" },
  { id: "ae-2", type: "esign_completed", description: "Natalie Cooper completed disclosure signing", userId: "bw-1", loanFileId: "ln-1", timestamp: "2026-04-02T16:00:00Z", module: "esign" },
  { id: "ae-3", type: "stage_updated", description: "Loan ln-2 moved to Conditional Approval", userId: "lo-2", loanFileId: "ln-2", timestamp: "2026-04-08T14:00:00Z", module: "pipeline" },
  { id: "ae-4", type: "condition_cleared", description: "Title commitment review cleared for Reed file", userId: "pr-1", loanFileId: "ln-2", timestamp: "2026-04-08T11:00:00Z", module: "conditions" },
  { id: "ae-5", type: "permission_changed", description: "Tom Nguyen granted compliance view access", userId: "lo-1", loanFileId: null, timestamp: "2026-04-07T10:00:00Z", module: "settings" },
  { id: "ae-6", type: "document_reviewed", description: "Amy reviewed Title Report — Accepted", userId: "pr-3", loanFileId: "ln-5", timestamp: "2026-04-02T10:00:00Z", module: "documents" },
  { id: "ae-7", type: "esign_sent", description: "Conditional approval letter sent to Marcus Reed", userId: "lo-2", loanFileId: "ln-2", timestamp: "2026-04-08T15:00:00Z", module: "esign" },
  { id: "ae-8", type: "stage_updated", description: "Loan ln-5 moved to Clear to Close", userId: "lo-4", loanFileId: "ln-5", timestamp: "2026-04-06T11:00:00Z", module: "pipeline" },
  { id: "ae-9", type: "condition_created", description: "Gift letter condition created for Adams file", userId: "lo-1", loanFileId: "ln-4", timestamp: "2026-04-09T08:30:00Z", module: "conditions" },
  { id: "ae-10", type: "document_uploaded", description: "Appraisal report uploaded for Reed file", userId: "lo-2", loanFileId: "ln-2", timestamp: "2026-04-08T09:00:00Z", module: "documents" },
];

export const reportPresets: ReportPreset[] = [
  { id: "rp-1", name: "Lead Source Performance", category: "Marketing", description: "Lead volume, conversion, and cost per lead by source", lastViewed: "2026-04-08", isFavorite: true },
  { id: "rp-2", name: "Contact Speed", category: "Operations", description: "Average time to first contact by LO and branch", lastViewed: "2026-04-09", isFavorite: true },
  { id: "rp-3", name: "Lead to Application Conversion", category: "Sales", description: "Conversion funnel from lead to submitted application", lastViewed: "2026-04-07", isFavorite: false },
  { id: "rp-4", name: "Application to Funded", category: "Sales", description: "Full pipeline conversion from application to funding", lastViewed: null, isFavorite: false },
  { id: "rp-5", name: "Volume by Branch", category: "Executive", description: "Monthly funded volume broken down by branch", lastViewed: "2026-04-09", isFavorite: true },
  { id: "rp-6", name: "Volume by Loan Officer", category: "Executive", description: "Individual LO production volume and counts", lastViewed: "2026-04-08", isFavorite: false },
  { id: "rp-7", name: "Pull Through Rate", category: "Operations", description: "Percentage of locks that fund successfully", lastViewed: null, isFavorite: false },
  { id: "rp-8", name: "Pipeline Aging", category: "Operations", description: "Files by days in current stage with aging alerts", lastViewed: "2026-04-09", isFavorite: true },
  { id: "rp-9", name: "Average Cycle Time", category: "Operations", description: "Days from application to funding by loan type", lastViewed: "2026-04-06", isFavorite: false },
  { id: "rp-10", name: "Partner Leaderboard", category: "Marketing", description: "Top referring real estate agents and partners", lastViewed: null, isFavorite: false },
  { id: "rp-11", name: "Task Completion", category: "Operations", description: "Task completion rates by assignee and type", lastViewed: "2026-04-08", isFavorite: false },
  { id: "rp-12", name: "Fallout Reasons", category: "Executive", description: "Why files fall out at each pipeline stage", lastViewed: null, isFavorite: false },
];

export const pricingScenarios: PricingScenario[] = [
  { id: "ps-1", loanFileId: "ln-1", borrowerId: "bw-1", inputs: { loanType: "Conventional", purpose: "Purchase", ficoBucket: "740-759", ltv: 80, occupancy: "Primary", propertyType: "SFR", loanAmount: 525000, term: 30, lockTerm: 45 }, comparedProducts: [
    { productId: "mp-1", productName: "Conv 30yr Fixed", rate: 6.375, points: 0, estimatedPayment: 3275, fitNotes: "Best fit — standard conventional", eligible: true },
    { productId: "mp-2", productName: "FHA 30yr Fixed", rate: 6.25, points: 0.5, estimatedPayment: 3232, fitNotes: "Lower rate but MIP required", eligible: true },
    { productId: "mp-4", productName: "Jumbo 30yr Fixed", rate: 6.75, points: 0, estimatedPayment: 3404, fitNotes: "Not needed — under conforming limit", eligible: false },
  ], selectedProductId: "mp-1", lockDate: "2026-04-03", lockExpiration: "2026-05-18", notes: "Standard conventional best fit for credit profile", createdAt: "2026-04-03T10:00:00Z" },
  { id: "ps-2", loanFileId: "ln-2", borrowerId: "bw-2", inputs: { loanType: "Jumbo", purpose: "Purchase", ficoBucket: "760+", ltv: 75, occupancy: "Primary", propertyType: "SFR", loanAmount: 1250000, term: 30, lockTerm: 30 }, comparedProducts: [
    { productId: "mp-4", productName: "Jumbo 30yr Fixed", rate: 6.75, points: 0, estimatedPayment: 8107, fitNotes: "Standard jumbo — good fit", eligible: true },
    { productId: "mp-1", productName: "Conv 30yr Fixed", rate: 6.375, points: 0, estimatedPayment: 0, fitNotes: "Exceeds conforming limit", eligible: false },
  ], selectedProductId: "mp-4", lockDate: "2026-03-28", lockExpiration: "2026-04-12", notes: "Rate lock expiring soon — extension may be needed", createdAt: "2026-03-28T10:00:00Z" },
  { id: "ps-3", loanFileId: "ln-5", borrowerId: "bw-5", inputs: { loanType: "Conventional", purpose: "Refinance", ficoBucket: "780+", ltv: 60, occupancy: "Primary", propertyType: "Condo", loanAmount: 380000, term: 30, lockTerm: 30 }, comparedProducts: [
    { productId: "mp-1", productName: "Conv 30yr Fixed", rate: 6.0, points: 0, estimatedPayment: 2278, fitNotes: "Excellent LTV and credit — best rate tier", eligible: true },
    { productId: "mp-8", productName: "Conv 15yr Fixed", rate: 5.5, points: 0, estimatedPayment: 3106, fitNotes: "Lower rate but higher payment", eligible: true },
  ], selectedProductId: "mp-1", lockDate: "2026-03-20", lockExpiration: "2026-04-19", notes: "Refi with great equity position", createdAt: "2026-03-20T10:00:00Z" },
];

export const lockRecords: LockRecord[] = [
  { id: "lk-1", borrowerId: "bw-1", loanFileId: "ln-1", productId: "mp-1", productName: "Conv 30yr Fixed", rate: 6.375, lockDate: "2026-04-03", lockExpiration: "2026-05-18", daysRemaining: 39, status: "Active" },
  { id: "lk-2", borrowerId: "bw-2", loanFileId: "ln-2", productId: "mp-4", productName: "Jumbo 30yr Fixed", rate: 6.75, lockDate: "2026-03-28", lockExpiration: "2026-04-12", daysRemaining: 3, status: "Expiring" },
  { id: "lk-3", borrowerId: "bw-3", loanFileId: "ln-3", productId: "mp-3", productName: "VA 30yr Fixed", rate: 5.875, lockDate: "2026-04-01", lockExpiration: "2026-05-01", daysRemaining: 22, status: "Active" },
  { id: "lk-4", borrowerId: "bw-5", loanFileId: "ln-5", productId: "mp-1", productName: "Conv 30yr Fixed", rate: 6.0, lockDate: "2026-03-20", lockExpiration: "2026-04-19", daysRemaining: 10, status: "Active" },
];

export const mortgageProducts: MortgageProduct[] = [
  { id: "mp-1", name: "Conventional 30yr Fixed", category: "Conventional", active: true, minFico: 620, maxLtv: 97, occupancyAllowed: ["Primary", "Second Home", "Investment"], propertyTypesAllowed: ["SFR", "Condo", "Townhome", "2-4 Unit"], overlays: ["Min 640 FICO for LTV >95%", "Max DTI 50% with AUS approval"], talkingPoints: ["Most common loan type", "PMI required below 80% LTV", "Flexible property types"], updatedAt: "2026-04-01" },
  { id: "mp-2", name: "FHA 30yr Fixed", category: "FHA", active: true, minFico: 580, maxLtv: 96.5, occupancyAllowed: ["Primary"], propertyTypesAllowed: ["SFR", "Condo (FHA approved)", "Townhome", "2-4 Unit"], overlays: ["MIP for life of loan", "Min 580 FICO for 96.5% LTV"], talkingPoints: ["Lower credit requirements", "Great for first-time buyers", "FHA-approved condos only"], updatedAt: "2026-04-01" },
  { id: "mp-3", name: "VA 30yr Fixed", category: "VA", active: true, minFico: 580, maxLtv: 100, occupancyAllowed: ["Primary"], propertyTypesAllowed: ["SFR", "Condo (VA approved)", "Townhome", "2-4 Unit"], overlays: ["COE required", "Funding fee unless exempt"], talkingPoints: ["No down payment", "No PMI", "Competitive rates for veterans"], updatedAt: "2026-03-15" },
  { id: "mp-4", name: "Jumbo 30yr Fixed", category: "Jumbo", active: true, minFico: 700, maxLtv: 85, occupancyAllowed: ["Primary", "Second Home"], propertyTypesAllowed: ["SFR", "Condo", "Townhome"], overlays: ["Min 12 months reserves", "Max DTI 43%"], talkingPoints: ["For loans above conforming limits", "Strong credit required", "Higher reserve requirements"], updatedAt: "2026-04-01" },
  { id: "mp-5", name: "HELOC", category: "HELOC", active: true, minFico: 680, maxLtv: 85, occupancyAllowed: ["Primary", "Second Home"], propertyTypesAllowed: ["SFR", "Condo", "Townhome"], overlays: ["Variable rate only", "10yr draw / 20yr repay"], talkingPoints: ["Flexible access to equity", "Interest-only during draw period", "Variable rate adjusts with prime"], updatedAt: "2026-03-20" },
  { id: "mp-6", name: "DSCR", category: "DSCR", active: true, minFico: 660, maxLtv: 80, occupancyAllowed: ["Investment"], propertyTypesAllowed: ["SFR", "2-4 Unit", "5+ Unit"], overlays: ["Min DSCR 1.0", "No personal income docs needed"], talkingPoints: ["Qualifies on property cash flow", "Great for investors", "No W2/tax return required"], updatedAt: "2026-03-25" },
  { id: "mp-7", name: "Bank Statement", category: "Non-QM", active: true, minFico: 660, maxLtv: 80, occupancyAllowed: ["Primary", "Investment"], propertyTypesAllowed: ["SFR", "Condo", "2-4 Unit"], overlays: ["12 or 24 month bank statements", "Self-employed only"], talkingPoints: ["For self-employed borrowers", "Uses bank deposits as income", "Flexible documentation"], updatedAt: "2026-04-05" },
  { id: "mp-8", name: "Conventional 15yr Fixed", category: "Conventional", active: true, minFico: 620, maxLtv: 97, occupancyAllowed: ["Primary", "Second Home", "Investment"], propertyTypesAllowed: ["SFR", "Condo", "Townhome", "2-4 Unit"], overlays: ["Same as 30yr conventional"], talkingPoints: ["Lower rate than 30yr", "Build equity faster", "Higher monthly payment"], updatedAt: "2026-04-01" },
];

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Greg Wynn", email: "greg@lendergreg.com", phone: "(619) 555-1234", role: "Executive", branchId: "br-1", activeLeadCount: 4, activeFileCount: 3, responseTime: 8, fundedVolume: 4200000, status: "Active", permissionsSetId: "perm-1" },
  { id: "tm-2", name: "Maria Santos", email: "maria@lendergreg.com", phone: "(619) 555-2345", role: "Loan Officer", branchId: "br-1", activeLeadCount: 3, activeFileCount: 2, responseTime: 12, fundedVolume: 3100000, status: "Active", permissionsSetId: "perm-2" },
  { id: "tm-3", name: "David Chen", email: "david@lendergreg.com", phone: "(858) 555-3456", role: "Loan Officer", branchId: "br-2", activeLeadCount: 2, activeFileCount: 1, responseTime: 15, fundedVolume: 2800000, status: "Active", permissionsSetId: "perm-2" },
  { id: "tm-4", name: "Sarah Kim", email: "sarah@lendergreg.com", phone: "(760) 555-4567", role: "Loan Officer", branchId: "br-3", activeLeadCount: 1, activeFileCount: 2, responseTime: 10, fundedVolume: 1900000, status: "Active", permissionsSetId: "perm-2" },
  { id: "tm-5", name: "Jessica Ramirez", email: "jessica@lendergreg.com", phone: "(619) 555-5678", role: "Processor", branchId: "br-1", activeLeadCount: 0, activeFileCount: 4, responseTime: 6, fundedVolume: 0, status: "Active", permissionsSetId: "perm-3" },
  { id: "tm-6", name: "Tom Nguyen", email: "tom@lendergreg.com", phone: "(858) 555-6789", role: "Processor", branchId: "br-2", activeLeadCount: 0, activeFileCount: 2, responseTime: 9, fundedVolume: 0, status: "Active", permissionsSetId: "perm-3" },
  { id: "tm-7", name: "Amy Park", email: "amy@lendergreg.com", phone: "(760) 555-7890", role: "Processor", branchId: "br-3", activeLeadCount: 0, activeFileCount: 1, responseTime: 7, fundedVolume: 0, status: "Active", permissionsSetId: "perm-3" },
  { id: "tm-8", name: "Mike Rodriguez", email: "mike@lendergreg.com", phone: "(619) 555-8901", role: "Branch Manager", branchId: "br-1", activeLeadCount: 0, activeFileCount: 0, responseTime: 0, fundedVolume: 0, status: "Active", permissionsSetId: "perm-4" },
  { id: "tm-9", name: "Lisa Chang", email: "lisa.c@lendergreg.com", phone: "(858) 555-9012", role: "Branch Manager", branchId: "br-2", activeLeadCount: 0, activeFileCount: 0, responseTime: 0, fundedVolume: 0, status: "Active", permissionsSetId: "perm-4" },
  { id: "tm-10", name: "Carlos Rivera", email: "carlos.r@lendergreg.com", phone: "(760) 555-0123", role: "Admin", branchId: "br-3", activeLeadCount: 0, activeFileCount: 0, responseTime: 0, fundedVolume: 0, status: "Inactive", permissionsSetId: "perm-5" },
];

export const permissionSets: PermissionSet[] = [
  { id: "perm-1", name: "Executive", description: "Full system access", permissions: { dashboard: true, crm: true, pipeline_edit: true, documents_review: true, esign_send: true, compliance_view: true, reports: true, settings: true, team_manage: true, executive: true } },
  { id: "perm-2", name: "Loan Officer", description: "Sales and pipeline access", permissions: { dashboard: true, crm: true, pipeline_edit: true, documents_review: false, esign_send: true, compliance_view: false, reports: true, settings: false, team_manage: false, executive: false } },
  { id: "perm-3", name: "Processor", description: "Operations and document access", permissions: { dashboard: true, crm: false, pipeline_edit: true, documents_review: true, esign_send: true, compliance_view: true, reports: false, settings: false, team_manage: false, executive: false } },
  { id: "perm-4", name: "Branch Manager", description: "Branch level management", permissions: { dashboard: true, crm: true, pipeline_edit: true, documents_review: true, esign_send: true, compliance_view: true, reports: true, settings: false, team_manage: true, executive: false } },
  { id: "perm-5", name: "Admin", description: "System administration", permissions: { dashboard: true, crm: true, pipeline_edit: true, documents_review: true, esign_send: true, compliance_view: true, reports: true, settings: true, team_manage: true, executive: false } },
];

export const executiveAlerts: ExecutiveAlert[] = [
  { id: "ea-1", type: "lock_expiration_risk", title: "Rate Lock Expiring — Reed File", description: "Jumbo lock for Marcus Reed expires in 3 days. Outstanding conditions may delay close.", severity: "critical", module: "pricing", impactedCount: 1, createdAt: "2026-04-09T06:00:00Z", dismissed: false },
  { id: "ea-2", type: "compliance_spike", title: "Compliance Flags Increasing", description: "6 open compliance flags across active files — up from 3 last week.", severity: "warning", module: "compliance", impactedCount: 6, createdAt: "2026-04-09T07:00:00Z", dismissed: false },
  { id: "ea-3", type: "stale_lead_surge", title: "Stale Leads Growing", description: "4 leads have not been contacted in 48+ hours. Response time deteriorating.", severity: "warning", module: "leads", impactedCount: 4, createdAt: "2026-04-09T06:30:00Z", dismissed: false },
  { id: "ea-4", type: "branch_underperformance", title: "Carlsbad Branch Below Target", description: "Carlsbad branch funded volume 35% below monthly target.", severity: "warning", module: "branches", impactedCount: 1, createdAt: "2026-04-08T09:00:00Z", dismissed: false },
  { id: "ea-5", type: "conditions_backlog", title: "Conditions Backlog", description: "8 outstanding conditions across 4 files. 2 are overdue.", severity: "warning", module: "conditions", impactedCount: 8, createdAt: "2026-04-09T08:00:00Z", dismissed: false },
  { id: "ea-6", type: "conversion_drop", title: "Lead Conversion Declined", description: "Lead-to-application conversion dropped 12% this week compared to last.", severity: "info", module: "reports", impactedCount: 0, createdAt: "2026-04-09T07:30:00Z", dismissed: false },
  { id: "ea-7", type: "unsigned_docs_backlog", title: "E-Sign Packages Pending", description: "3 e-sign packages have been viewed but not completed.", severity: "info", module: "esign", impactedCount: 3, createdAt: "2026-04-09T08:30:00Z", dismissed: true },
];

export const volumeTrendData = [
  { month: "Oct", funded: 2100000, pipeline: 3200000, applications: 12 },
  { month: "Nov", funded: 2800000, pipeline: 3500000, applications: 15 },
  { month: "Dec", funded: 1900000, pipeline: 2800000, applications: 10 },
  { month: "Jan", funded: 3200000, pipeline: 4100000, applications: 18 },
  { month: "Feb", funded: 3800000, pipeline: 4500000, applications: 20 },
  { month: "Mar", funded: 4500000, pipeline: 5200000, applications: 22 },
  { month: "Apr", funded: 2200000, pipeline: 6100000, applications: 14 },
];

export const branchPerformanceData = [
  { branch: "San Diego Main", volume: 7300000, conversion: 68, responseTime: 10, openFlags: 4, leads: 14, files: 8 },
  { branch: "La Jolla", volume: 2800000, conversion: 72, responseTime: 15, openFlags: 1, leads: 5, files: 2 },
  { branch: "Carlsbad", volume: 1900000, conversion: 58, responseTime: 10, openFlags: 1, leads: 3, files: 3 },
];

export const leadSourceData = [
  { source: "Zillow", leads: 18, converted: 5, convRate: 28, avgSpeed: 12 },
  { source: "Google Ads", leads: 14, converted: 3, convRate: 21, avgSpeed: 18 },
  { source: "Referral", leads: 12, converted: 7, convRate: 58, avgSpeed: 6 },
  { source: "Website", leads: 8, converted: 1, convRate: 13, avgSpeed: 24 },
  { source: "Yelp", leads: 6, converted: 2, convRate: 33, avgSpeed: 14 },
];

export const riskTrendData = [
  { week: "W1", critical: 1, high: 2, medium: 3, low: 1 },
  { week: "W2", critical: 0, high: 3, medium: 2, low: 2 },
  { week: "W3", critical: 2, high: 2, medium: 4, low: 1 },
  { week: "W4", critical: 1, high: 4, medium: 3, low: 0 },
  { week: "W5", critical: 2, high: 3, medium: 2, low: 1 },
];
