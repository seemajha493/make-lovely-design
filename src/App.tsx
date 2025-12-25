import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Hospitals from "./pages/Hospitals";
import FirstAid from "./pages/FirstAid";
import Contacts from "./pages/Contacts";
import Symptoms from "./pages/Symptoms";
import Doctors from "./pages/Doctors";
import BloodBanks from "./pages/BloodBanks";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Prescription from "./pages/Prescription";
import DoctorAuth from "./pages/DoctorAuth";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDoctors from "./pages/AdminDoctors";
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
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/first-aid" element={<FirstAid />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/blood-banks" element={<BloodBanks />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/doctor-auth" element={<DoctorAuth />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
