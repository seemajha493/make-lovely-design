import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
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
import Pharmacies from "./pages/Pharmacies";
import PharmacistAuth from "./pages/PharmacistAuth";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminPharmacists from "./pages/AdminPharmacists";
import AdminDashboard from "./pages/AdminDashboard";
import Medicines from "./pages/Medicines";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import Appointments from "./pages/Appointments";
import Payment from "./pages/Payment";
import Insurance from "./pages/Insurance";
import InsuranceDashboard from "./pages/InsuranceDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
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
              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route path="/pharmacist-auth" element={<PharmacistAuth />} />
              <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
              <Route path="/admin/pharmacists" element={<AdminPharmacists />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/insurance/dashboard" element={<InsuranceDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
