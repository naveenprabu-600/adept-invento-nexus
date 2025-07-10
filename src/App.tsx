import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (only accessible when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login/dashboard based on auth state */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              {/* Placeholder routes for future pages */}
              <Route path="users" element={<div className="p-6 text-foreground">User Management - Coming Soon</div>} />
              <Route path="warehouses" element={<div className="p-6 text-foreground">Warehouse Management - Coming Soon</div>} />
              <Route path="products" element={<div className="p-6 text-foreground">Product Management - Coming Soon</div>} />
              <Route path="inventory" element={<div className="p-6 text-foreground">Inventory Management - Coming Soon</div>} />
              <Route path="purchase-orders" element={<div className="p-6 text-foreground">Purchase Orders - Coming Soon</div>} />
              <Route path="sales-orders" element={<div className="p-6 text-foreground">Sales Orders - Coming Soon</div>} />
              <Route path="suppliers" element={<div className="p-6 text-foreground">Supplier Management - Coming Soon</div>} />
              <Route path="product-catalog" element={<div className="p-6 text-foreground">Product Catalog - Coming Soon</div>} />
              <Route path="reports" element={<div className="p-6 text-foreground">Reports - Coming Soon</div>} />
              <Route path="audit-trail" element={<div className="p-6 text-foreground">Audit Trail - Coming Soon</div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
