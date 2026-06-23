import { Switch, Route, Redirect } from "wouter";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/admin/components/ui/toaster";
import { TooltipProvider } from "@/admin/components/ui/tooltip";
import NotFound from "@/admin/pages/not-found";
import Home from "@/admin/pages/home";
import ClientsPage from "@/admin/pages/clients";
import ClientDetailsPage from "@/admin/pages/client-details";
import TasksPage from "@/admin/pages/tasks";
import ProjectsPage from "@/admin/pages/projects";
import ProjectDetailsPage from "@/admin/pages/project-details";
import LaunchpadsPage from "@/admin/pages/launchpads";
import LaunchpadDetailsPage from "@/admin/pages/launchpad-details";
import LaunchpadTemplatesPage from "@/admin/pages/launchpad-templates";
import LaunchpadTemplateDetailsPage from "@/admin/pages/launchpad-template-details";
import InvoicesPage from "@/admin/pages/invoices";
import InvoiceDetailsPage from "@/admin/pages/invoice-details";
import SubscriptionsPage from "@/admin/pages/subscriptions";
import SubscriptionDetailsPage from "@/admin/pages/subscription-details";
import PaymentsPage from "@/admin/pages/payments";
import ContractsPage from "@/admin/pages/contracts";
import ContractDetailsPage from "@/admin/pages/contract-details";
import TemplatesPage from "@/admin/pages/templates";
import TicketsPage from "@/admin/pages/tickets";
import TicketCreatePage from "@/admin/pages/tickets-create";
import TicketDetailsPage from "@/admin/pages/ticket-details";
import ReportsPage from "@/admin/pages/reports";
import PerformancePage from "@/admin/pages/performance";
import UserPerformancePage from "@/admin/pages/performance-user";
import KnowledgebasePage from "@/admin/pages/knowledgebase";
import UsersPage from "@/admin/pages/users";
import WebsiteAnalyticsPage from "@/admin/pages/analytics";
import GrowthKPIPage from "@/admin/pages/growth-kpi";
import MessagesPage from "@/admin/pages/messages";
import SocialPublisherPage from "@/admin/pages/social-publisher";

import PreApprovalModule from "@/admin/pages/pre-approval";

import ESignaturesSendPage from "@/admin/pages/esignatures-send";
import ESignaturesDocumentsPage from "@/admin/pages/esignatures-documents";
import ESignaturesTemplatesPage from "@/admin/pages/esignatures-templates";

import SettingsPage from "@/admin/pages/settings";

import PipelinePage from "@/admin/pages/pipeline";
import ConditionsPage from "@/admin/pages/conditions";
import PricingDeskPage from "@/admin/pages/pricing-desk";
import CompliancePage from "@/admin/pages/compliance";
import TeamPage from "@/admin/pages/team";

function Router() {
  return (
    <Switch>
      <Route path="/admin/home" component={Home} />
      <Route path="/admin/clients">
        <ClientsPage isActiveOnly={false} />
      </Route>
      <Route path="/admin/clients/active">
        <ClientsPage isActiveOnly={true} />
      </Route>
      <Route path="/admin/clients/:id" component={ClientDetailsPage} />
      <Route path="/admin/tasks" component={TasksPage} />
      <Route path="/admin/projects" component={ProjectsPage} />
      <Route path="/admin/projects/:id" component={ProjectDetailsPage} />
      <Route path="/admin/launchpads/templates/:id" component={LaunchpadTemplateDetailsPage} />
      <Route path="/admin/launchpads/templates" component={LaunchpadTemplatesPage} />
      <Route path="/admin/launchpads/:id" component={LaunchpadDetailsPage} />
      <Route path="/admin/launchpads" component={LaunchpadsPage} />
      <Route path="/admin/invoices" component={InvoicesPage} />
      <Route path="/admin/invoices/:id" component={InvoiceDetailsPage} />
      <Route path="/admin/subscriptions" component={SubscriptionsPage} />
      <Route path="/admin/subscriptions/:id" component={SubscriptionDetailsPage} />
      <Route path="/admin/payments" component={PaymentsPage} />
      <Route path="/admin/contracts/templates" component={TemplatesPage} />
      <Route path="/admin/contracts/:id/edit" component={ContractDetailsPage} />
      <Route path="/admin/contracts/:id" component={ContractDetailsPage} />
      <Route path="/admin/contracts" component={ContractsPage} />
      <Route path="/admin/esignatures/send" component={ESignaturesSendPage} />
      <Route path="/admin/esignatures/documents" component={ESignaturesDocumentsPage} />
      <Route path="/admin/esignatures/templates" component={ESignaturesTemplatesPage} />
      <Route path="/admin/tickets/create" component={TicketCreatePage} />
      <Route path="/admin/tickets" component={TicketsPage} />
      <Route path="/admin/tickets/:id" component={TicketDetailsPage} />
      <Route path="/admin/knowledgebase" component={KnowledgebasePage} />
      <Route path="/admin/reports" component={ReportsPage} />
      <Route path="/admin/performance/:filter?" component={PerformancePage} />
      <Route path="/admin/performance/user/:id/:filter?" component={UserPerformancePage} />
      <Route path="/admin/users" component={UsersPage} />
      <Route path="/admin/analytics" component={WebsiteAnalyticsPage} />
      <Route path="/admin/growth/kpi-overview" component={GrowthKPIPage} />
      <Route path="/admin/messages" component={MessagesPage} />
      <Route path="/admin/social/publisher" component={SocialPublisherPage} />
      <Route path="/admin/social/analytics" component={WebsiteAnalyticsPage} />
      <Route path="/admin/social"><Redirect to="/admin/social/publisher" /></Route>
      <Route path="/admin/pre-approvals" component={PreApprovalModule} />
      <Route path="/admin/esignatures"><Redirect to="/admin/esignatures/send" /></Route>
      <Route path="/admin/growth"><Redirect to="/admin/growth/kpi-overview" /></Route>
      <Route path="/admin/pipeline"><Redirect to="/admin/pipeline/active" /></Route>
      <Route path="/admin/settings" component={SettingsPage} />
      
      <Route path="/admin/pipeline/:status" component={PipelinePage} />
      <Route path="/admin/conditions" component={ConditionsPage} />
      <Route path="/admin/pricing-desk" component={PricingDeskPage} />
      <Route path="/admin/compliance" component={CompliancePage} />
      <Route path="/admin/team" component={TeamPage} />

      <Route path="/admin">
        <Redirect to="/admin/home" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="admin-portal-root min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
