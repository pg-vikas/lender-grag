import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Camera, Eye, EyeOff, KeyRound, MailCheck, Trash2, User, X } from "lucide-react";
import { RichTextEditor, getRichTextPlainText } from "./RichTextEditor";

export const clientStatusOptions = [
  "Active",
  "Brand New",
  "Lead",
  "Nurture",
  "Suspended",
  "Hot",
  "Inactive",
];

export const loanPurposeOptions = [
  "Purchase",
  "Rate/Term Refinance",
  "Cash-Out Refinance",
  "Home Equity Loan",
];

export const propertyTypeOptions = [
  "Single Family",
  "Condominium",
  "Townhouse",
  "Multi-Family (2-4 Units)",
];

export type ClientEditFormData = {
  name: string;
  email: string;
  phone: string;
  industry: string;
  status: string;
  background: string;
  photoUrl: string;
  photoDataUrl: string;
  photoFileName: string;
  removePhoto: boolean;
  currentAddress: string;
  loanPurpose: string;
  propertyType: string;
  estimatedValue: string;
  downPayment: string;
  targetLoanAmount: string;
};

export function normalizeClientStatus(status?: string) {
  return status && clientStatusOptions.includes(status) ? status : "Brand New";
}

export function getDefaultClientEditFormData(): ClientEditFormData {
  return {
    name: "",
    email: "",
    phone: "",
    industry: "Mortgage Client",
    status: "Brand New",
    background: "",
    photoUrl: "",
    photoDataUrl: "",
    photoFileName: "",
    removePhoto: false,
    currentAddress: "",
    loanPurpose: "Purchase",
    propertyType: "Single Family",
    estimatedValue: "",
    downPayment: "",
    targetLoanAmount: "",
  };
}

export function getClientPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  return normalizedDigits.slice(0, 10);
}

export function formatClientPhoneNumber(value: string) {
  const digits = getClientPhoneDigits(value);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const isValidClientEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
const maxClientPhotoSize = 3 * 1024 * 1024;
const allowedClientPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function getFriendlyClientPhotoValidationError(file: File) {
  if (!allowedClientPhotoTypes.has(file.type)) {
    return "Please upload a JPG, PNG, or WebP image file.";
  }

  if (file.size > maxClientPhotoSize) {
    return "Client photo must be 3 MB or less.";
  }

  return "";
}

export function validateClientEditForm(data: ClientEditFormData) {
  if (data.name.trim().length < 2) {
    return "Please enter the client name before saving.";
  }

  if (!data.email.trim()) {
    return "Please enter the client email address.";
  }

  if (!isValidClientEmail(data.email)) {
    return "Please enter a valid client email address.";
  }

  if (!data.phone.trim()) {
    return "Please enter the client phone number.";
  }

  if (getClientPhoneDigits(data.phone).length !== 10) {
    return "Please enter a valid 10-digit client phone number.";
  }

  if (!clientStatusOptions.includes(data.status)) {
    return "Please choose a valid client status.";
  }

  if (getRichTextPlainText(data.background).length > 5000) {
    return "Background must be 5,000 characters or less.";
  }

  return "";
}

export function validateClientCreateForm(data: ClientEditFormData, password: string) {
  const profileMessage = validateClientEditForm(data);
  if (profileMessage) {
    return profileMessage;
  }

  if (!password.trim()) {
    return "Please enter a password for the client.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
}

export function getFriendlyClientSaveError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (/email.*already exists/i.test(message)) {
    return "Another client already uses this email address. Please use a different email.";
  }

  if (/password/i.test(message)) {
    return "Password must be at least 8 characters.";
  }

  if (/valid email|email address/i.test(message)) {
    return "Please enter a valid client email address.";
  }

  if (/photo|jpg|png|webp|image|3 mb|3MB/i.test(message)) {
    return "Please upload a valid JPG, PNG, or WebP photo under 3 MB.";
  }

  if (/10-digit|phone/i.test(message)) {
    return "Please enter a valid 10-digit client phone number.";
  }

  if (/client name|name is required/i.test(message)) {
    return "Please enter the client name before saving.";
  }

  if (/status/i.test(message)) {
    return "Please choose a valid client status.";
  }

  if (/not found/i.test(message)) {
    return "This client could not be found. Refresh the page and try again.";
  }

  return "We couldn’t save the client profile. Please check the details and try again.";
}

type EditClientProfileModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  clientData: ClientEditFormData;
  setClientData: Dispatch<SetStateAction<ClientEditFormData>>;
  isSaving: boolean;
  errorMessage: string;
  isEditorEnabled?: boolean;
  setIsEditorEnabled?: Dispatch<SetStateAction<boolean>>;
  password?: string;
  setPassword?: Dispatch<SetStateAction<string>>;
  sendWelcomeEmail?: boolean;
  setSendWelcomeEmail?: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onSave: () => void;
};

export function EditClientProfileModal({
  isOpen,
  mode = "edit",
  clientData,
  setClientData,
  isSaving,
  errorMessage,
  password = "",
  setPassword,
  sendWelcomeEmail = false,
  setSendWelcomeEmail,
  onClose,
  onSave,
}: EditClientProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhotoError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isCreateMode = mode === "create";
  const title = isCreateMode ? "New Client" : "Edit Client Profile";
  const saveLabel = isCreateMode ? "Create Client" : "Save Changes";
  const savingLabel = isCreateMode ? "Creating..." : "Saving...";

  const updateClientField = (field: keyof ClientEditFormData, value: string) => {
    setClientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    updateClientField("phone", formatClientPhoneNumber(value));
  };

  const previewPhotoUrl = clientData.photoDataUrl || (!clientData.removePhoto ? clientData.photoUrl : "");

  const handlePhotoChange = (file?: File) => {
    setPhotoError("");

    if (!file) {
      return;
    }

    const validationError = getFriendlyClientPhotoValidationError(file);

    if (validationError) {
      setPhotoError(validationError);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      if (!result.startsWith("data:image/")) {
        setPhotoError("Please choose a valid client photo.");
        return;
      }

      setClientData((prev) => ({
        ...prev,
        photoDataUrl: result,
        photoFileName: file.name,
        removePhoto: false,
      }));
    };

    reader.onerror = () => {
      setPhotoError("We couldn't read that image. Please choose a different photo.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoError("");
    setClientData((prev) => ({
      ...prev,
      photoDataUrl: "",
      photoFileName: "",
      photoUrl: prev.photoDataUrl ? prev.photoUrl : "",
      removePhoto: Boolean(prev.photoUrl),
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-profile-modal-title"
    >
      <div
        className="bg-slate-900 border border-slate-600 bg-slate-950 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 id="client-profile-modal-title" className="text-xl font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={`Close ${title}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {errorMessage && (
            <div
              data-testid="text-client-profile-error"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200"
            >
              {errorMessage}
            </div>
          )}

          <section className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-800 pb-2">Client Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Client Photo</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="w-32 h-32 bg-slate-950 border border-slate-600 rounded-xl text-white flex items-center justify-center overflow-hidden shadow-inner">
                    {previewPhotoUrl ? (
                      <img
                        src={previewPhotoUrl}
                        alt={`${clientData.name || "Client"} photo preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        handlePhotoChange(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white rounded-lg transition-colors border border-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Camera className="w-4 h-4" />
                        {previewPhotoUrl ? "Change Photo" : "Upload Photo"}
                      </button>
                      {previewPhotoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-sm font-medium text-rose-200 rounded-lg transition-colors border border-rose-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">JPG, PNG, or WebP only. Max size 3 MB.</p>
                    {clientData.photoFileName && !photoError && (
                      <p className="text-xs text-emerald-300">Selected: {clientData.photoFileName}</p>
                    )}
                    {photoError && (
                      <p className="text-xs font-medium text-rose-300" data-testid="text-client-photo-error">{photoError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Client Name*</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(event) => updateClientField("name", event.target.value)}
                    required
                    aria-required="true"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address*</label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(event) => updateClientField("email", event.target.value)}
                    placeholder="client@example.com"
                    required
                    aria-required="true"
                    className="w-full px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-indigo-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number*</label>
                  <div className="flex">
                    <select
                      className="px-3 py-2.5 bg-slate-950 border border-slate-600 border-r-0 rounded-l-xl text-sm text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all w-20"
                      aria-label="Phone country code"
                    >
                      <option>+1</option>
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={clientData.phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      onPaste={(event) => {
                        event.preventDefault();
                        handlePhoneChange(event.clipboardData.getData("text"));
                      }}
                      placeholder="(231) 231-2312"
                      maxLength={14}
                      pattern="\(\d{3}\) \d{3}-\d{4}"
                      required
                      aria-required="true"
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-r-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {isCreateMode && (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <KeyRound className="w-4 h-4 text-purple-300" />
                    Account Access
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Password*</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) => setPassword?.(event.target.value)}
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          required
                          aria-required="true"
                          autoComplete="new-password"
                          className="w-full px-4 py-2.5 pr-11 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          disabled={isSaving}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Password must be at least 8 characters.</p>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setSendWelcomeEmail?.((value) => !value)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                          sendWelcomeEmail
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                            : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                        }`}
                        aria-pressed={sendWelcomeEmail}
                      >
                        <span className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 font-semibold">
                            <MailCheck className="w-4 h-4" />
                            Send welcome mail
                          </span>
                          <span className={`relative h-6 w-11 rounded-full transition-colors ${sendWelcomeEmail ? "bg-emerald-500" : "bg-slate-700"}`}>
                            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${sendWelcomeEmail ? "translate-x-6" : "translate-x-1"}`} />
                          </span>
                        </span>
                        <span className="mt-2 block text-xs text-slate-400">
                          Email will include the client email address and password.
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Address</label>
                  <input
                    type="text"
                    value={clientData.currentAddress}
                    onChange={(event) => updateClientField("currentAddress", event.target.value)}
                    placeholder="Enter current address"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={clientData.status}
                    onChange={(event) => updateClientField("status", event.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                  >
                    {clientStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-800 pb-2">Loan Goals</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Loan Purpose</label>
                <select
                  value={clientData.loanPurpose}
                  onChange={(event) => updateClientField("loanPurpose", event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  {loanPurposeOptions.map((purpose) => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Property Type</label>
                <select
                  value={clientData.propertyType}
                  onChange={(event) => updateClientField("propertyType", event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
                >
                  {propertyTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Value / Purchase Price</label>
                <input
                  type="text"
                  value={clientData.estimatedValue}
                  onChange={(event) => updateClientField("estimatedValue", event.target.value)}
                  placeholder="$"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Down Payment / Equity</label>
                <input
                  type="text"
                  value={clientData.downPayment}
                  onChange={(event) => updateClientField("downPayment", event.target.value)}
                  placeholder="$ or %"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Loan Amount</label>
                <input
                  type="text"
                  value={clientData.targetLoanAmount}
                  onChange={(event) => updateClientField("targetLoanAmount", event.target.value)}
                  placeholder="$"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <RichTextEditor
                label="Background"
                value={clientData.background}
                onChange={(value) => updateClientField("background", value)}
                placeholder="Enter client background information..."
                minHeightClassName="min-h-[220px]"
                footerText="Background will be saved with the client profile."
                disabled={isSaving}
              />
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-600 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? savingLabel : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
