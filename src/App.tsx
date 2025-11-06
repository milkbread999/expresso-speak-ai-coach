import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Drills from "./pages/Drills";
import SignUp from "./pages/SignUp";
import DrillDetail from "./pages/DrillDetail";
import NotFound from "./pages/NotFound";
import LogIn from "./pages/LogIn";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Add this

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/drills" element={              <ProtectedRoute>
                <Drills />
              </ProtectedRoute>} />
          <Route path="/drill/:id" element={              <ProtectedRoute>
                <DrillDetail />
              </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
