import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@shared/schema";

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
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

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

function SessionLoading() {
  return (
    <div className="min-h-screen bg-[#fafdf9] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#004733]/30 border-t-[#004733] rounded-full animate-spin" />
    </div>
  );
}

function RoleProtectedRoute({
  requiredRole,
  children,
}: {
  requiredRole: UserRole;
  children: JSX.Element;
}) {
  const { user, isAuthenticated, isLoading, hasLoadedSession, loadSession } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!hasLoadedSession) {
      void loadSession();
    }
  }, [hasLoadedSession, loadSession]);

  useEffect(() => {
    if (isLoading || !hasLoadedSession) {
      return;
    }

    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== requiredRole) {
      navigate(user.role === "admin" ? "/admin" : "/portal");
    }
  }, [hasLoadedSession, isAuthenticated, isLoading, navigate, requiredRole, user]);

  if (isLoading || !hasLoadedSession || !isAuthenticated || !user || user.role !== requiredRole) {
    return <SessionLoading />;
  }

  return children;
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
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password/:token" component={ResetPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/portal">
          {() => (
            <RoleProtectedRoute requiredRole="client">
              <Suspense fallback={<SessionLoading />}><PortalPage /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminDashboard /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/crm/:recordId">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminCRMProfile /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/crm">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminCRM /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/leads">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminLeads /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/borrowers/:borrowerId">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminBorrowerDetail /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/borrowers">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminBorrowers /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pipeline/:loanId">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminLoanDetail /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pipeline">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminPipeline /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/documents">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminDocuments /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esign/templates">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminESignTemplates /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esign">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminESign /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/conditions">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminConditions /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/communications">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminCommunications /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/tasks">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminTasks /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/automations">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminAutomations /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/compliance">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminCompliance /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/reports">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminReports /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pricing">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminPricing /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/products">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminProducts /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/branches">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminBranches /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/team">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminTeam /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/executive">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminExecutive /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/settings">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminSettings /></Suspense>
            </RoleProtectedRoute>
          )}
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
