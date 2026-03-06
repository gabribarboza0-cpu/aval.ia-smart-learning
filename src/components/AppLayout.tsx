import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Scale, LayoutDashboard, FileText, BookOpen, BarChart3, Users, Settings, GraduationCap, ClipboardList, Library, Brain, TrendingUp, LogOut, ChevronLeft } from "lucide-react";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: Record<UserRole, NavItem[]> = {
  aluno: [
    { title: "Dashboard", url: "/aluno", icon: LayoutDashboard },
    { title: "Provas", url: "/aluno/provas", icon: ClipboardList },
    { title: "Diagnóstico", url: "/aluno/diagnostico", icon: Brain },
    { title: "Recomendações", url: "/aluno/recomendacoes", icon: BookOpen },
    { title: "Evolução", url: "/aluno/evolucao", icon: TrendingUp },
  ],
  professor: [
    { title: "Dashboard", url: "/professor", icon: LayoutDashboard },
    { title: "Banco de Questões", url: "/professor/questoes", icon: Library },
    { title: "Criar Avaliação", url: "/professor/criar-avaliacao", icon: FileText },
    { title: "Minhas Provas", url: "/professor/provas", icon: ClipboardList },
    { title: "Relatórios", url: "/professor/relatorios", icon: BarChart3 },
  ],
  coordenador: [
    { title: "Dashboard", url: "/coordenacao", icon: LayoutDashboard },
    { title: "Turmas", url: "/coordenacao/turmas", icon: Users },
    { title: "Docentes", url: "/coordenacao/docentes", icon: GraduationCap },
    { title: "Indicadores", url: "/coordenacao/indicadores", icon: BarChart3 },
    { title: "Banco de Questões", url: "/coordenacao/questoes", icon: Library },
  ],
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Usuários", url: "/admin/usuarios", icon: Users },
    { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
    { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
  ],
};

const roleLabels: Record<UserRole, string> = {
  aluno: "Aluno",
  professor: "Professor",
  coordenador: "Coordenação",
  admin: "Administrador",
};

function AppSidebarContent() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        {/* Brand */}
        <div className="p-4 flex items-center gap-2.5 border-b border-sidebar-border">
          <Scale className="h-6 w-6 text-sidebar-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-display text-sidebar-foreground tracking-tight">
              AVAL<span className="text-sidebar-primary">.IA</span>
            </span>
          )}
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">{roleLabels[user.role]}</p>
            <p className="text-sm text-sidebar-foreground font-medium truncate mt-0.5">{user.name}</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wider px-4">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === `/${user.role}` || item.url === "/coordenacao"}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card px-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <span className="text-sm text-muted-foreground">{roleLabels[user.role]}</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
