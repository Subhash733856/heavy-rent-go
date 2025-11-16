import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OperatorDashboard from "./pages/OperatorDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClientLogin from "./pages/ClientLogin";
import OperatorLogin from "./pages/OperatorLogin";
import OperatorHome from "./pages/OperatorHome";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/client-login" element={<ClientLogin />} />
            <Route path="/operator-login" element={<OperatorLogin />} />
            <Route 
              path="/operator-home" 
              element={
                <ProtectedRoute requireRole="operator">
                  <OperatorHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operator-dashboard" 
              element={
                <ProtectedRoute requireRole="operator">
                  <OperatorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute requireRole="client">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
