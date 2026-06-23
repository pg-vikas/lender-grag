export type StepId = 'recipients' | 'documents' | 'prepare' | 'email' | 'review';

export type RecipientRole = 'Signer' | 'CC' | 'Approver';

export type FieldType = 'signature' | 'initials' | 'dateSigned' | 'fullName' | 'email' | 'title' | 'text' | 'checkbox' | 'arrow';

export type Recipient = {
  id: string;
  name: string;
  email: string;
  role: RecipientRole;
  order: number;
  color: string;
};

export type DocumentFile = {
  id: string;
  name: string;
  sizeLabel: string;
  pageCount: number;
  url?: string;
};

export type PlacedField = {
  id: string;
  type: FieldType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  recipientId?: string;
  required: boolean;
  label: string;
  placeholder?: string;
  fontSize?: number;
  checked?: boolean;
};

export type EmailDetails = {
  subject: string;
  message: string;
  sendReminders: boolean;
  reminderFrequency: 'daily' | 'every2days' | 'weekly';
  expiresInDays: number;
};

export type WizardState = {
  currentStep: StepId;
  recipients: Recipient[];
  documents: DocumentFile[];
  placedFields: PlacedField[];
  selectedFieldId: string | null;
  activeRecipientId: string | null;
  emailDetails: EmailDetails;
  zoom: number;
};
