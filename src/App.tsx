import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Professionals from "./pages/Professionals";
import PostTask from "./pages/PostTask";
import CreateProfile from "./pages/CreateProfile";
import BrowseTasks from "./pages/BrowseTasks";
import GiveFeedback from "./pages/GiveFeedback";
import TaskDashboard from "./pages/TaskDashboard";
import MyProposals from "./pages/MyProposals";
import NotFound from "./pages/NotFound";

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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/browse" element={<ProtectedRoute><Professionals /></ProtectedRoute>} />
            <Route path="/post-task" element={<ProtectedRoute><PostTask /></ProtectedRoute>} />
            <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
            <Route path="/find-work" element={<ProtectedRoute><BrowseTasks /></ProtectedRoute>} />
            <Route path="/give-feedback" element={<ProtectedRoute><GiveFeedback /></ProtectedRoute>} />
            <Route path="/dashboard/tasks" element={<ProtectedRoute><TaskDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/proposals" element={<ProtectedRoute><MyProposals /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
