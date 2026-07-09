import './App.css';
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { CartProvider, useCart } from "@/contexts/CartContext"; // ✅ Cart Context
import { InitialLoadProvider } from '@/contexts/InitialLoadContext';
import { SellerInitialLoadProvider } from '@/contexts/SellerInitialLoadContext';
import useScrollToTop from '@/hooks/useScrollToTop';
import DownloadPage from './pages/DownloadPage';
// import SignupProfilePage from '@/pages/SignupProfilePage';

import axios from 'axios';
import GlobalLoadingGate from './components/GlobalLoadingGate';

// Pages
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import TemplateInfo from "./pages/TemplateInfo";
import About from "./pages/About";
import Help from "./pages/Help";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Cart from "./pages/Cart";
import Pricing from "./pages/Pricing";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import CheckoutPage from '@/pages/CheckoutPage';
import PaymentSuccess from '@/pages/PaymentSuccess';
import ForgotPassword from "./pages/ForgotPassword";
import ShippingDelivery from "./pages/ShippingDelivery";
import ContactUs from "./pages/ContactUs";
import WeekendsHubPage from "./pages/WeekendsHubPage"; // 👈 Import new hub page
import WeekendChallengePage from "./pages/WeekendChallengePage"; // 👈 Import challenge detail page
// Seller Pages
import SellerHome from "./pages/seller/SellerHome";
import SellerProfile from "./pages/seller/SellerProfile";
import UploadTemplate from "./pages/seller/UploadTemplate";
import SellerHelp from "./pages/seller/SellerHelp";
import SellerAbout from "./pages/seller/SellerAbout";
import SellerTemplateInfo from "./pages/seller/SellerTemplateInfo";
import GitHubCallback from "./pages/seller/GitHubCallback"; // 👈 import this at the top

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompetitionDetails from "./pages/admin/components/CompetitionDetails";
import AdminTemplateManagement from "./pages/admin/components/AdminManageTemplate";
import EditUserPage from "@/pages/admin/components/EditUserPage"; // adjust path as needed
import { useRole } from "@/contexts/RoleContext"; // Import the role context

const queryClient = new QueryClient();

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

// ProtectedRoute
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin" replace />;
};

// Admin Protected Route
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  const { isAdmin, checkingRole } = useRole();

  if (checkingRole) return null; // Optionally show loader here

  return token && isAdmin ? children : <Navigate to="/" replace />;
};

const AppWithProviders = () => {
  const { token } = useAuth();
  const { setCartFromServer } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          const items = res.data.map((item: any) => ({
            id: item.template._id,
            title: item.template.title,
            price: item.template.estimatedPrice,
            previewImageUrl: item.template.previewImageUrl,
            category: item.template.framework,
            quantity: item.quantity,
          }));
          setCartFromServer(items);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();
  }, [token, setCartFromServer]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/weekends" element={<WeekendsHubPage />} />
      <Route path="/weekends/:id" element={<WeekendChallengePage />} />
      <Route path="/weekend/:id" element={<Navigate to="/weekends/:id" replace />} /> {/* Redirect old route */}
      <Route path="/templates" element={<Templates />} />
      <Route path="/template/:id" element={<TemplateInfo />} />
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<About />} />
      <Route path="/shipping-delivery" element={<ShippingDelivery />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/subscription" element={<Subscription />} />


      {/* Protected Routes */}
      {/* <Route path="/profile-details" element={<SignupProfilePage />} /> */}

      {/* Cart (Protected) */}
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/download" element={<ProtectedRoute><DownloadPage /></ProtectedRoute>} />

      {/* Seller Routes (Protected) */}
      <Route path="/seller" element={<ProtectedRoute><SellerHome /></ProtectedRoute>} />
      <Route path="/seller/profile" element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
      <Route path="/seller/upload" element={<ProtectedRoute><UploadTemplate /></ProtectedRoute>} />
      <Route path="/github/callback" element={<ProtectedRoute><GitHubCallback /></ProtectedRoute>} />
      <Route path="/seller/help" element={<ProtectedRoute><SellerHelp /></ProtectedRoute>} />
      <Route path="/seller/about" element={<ProtectedRoute><SellerAbout /></ProtectedRoute>} />
      <Route path="/seller/template/:id" element={<ProtectedRoute><SellerTemplateInfo /></ProtectedRoute>} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin/template/:id" element={<ProtectedAdminRoute><AdminTemplateManagement /></ProtectedAdminRoute>} />
      <Route path="/admin/users/:id" element={<ProtectedAdminRoute><EditUserPage /></ProtectedAdminRoute>} />
      <Route 
  path="/admin/competition/:id" 
  element={
    <ProtectedAdminRoute>
      <CompetitionDetails />
    </ProtectedAdminRoute>
  } 
/>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#101214", // surface color
            color: "#E8E8E8", // foreground
            border: "1px solid #2B3138", // border color
            borderRadius: "0px", // brutalist - no rounded corners
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)", // industrial shadow
            fontFamily: "system-ui, sans-serif"
          }
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <InitialLoadProvider>
          <SellerInitialLoadProvider>
            <AuthProvider>
              <RoleProvider>
                <CartProvider>
                  <GlobalLoadingGate>
                    <AppWithProviders />
                  </GlobalLoadingGate>
                </CartProvider>
              </RoleProvider>
            </AuthProvider>
          </SellerInitialLoadProvider>
        </InitialLoadProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
