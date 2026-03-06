import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AlunoDashboard from "./pages/AlunoDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import CoordenacaoDashboard from "./pages/CoordenacaoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import BancoQuestoes from "./pages/BancoQuestoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/aluno" element={<AlunoDashboard />} />
          <Route path="/aluno/*" element={<AlunoDashboard />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/professor/questoes" element={<BancoQuestoes />} />
          <Route path="/professor/*" element={<ProfessorDashboard />} />
          <Route path="/coordenacao" element={<CoordenacaoDashboard />} />
          <Route path="/coordenacao/questoes" element={<BancoQuestoes />} />
          <Route path="/coordenacao/*" element={<CoordenacaoDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questoes" element={<BancoQuestoes />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
