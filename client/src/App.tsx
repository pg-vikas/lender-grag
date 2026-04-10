import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect, lazy, Suspense } from "react";

import { HomeScreen } from "@/pages/HomeScreen";
import AboutPage from "@/pages/AboutPage";
import LoanOptionsPage from "@/pages/LoanOptionsPage";
import ToolsPage from "@/pages/ToolsPage";
import ReviewsPage from "@/pages/ReviewsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import ApplyPage from "@/pages/ApplyPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

const PortalPage = lazy(() => import("@/pages/PortalPage"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminCRM = lazy(() => import("./admin/pages/CRMPage"));
const AdminLeads = lazy(() => import("./admin/pages/LeadsPage"));
const AdminBorrowers = lazy(() => import("./admin/pages/BorrowersPage"));
const AdminBorrowerDetail = lazy(() => import("./admin/pages/BorrowerDetailPage"));
const AdminPipeline = lazy(() => import("./admin/pages/PipelinePage"));
const AdminLoanDetail = lazy(() => import("./admin/pages/LoanDetailPage"));
const AdminDocuments = lazy(() => import("./admin/pages/DocumentsPage"));
const AdminESign = lazy(() => import("./admin/pages/ESignPage"));
const AdminESignTemplates = lazy(() => import("./admin/pages/ESignTemplatesPage"));
const AdminConditions = lazy(() => import("./admin/pages/ConditionsPage"));
const AdminCommunications = lazy(() => import("./admin/pages/CommunicationsPage"));
const AdminTasks = lazy(() => import("./admin/pages/TasksPage"));
const AdminAutomations = lazy(() => import("./admin/pages/AutomationsPage"));
const AdminCompliance = lazy(() => import("./admin/pages/CompliancePage"));
const AdminReports = lazy(() => import("./admin/pages/ReportsPage"));
const AdminPricing = lazy(() => import("./admin/pages/PricingDeskPage"));
const AdminProducts = lazy(() => import("./admin/pages/ProductsProgramsPage"));
const AdminBranches = lazy(() => import("./admin/pages/BranchesPage"));
const AdminTeam = lazy(() => import("./admin/pages/TeamPage"));
const AdminExecutive = lazy(() => import("./admin/pages/ExecutivePage"));
const AdminSettings = lazy(() => import("./admin/pages/SettingsPage"));
const AdminCRMProfile = lazy(() => import("./admin/pages/CRMProfilePage"));

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#e91e8c]/30 border-t-[#e91e8c] rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/about" component={AboutPage} />
        <Route path="/loan-options" component={LoanOptionsPage} />
        <Route path="/tools" component={ToolsPage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/apply" component={ApplyPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/portal">
          {() => <Suspense fallback={<div className="min-h-screen bg-[#fafdf9] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#004733]/30 border-t-[#004733] rounded-full animate-spin" /></div>}><PortalPage /></Suspense>}
        </Route>
        <Route path="/admin">
          {() => <Suspense fallback={<AdminLoading />}><AdminDashboard /></Suspense>}
        </Route>
        <Route path="/admin/crm/:recordId">
          {() => <Suspense fallback={<AdminLoading />}><AdminCRMProfile /></Suspense>}
        </Route>
        <Route path="/admin/crm">
          {() => <Suspense fallback={<AdminLoading />}><AdminCRM /></Suspense>}
        </Route>
        <Route path="/admin/leads">
          {() => <Suspense fallback={<AdminLoading />}><AdminLeads /></Suspense>}
        </Route>
        <Route path="/admin/borrowers/:borrowerId">
          {() => <Suspense fallback={<AdminLoading />}><AdminBorrowerDetail /></Suspense>}
        </Route>
        <Route path="/admin/borrowers">
          {() => <Suspense fallback={<AdminLoading />}><AdminBorrowers /></Suspense>}
        </Route>
        <Route path="/admin/pipeline/:loanId">
          {() => <Suspense fallback={<AdminLoading />}><AdminLoanDetail /></Suspense>}
        </Route>
        <Route path="/admin/pipeline">
          {() => <Suspense fallback={<AdminLoading />}><AdminPipeline /></Suspense>}
        </Route>
        <Route path="/admin/documents">
          {() => <Suspense fallback={<AdminLoading />}><AdminDocuments /></Suspense>}
        </Route>
        <Route path="/admin/esign/templates">
          {() => <Suspense fallback={<AdminLoading />}><AdminESignTemplates /></Suspense>}
        </Route>
        <Route path="/admin/esign">
          {() => <Suspense fallback={<AdminLoading />}><AdminESign /></Suspense>}
        </Route>
        <Route path="/admin/conditions">
          {() => <Suspense fallback={<AdminLoading />}><AdminConditions /></Suspense>}
        </Route>
        <Route path="/admin/communications">
          {() => <Suspense fallback={<AdminLoading />}><AdminCommunications /></Suspense>}
        </Route>
        <Route path="/admin/tasks">
          {() => <Suspense fallback={<AdminLoading />}><AdminTasks /></Suspense>}
        </Route>
        <Route path="/admin/automations">
          {() => <Suspense fallback={<AdminLoading />}><AdminAutomations /></Suspense>}
        </Route>
        <Route path="/admin/compliance">
          {() => <Suspense fallback={<AdminLoading />}><AdminCompliance /></Suspense>}
        </Route>
        <Route path="/admin/reports">
          {() => <Suspense fallback={<AdminLoading />}><AdminReports /></Suspense>}
        </Route>
        <Route path="/admin/pricing">
          {() => <Suspense fallback={<AdminLoading />}><AdminPricing /></Suspense>}
        </Route>
        <Route path="/admin/products">
          {() => <Suspense fallback={<AdminLoading />}><AdminProducts /></Suspense>}
        </Route>
        <Route path="/admin/branches">
          {() => <Suspense fallback={<AdminLoading />}><AdminBranches /></Suspense>}
        </Route>
        <Route path="/admin/team">
          {() => <Suspense fallback={<AdminLoading />}><AdminTeam /></Suspense>}
        </Route>
        <Route path="/admin/executive">
          {() => <Suspense fallback={<AdminLoading />}><AdminExecutive /></Suspense>}
        </Route>
        <Route path="/admin/settings">
          {() => <Suspense fallback={<AdminLoading />}><AdminSettings /></Suspense>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
