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
const AdminApp = lazy(() => import("./admin/App"));

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
        <Route path="/admin/performance/user/:id/:filter?">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/contracts/templates">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/contracts/:id/edit">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/contracts/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esignatures/send">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esignatures/documents">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esignatures/templates">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/tickets/create">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/tickets/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/clients/active">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/clients/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/projects/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/invoices/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/subscriptions/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/launchpads/templates/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/launchpads/templates">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/launchpads/:id">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/performance/:filter?">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pipeline/:status">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/home">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/clients">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/tasks">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/projects">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/invoices">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/subscriptions">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/payments">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/contracts">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/tickets">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/knowledgebase">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/reports">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/users">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/analytics">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/growth/kpi-overview">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/messages">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/social/publisher">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/social/analytics">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pre-approvals">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/settings">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pipeline">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/conditions">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/pricing-desk">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/compliance">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/team">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/esignatures">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/growth">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/social">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin/launchpads">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
            </RoleProtectedRoute>
          )}
        </Route>
        <Route path="/admin">
          {() => (
            <RoleProtectedRoute requiredRole="admin">
              <Suspense fallback={<AdminLoading />}><AdminApp /></Suspense>
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
