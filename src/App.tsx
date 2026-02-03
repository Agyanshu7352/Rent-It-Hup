import './App.css'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import ListItem from "./pages/ListItem";
import ItemDetails from "./pages/ItemDetailPage";
import Commingsoon from "./pages/Commingsoon";
import Careers from "./pages/Careers";
import Termofservice from "./pages/Termofservice";
import PrivacyPolicy from "./pages/Privacypolicy";
import Cookiepolicy from './pages/Cookiepolicy';
import Refundpolicy from './pages/Refundpolicy';
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/list-item" element={<ListItem />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/comming-soon" element={<Commingsoon />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/term-of-service" element={<Termofservice />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<Cookiepolicy />} />
            <Route path="/refund-policy" element={<Refundpolicy />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
