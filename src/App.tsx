import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Leaders from "./pages/Leaders.tsx";
import Gallery from "./pages/Gallery.tsx";
import Contact from "./pages/Contact.tsx";
import Tithes from "./pages/Tithes.tsx";
import ProjectFunding from "./pages/ProjectFunding.tsx";
import FirstTimer from "./pages/FirstTimer.tsx";
import Testimony from "./pages/Testimony.tsx";
import CSR from "./pages/CSR.tsx";
import JoinWorkforce from "./pages/JoinWorkforce.tsx";
import NotFound from "./pages/NotFound.tsx";
import Sermons from "./pages/Sermons.tsx";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminFirstTimers from "./pages/admin/AdminFirstTimers";
import AdminTestimonies from "./pages/admin/AdminTestimonies";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSermons from "./pages/admin/AdminSermons";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminWorkforce from "./pages/admin/AdminWorkforce";
import Events from "./pages/Events";

import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Login from "./pages/Login.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/give/tithes" element={<Tithes />} />
            <Route path="/give/projects" element={<ProjectFunding />} />
            <Route path="/first-timer" element={<FirstTimer />} />
            <Route path="/testimony" element={<Testimony />} />
            <Route path="/events" element={<Events />} />
            <Route path="/csr" element={<CSR />} />
            <Route path="/join-workforce" element={<JoinWorkforce />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes (admin + super_admin) */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminOverview /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/first-timers" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminFirstTimers /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/testimonies" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminTestimonies /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/donations" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminDonations /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/contacts" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminContacts /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminEvents /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/sermons" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminSermons /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminNotifications /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/workforce" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminWorkforce /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Super Admin Only Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute requireSuperAdmin>
                <AdminLayout><AdminUsers /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
