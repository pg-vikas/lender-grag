import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import { HomeScreen } from "@/pages/HomeScreen";
import AboutPage from "@/pages/AboutPage";
import LoanOptionsPage from "@/pages/LoanOptionsPage";
import ToolsPage from "@/pages/ToolsPage";
import ReviewsPage from "@/pages/ReviewsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import ApplyPage from "@/pages/ApplyPage";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
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
