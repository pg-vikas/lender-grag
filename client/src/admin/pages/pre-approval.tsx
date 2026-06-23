import { useState, useEffect } from "react";
import { Sidebar, Header } from "./clients";
import { useLocation } from "wouter";
import { 
  Search, Filter, Plus, FileText, History, FileCheck, Info,
  AlertTriangle, Mail, Download, Check, X, Building2, User,
  Calendar, DollarSign, Edit, ChevronDown, CheckCircle2, Copy
} from "lucide-react";
import { Button } from "@/admin/components/ui/button";

// --- Mock Data ---
type LoanType = 'Conventional' | 'FHA' | 'VA' | 'Jumbo';
type Status = 'Active' | 'Expiring Soon' | 'Expired' | 'Draft' | 'Archived';

interface Borrower {
  id: string;
  name: string;
  coBorrower?: string;
  email: string;
  phone: string;
  agent: string;
  status: Status;
  loanType: LoanType;
  maxPurchasePrice: number;
  maxLoanAmount: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  interestRate?: number;
  termLength?: number;
  lastUpdated: string;
  expirationDate: string;
  occupancyType: string;
  propertyType: string;
  notes?: string;
}

const mockBorrowers: Borrower[] = [
  {
    id: "B-1001", name: "Michael Johnson", coBorrower: "Sarah Johnson", email: "mjohnson@example.com", phone: "(555) 123-4567",
    agent: "Elena Rostova", status: "Active", loanType: "Conventional", maxPurchasePrice: 650000, maxLoanAmount: 520000,
    downPaymentAmount: 130000, downPaymentPercent: 20, interestRate: 6.875, termLength: 360,
    lastUpdated: "2026-04-09", expirationDate: "2026-07-09", occupancyType: "Primary Residence", propertyType: "Single Family",
    notes: "Strong credit profile. Cleared to issue letters up to max amount without further review."
  },
  {
    id: "B-1002", name: "David Chen", email: "dchen@example.com", phone: "(555) 987-6543",
    agent: "Marcus Cole", status: "Expiring Soon", loanType: "FHA", maxPurchasePrice: 425000, maxLoanAmount: 410125,
    downPaymentAmount: 14875, downPaymentPercent: 3.5, interestRate: 6.5, termLength: 360,
    lastUpdated: "2026-01-15", expirationDate: "2026-04-15", occupancyType: "Primary Residence", propertyType: "Townhouse"
  },
  {
    id: "B-1003", name: "Emily Davis & Robert Davis", email: "edavis@example.com", phone: "(555) 456-7890",
    agent: "Sarah Jenkins", status: "Active", loanType: "Jumbo", maxPurchasePrice: 1250000, maxLoanAmount: 1000000,
    downPaymentAmount: 250000, downPaymentPercent: 20, interestRate: 7.125, termLength: 360,
    lastUpdated: "2026-03-22", expirationDate: "2026-06-22", occupancyType: "Primary Residence", propertyType: "Single Family"
  },
  {
    id: "B-1004", name: "James Wilson", email: "jw@example.com", phone: "(555) 222-3333",
    agent: "Elena Rostova", status: "Expired", loanType: "VA", maxPurchasePrice: 550000, maxLoanAmount: 550000,
    downPaymentAmount: 0, downPaymentPercent: 0, interestRate: 6.25, termLength: 360,
    lastUpdated: "2025-11-10", expirationDate: "2026-02-10", occupancyType: "Primary Residence", propertyType: "Condo",
    notes: "Client decided to pause search until spring."
  },
  {
    id: "B-1005", name: "Amanda Martinez", email: "amartinez@example.com", phone: "(555) 777-8888",
    agent: "Marcus Cole", status: "Draft", loanType: "Conventional", maxPurchasePrice: 750000, maxLoanAmount: 600000,
    downPaymentAmount: 150000, downPaymentPercent: 20,
    lastUpdated: "2026-04-10", expirationDate: "2026-07-10", occupancyType: "Investment", propertyType: "Multi-Family (2-4)"
  },
  {
    id: "B-1006", name: "Thomas Anderson", coBorrower: "Lisa Anderson", email: "tanderson@example.com", phone: "(555) 444-5555",
    agent: "Sarah Jenkins", status: "Active", loanType: "Conventional", maxPurchasePrice: 850000, maxLoanAmount: 765000,
    downPaymentAmount: 85000, downPaymentPercent: 10, interestRate: 6.99, termLength: 360,
    lastUpdated: "2026-04-01", expirationDate: "2026-07-01", occupancyType: "Primary Residence", propertyType: "Single Family"
  },
  {
    id: "B-1007", name: "Jessica Taylor", email: "jtaylor@example.com", phone: "(555) 666-7777",
    agent: "Elena Rostova", status: "Archived", loanType: "Conventional", maxPurchasePrice: 500000, maxLoanAmount: 400000,
    downPaymentAmount: 100000, downPaymentPercent: 20,
    lastUpdated: "2025-08-20", expirationDate: "2025-11-20", occupancyType: "Primary Residence", propertyType: "Single Family",
    notes: "Purchased home in Oct 2025. Closed."
  },
  {
    id: "B-1008", name: "Brian Clark", email: "bclark@example.com", phone: "(555) 999-0000",
    agent: "Marcus Cole", status: "Expiring Soon", loanType: "VA", maxPurchasePrice: 600000, maxLoanAmount: 600000,
    downPaymentAmount: 0, downPaymentPercent: 0, interestRate: 6.25, termLength: 360,
    lastUpdated: "2026-01-18", expirationDate: "2026-04-18", occupancyType: "Primary Residence", propertyType: "Single Family"
  }
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// --- Components ---

const StatusPill = ({ status }: { status: Status }) => {
  const styles = {
    'Active': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'Expiring Soon': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'Expired': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    'Draft': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    'Archived': 'text-slate-500 bg-slate-800 border-slate-700'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function PreApprovalModule() {
  const [location] = useLocation();
  
  // Extract id and action from search params
  const searchParams = new URLSearchParams(window.location.search);
  const initialId = searchParams.get('id');
  const initialAction = searchParams.get('action');

  const [openMenus, setOpenMenus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Find borrower by name if id is provided (since we passed name in the URL from home)
  const initialBorrower = initialId ? mockBorrowers.find(b => b.name === initialId) : null;
  
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(initialBorrower ? initialBorrower.id : null);
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'history' | 'documents'>('generate');
  
  // Letter Generation Form State
  const [letterData, setLetterData] = useState<any>({});
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showRate, setShowRate] = useState(false);
  const [letterTemplate, setLetterTemplate] = useState('Conventional Standard');
  const [specialConditions, setSpecialConditions] = useState('');
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(initialAction === 'send');
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailBcc, setEmailBcc] = useState('');
  const [showAdditionalEmails, setShowAdditionalEmails] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [includeSms, setIncludeSms] = useState(false);
  
  const selectedBorrower = mockBorrowers.find(b => b.id === selectedBorrowerId);

  useEffect(() => {
    if (selectedBorrower) {
      setLetterData({
        date: new Date().toISOString().split('T')[0],
        purchasePrice: selectedBorrower.maxPurchasePrice,
        loanAmount: selectedBorrower.maxLoanAmount,
        propertyAddress: 'TBD',
        loanProgram: selectedBorrower.loanType,
        salutation: `Dear ${selectedBorrower.name}${selectedBorrower.coBorrower ? ` and ${selectedBorrower.coBorrower}` : ''},`
      });
      setOverrideEnabled(false);
      setEmailTo(selectedBorrower.email);
      setEmailSubject(`Pre-Approval Letter - ${selectedBorrower.name}`);
      setEmailBody(`Hi ${selectedBorrower.name.split(' ')[0]},\n\nPlease find attached your updated pre-approval letter from Stone Bridge Mortgage.\n\nLet me know if you have any questions or need me to call the listing agent.\n\nBest,\nGreg Wynn`);
      setEmailStatus('idle');
    }
  }, [selectedBorrowerId]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBorrowerData, setNewBorrowerData] = useState({
    name: '', email: '', phone: '', agent: '', loanType: 'Conventional', maxPurchasePrice: 0, maxLoanAmount: 0
  });

  const handleSendEmail = () => {
    setEmailStatus('sending');
    // Simulate network request
    setTimeout(() => {
      setEmailStatus('sent');
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailStatus('idle');
      }, 2000);
    }, 1500);
  };

  const toggleMenu = (menu: string) => setOpenMenus(prev => prev === menu ? '' : menu);

  const filteredBorrowers = mockBorrowers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpired = selectedBorrower?.status === 'Expired';
  const isExpiringSoon = selectedBorrower?.status === 'Expiring Soon';

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans text-[#e2e8f0]">
      <Sidebar openMenus={openMenus} toggleMenu={toggleMenu} currentPath={location} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        <Header title="Pre-Approval Letters" />
        
        {/* Top Header Actions */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0 z-10 relative">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pre-Approval Letters</h1>
            <p className="text-slate-400 text-sm mt-1">Generate, manage, and send borrower pre-approval letters instantly.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-slate-800 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" /> Export Logs
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <Plus className="w-4 h-4 mr-2" /> New Approval
            </Button>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          
          {/* Left Panel: Borrower List */}
          <div className="w-[400px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search borrowers, agents..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">{filteredBorrowers.length} Records</span>
                <button className="text-xs text-indigo-400 font-medium flex items-center hover:text-indigo-300">
                  <Filter className="w-3 h-3 mr-1" /> Filter
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {filteredBorrowers.map(borrower => (
                <div 
                  key={borrower.id}
                  onClick={() => {
                    setSelectedBorrowerId(borrower.id);
                    setActiveTab('generate');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedBorrowerId === borrower.id 
                      ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold text-sm ${selectedBorrowerId === borrower.id ? 'text-white' : 'text-slate-200'}`}>
                        {borrower.name}
                      </h3>
                      {borrower.coBorrower && <p className="text-xs text-slate-400">{borrower.coBorrower}</p>}
                    </div>
                    <StatusPill status={borrower.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div>
                      <span className="text-slate-500 block">Max Purchase</span>
                      <span className="font-mono text-slate-300 font-medium">{formatCurrency(borrower.maxPurchasePrice)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Loan Amount</span>
                      <span className="font-mono text-slate-300 font-medium">{formatCurrency(borrower.maxLoanAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/50">
                    <span className="text-[11px] text-slate-500">{borrower.loanType} • Exp: {formatDate(borrower.expirationDate)}</span>
                    <span className="text-[11px] text-indigo-400 font-medium">Select &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Workspace */}
          <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden">
            {!selectedBorrower ? (
              // Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Select a Borrower</h2>
                <p className="text-slate-400 max-w-md">Choose a pre-approved client from the list to view details, generate letters, or manage documents.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="px-8 pt-6 border-b border-slate-800 shrink-0 flex items-center justify-between">
                  <div className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: Info },
                      { id: 'generate', label: 'Generate Letter', icon: FileText },
                      { id: 'history', label: 'History', icon: History },
                      { id: 'documents', label: 'Documents', icon: FileCheck },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
                          activeTab === tab.id 
                            ? 'border-indigo-500 text-indigo-400' 
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">File ID:</span>
                    <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">{selectedBorrower.id}</span>
                  </div>
                </div>

                {/* Workspace Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  
                  {/* Alerts Area */}
                  {(isExpired || isExpiringSoon) && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                      isExpired ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isExpired ? 'text-rose-400' : 'text-amber-400'}`} />
                      <div>
                        <h4 className="font-bold text-sm">{isExpired ? 'Approval Expired' : 'Approval Expiring Soon'}</h4>
                        <p className="text-xs opacity-80 mt-1">
                          {isExpired 
                            ? `This pre-approval expired on ${formatDate(selectedBorrower.expirationDate)}. You must re-verify credit and assets before issuing a new letter.`
                            : `This pre-approval expires in less than 30 days (${formatDate(selectedBorrower.expirationDate)}).`
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GENERATE LETTER TAB */}
                  {activeTab === 'generate' && (
                    <div className="flex flex-col xl:flex-row gap-8 h-full">
                      
                      {/* Left Side: Form */}
                      <div className="w-full xl:w-1/2 space-y-6 pb-24 xl:pb-0 xl:overflow-y-auto pr-2 custom-scrollbar">
                        
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-400" /> Letter Parameters
                            </h3>
                            <select 
                              value={letterTemplate}
                              onChange={(e) => setLetterTemplate(e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2 py-1 outline-none focus:border-indigo-500"
                            >
                              <option>Conventional Standard</option>
                              <option>FHA Standard</option>
                              <option>VA Standard</option>
                              <option>Realtor Friendly (No Max Price)</option>
                            </select>
                          </div>
                          
                          <div className="p-5 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Date Issued</label>
                                <input type="date" value={letterData.date} onChange={(e) => setLetterData({...letterData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Property Address</label>
                                <input type="text" value={letterData.propertyAddress} onChange={(e) => setLetterData({...letterData, propertyAddress: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                              </div>
                            </div>
                            
                            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-bold text-slate-300">Financial Terms</h4>
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="override" checked={overrideEnabled} onChange={(e) => setOverrideEnabled(e.target.checked)} className="accent-indigo-500" />
                                  <label htmlFor="override" className="text-xs text-rose-400 font-medium cursor-pointer">Enable Override</label>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Purchase Price</label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                      type="number" 
                                      value={letterData.purchasePrice} 
                                      onChange={(e) => setLetterData({...letterData, purchasePrice: Number(e.target.value)})}
                                      disabled={!overrideEnabled}
                                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-white focus:outline-none ${!overrideEnabled ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-950 border-indigo-500/50 focus:border-indigo-500'}`} 
                                    />
                                  </div>
                                  {!overrideEnabled && <span className="text-[10px] text-slate-500 mt-1 block">Max approved: {formatCurrency(selectedBorrower.maxPurchasePrice)}</span>}
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Loan Amount</label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                      type="number" 
                                      value={letterData.loanAmount} 
                                      onChange={(e) => setLetterData({...letterData, loanAmount: Number(e.target.value)})}
                                      disabled={!overrideEnabled}
                                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-white focus:outline-none ${!overrideEnabled ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-950 border-indigo-500/50 focus:border-indigo-500'}`} 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Special Conditions (Printed on letter)</label>
                              <textarea 
                                rows={3}
                                value={specialConditions}
                                onChange={(e) => setSpecialConditions(e.target.value)}
                                placeholder="E.g., Subject to satisfactory appraisal..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                              ></textarea>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-800">
                               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Display Toggles</label>
                               <div className="grid grid-cols-2 gap-3">
                                 <label className="flex items-center gap-2 cursor-pointer group">
                                   <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showDisclaimer ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600 group-hover:border-indigo-400'}`}>
                                     {showDisclaimer && <Check className="w-3 h-3 text-white" />}
                                   </div>
                                   <input type="checkbox" className="hidden" checked={showDisclaimer} onChange={() => setShowDisclaimer(!showDisclaimer)} />
                                   <span className="text-sm text-slate-300">Include Disclaimer</span>
                                 </label>
                                 <label className="flex items-center gap-2 cursor-pointer group">
                                   <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showRate ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600 group-hover:border-indigo-400'}`}>
                                     {showRate && <Check className="w-3 h-3 text-white" />}
                                   </div>
                                   <input type="checkbox" className="hidden" checked={showRate} onChange={() => setShowRate(!showRate)} />
                                   <span className="text-sm text-slate-300">Show Interest Rate</span>
                                 </label>
                               </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right Side: Live Preview */}
                      <div className="w-full xl:w-1/2 flex flex-col">
                         <div className="flex justify-between items-center mb-3">
                           <h3 className="text-sm font-bold text-slate-300">Live Preview</h3>
                           <span className="text-xs text-slate-500 px-2 py-1 bg-slate-900 rounded">8.5" x 11"</span>
                         </div>
                         
                         {/* PDF Preview Container */}
                         <div className="flex-1 bg-white rounded shadow-2xl p-8 md:p-10 text-slate-900 font-serif relative overflow-y-auto max-h-[70vh]">
                            {/* Letterhead */}
                            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-8">
                               <div>
                                 <img src="/stone_bridge_logo_white.png" alt="Stone Bridge Mortgage" className="h-16 object-contain mb-2" />
                                 <p className="text-xs text-slate-500 font-sans">NMLS #1234567 | Equal Housing Lender</p>
                               </div>
                               <div className="text-right text-sm text-slate-600 font-sans">
                                 <p>514 Via De La Valle #202</p>
                                 <p>Solana Beach, CA 92075</p>
                                 <p>Company NMLS: 1938081</p>
                               </div>
                            </div>

                            {/* Date & Addressee */}
                            <div className="mb-6 space-y-4">
                              <p>{formatDate(letterData.date)}</p>
                              <div className="font-bold">
                                <p>{selectedBorrower.name}</p>
                                {selectedBorrower.coBorrower && <p>{selectedBorrower.coBorrower}</p>}
                              </div>
                              <p className="text-sm font-sans text-slate-500">
                                RE: Pre-Approval for {letterData.propertyAddress === 'TBD' ? 'Property To Be Determined' : letterData.propertyAddress}
                              </p>
                            </div>

                            {/* Letter Body */}
                            <div className="space-y-4 text-[15px] leading-relaxed">
                               <p>{letterData.salutation}</p>
                               
                               <p>
                                 Congratulations! Based on a review of your credit history, income, and asset documentation, 
                                 we are pleased to inform you that you have been pre-approved for a mortgage loan with Stone Bridge Mortgage.
                               </p>

                               <div className="bg-slate-50 p-4 border border-slate-200 rounded my-6 font-sans">
                                  <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-slate-700">Approval Terms</h4>
                                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-slate-500">Purchase Price:</div>
                                    <div className="font-bold text-slate-800">{formatCurrency(letterData.purchasePrice || 0)}</div>
                                    
                                    <div className="text-slate-500">Loan Amount:</div>
                                    <div className="font-bold text-slate-800">{formatCurrency(letterData.loanAmount || 0)}</div>
                                    
                                    <div className="text-slate-500">Loan Program:</div>
                                    <div className="font-bold text-slate-800">{letterData.loanProgram}</div>

                                    {showRate && (
                                      <>
                                      <div className="text-slate-500">Interest Rate (Est):</div>
                                      <div className="font-bold text-slate-800">{selectedBorrower.interestRate}%</div>
                                      </>
                                    )}
                                  </div>
                               </div>

                               <p>
                                 This pre-approval is valid until <strong>{formatDate(selectedBorrower.expirationDate)}</strong>. 
                                 Please note that this is not a final commitment to lend. Final approval is subject to a satisfactory appraisal of the property, clear title, and no material changes in your financial condition.
                               </p>

                               {specialConditions && (
                                 <div className="mt-4">
                                   <h4 className="font-bold text-sm mb-1 uppercase tracking-wider text-slate-700">Special Conditions</h4>
                                   <p className="whitespace-pre-wrap">{specialConditions}</p>
                                 </div>
                               )}

                               {showDisclaimer && (
                                 <p className="text-[11px] text-slate-500 italic mt-8 border-t border-slate-200 pt-4 leading-tight">
                                   Disclaimer: This pre-approval is based on the information provided and verified to date. If any information changes, including employment, debts, or assets, this pre-approval may be voided. Interest rates are subject to market changes until locked.
                                 </p>
                               )}

                               {/* Signature Block */}
                               <div className="mt-12">
                                 <p className="mb-4">Sincerely,</p>
                                 <img src="/greg_signature.png" alt="Greg Wynn Signature" className="h-16 object-contain mb-2 -ml-2 mix-blend-multiply" />
                                 <p className="font-bold text-slate-900">Greg Wynn</p>
                                 <p className="text-sm">Branch Manager / Loan Officer</p>
                                 <p className="text-sm">Stone Bridge Mortgage</p>
                                 <p className="text-sm mt-2">NMLS 276890</p>
                                 <p className="text-sm">C: 619-550-9885</p>
                                 <p className="text-sm">F: 866-322-7805</p>
                                 <p className="text-sm">Greg@StonebridgeMortgage.com</p>
                                 <p className="text-sm">www.LenderGreg.com</p>
                               </div>
                            </div>
                         </div>
                      </div>

                    </div>
                  )}

                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-400" /> Borrower Identity
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Primary Borrower</p>
                            <p className="font-bold text-white text-lg">{selectedBorrower.name}</p>
                          </div>
                          {selectedBorrower.coBorrower && (
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Co-Borrower</p>
                              <p className="font-bold text-white">{selectedBorrower.coBorrower}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Contact Info</p>
                              <p className="text-sm text-slate-300">{selectedBorrower.email}</p>
                              <p className="text-sm text-slate-300">{selectedBorrower.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Assigned Agent</p>
                              <p className="text-sm text-indigo-400">{selectedBorrower.agent}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" /> Approval Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Max Purchase Price</p>
                             <p className="font-mono font-bold text-emerald-400 text-xl">{formatCurrency(selectedBorrower.maxPurchasePrice)}</p>
                           </div>
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Max Loan Amount</p>
                             <p className="font-mono font-bold text-white text-xl">{formatCurrency(selectedBorrower.maxLoanAmount)}</p>
                           </div>
                           
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Loan Program</p>
                             <p className="text-sm font-medium text-slate-300 bg-slate-800 inline-block px-2 py-1 rounded">{selectedBorrower.loanType}</p>
                           </div>
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Down Payment</p>
                             <p className="text-sm text-slate-300">{formatCurrency(selectedBorrower.downPaymentAmount)} ({selectedBorrower.downPaymentPercent}%)</p>
                           </div>
                           
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Property / Occupancy</p>
                             <p className="text-sm text-slate-300">{selectedBorrower.propertyType} • {selectedBorrower.occupancyType}</p>
                           </div>
                           <div>
                             <p className="text-xs text-slate-500 mb-1">Expiration</p>
                             <p className={`text-sm font-bold ${isExpired ? 'text-rose-400' : isExpiringSoon ? 'text-amber-400' : 'text-slate-300'}`}>
                               {formatDate(selectedBorrower.expirationDate)}
                             </p>
                           </div>
                        </div>
                        {selectedBorrower.notes && (
                          <div className="mt-5 pt-4 border-t border-slate-800">
                             <p className="text-xs text-slate-500 mb-1">Internal Notes</p>
                             <p className="text-sm text-slate-400 italic bg-slate-950/50 p-3 rounded border border-slate-800/50">"{selectedBorrower.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* History & Docs Placeholders */}
                  {(activeTab === 'history' || activeTab === 'documents') && (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        {activeTab === 'history' ? <History className="w-8 h-8 text-slate-500" /> : <FileCheck className="w-8 h-8 text-slate-500" />}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">No {activeTab} yet</h3>
                      <p className="text-slate-400 max-w-sm text-sm">Generate and save a letter to see it appear here in the borrower's permanent record.</p>
                    </div>
                  )}

                </div>

                {/* Sticky Footer Actions for Generate Tab */}
                {activeTab === 'generate' && (
                  <div className="px-8 py-4 bg-slate-900 border-t border-slate-800 shrink-0 flex justify-between items-center z-20">
                    <Button variant="ghost" className="text-slate-400 hover:text-white border-slate-700">
                      Save as Draft
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setIsEmailModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                      >
                        <Mail className="w-4 h-4 mr-2" /> Email Letter
                      </Button>
                      <Button 
                        disabled={isExpired && !overrideEnabled}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none"
                      >
                        Generate PDF
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Email Modal Overlay */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" /> Send Pre-Approval
                </h3>
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {emailStatus === 'sent' ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-400">The pre-approval letter has been sent to {selectedBorrower?.name}{includeSms ? ' via Email and SMS' : ' via Email'}.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</label>
                        <button 
                          onClick={() => setShowAdditionalEmails(!showAdditionalEmails)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          {showAdditionalEmails ? '- Remove CC/BCC' : '+ Add CC/BCC'}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                    
                    {showAdditionalEmails && (
                      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cc</label>
                          <input 
                            type="text" 
                            value={emailCc}
                            onChange={(e) => setEmailCc(e.target.value)}
                            placeholder="agent@example.com"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bcc</label>
                          <input 
                            type="text" 
                            value={emailBcc}
                            onChange={(e) => setEmailBcc(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                      <textarea 
                        rows={6}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                      ></textarea>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 truncate">Pre-Approval_Letter_{selectedBorrower?.name.replace(' ', '_')}.pdf</p>
                          <p className="text-xs text-slate-500">Auto-generated attachment</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 mt-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={includeSms}
                            onChange={(e) => setIncludeSms(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all"></div>
                          <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Also send via SMS to Borrower</p>
                          <p className="text-xs text-slate-500">Will text a secure link to view/download the PDF</p>
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>
              
              {/* Modal Footer */}
              {emailStatus !== 'sent' && (
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEmailModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={emailStatus === 'sending'}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                  >
                    {emailStatus === 'sending' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Add Borrower Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> New Pre-Approval
                </h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Upload 1003 or LOS Export</h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">Drag and drop Fannie Mae 1003 (3.2/3.4), MISMO, or a raw Encompass/Calyx export file to auto-fill borrower details.</p>
                  <Button variant="outline" className="bg-slate-950 border-slate-600 text-slate-300 hover:text-white pointer-events-none">
                    Select File
                  </Button>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-2 text-slate-500 font-medium uppercase tracking-widest">Or enter manually</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Borrower Name *</label>
                    <input 
                      type="text" 
                      value={newBorrowerData.name}
                      onChange={(e) => setNewBorrowerData({...newBorrowerData, name: e.target.value})}
                      placeholder="e.g., John Smith"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      value={newBorrowerData.email}
                      onChange={(e) => setNewBorrowerData({...newBorrowerData, email: e.target.value})}
                      placeholder="e.g., john@example.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      value={newBorrowerData.phone}
                      onChange={(e) => setNewBorrowerData({...newBorrowerData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real Estate Agent</label>
                    <input 
                      type="text" 
                      value={newBorrowerData.agent}
                      onChange={(e) => setNewBorrowerData({...newBorrowerData, agent: e.target.value})}
                      placeholder="Agent Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loan Program</label>
                    <select 
                      value={newBorrowerData.loanType}
                      onChange={(e) => setNewBorrowerData({...newBorrowerData, loanType: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    >
                      <option>Conventional</option>
                      <option>FHA</option>
                      <option>VA</option>
                      <option>Jumbo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Purchase Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        value={newBorrowerData.maxPurchasePrice || ''}
                        onChange={(e) => setNewBorrowerData({...newBorrowerData, maxPurchasePrice: Number(e.target.value)})}
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Loan Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        value={newBorrowerData.maxLoanAmount || ''}
                        onChange={(e) => setNewBorrowerData({...newBorrowerData, maxLoanAmount: Number(e.target.value)})}
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                >
                  Create Approval
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
