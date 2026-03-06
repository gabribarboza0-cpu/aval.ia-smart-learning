import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Plus, Search, Edit2, Trash2, Check, X, Shield,
  GraduationCap, BookOpen, UserCheck, UserX,
} from "lucide-react";
import TablePagination from "@/components/TablePagination";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/hooks/useAuth";

interface Usuario {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const PERFIL_BADGE: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  professor: "bg-accent/10 text-accent-foreground border-accent/20",
  coordenador: "bg-info/10 text-info border-info/20",
  aluno: "bg-muted text-muted-foreground border-border",
};

const PERFIL_ICON: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3.5 w-3.5" />,
  professor: <GraduationCap className="h-3.5 w-3.5" />,
  coordenador: <BookOpen className="h-3.5 w-3.5" />,
  aluno: <Users className="h-3.5 w-3.5" />,
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  professor: "Professor",
  coordenador: "Coordenador",
  aluno: "Aluno",
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", password: "", role: "aluno" as UserRole });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, nome, created_at");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (profiles && roles) {
      const roleMap = new Map(roles.map((r) => [r.user_id, r.role as UserRole]));
      const users: Usuario[] = profiles.map((p) => ({
        id: p.id,
        user_id: p.user_id,
        nome: p.nome,
        email: "", // populated below
        role: roleMap.get(p.user_id) || "aluno",
        created_at: p.created_at,
      }));
      setUsuarios(users);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const filtrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroPerfil !== "todos" && u.role !== filtroPerfil) return false;
      if (busca) {
        const q = busca.toLowerCase();
        return u.nome.toLowerCase().includes(q);
      }
      return true;
    });
  }, [usuarios, busca, filtroPerfil]);

  const openCreate = () => {
    setEditando(null);
    setForm({ nome: "", email: "", password: "", role: "aluno" });
    setDialogOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditando(u);
    setForm({ nome: u.nome, email: u.email, password: "", role: u.role });
    setDialogOpen(true);
  };

  const salvar = async () => {
    if (!form.nome.trim()) {
      toast({ title: "Preencha o nome", variant: "destructive" });
      return;
    }
    if (editando) {
      // Update profile name
      await supabase.from("profiles").update({ nome: form.nome }).eq("id", editando.id);
      // Update role
      await supabase.from("user_roles").update({ role: form.role }).eq("user_id", editando.user_id);
      toast({ title: "Usuário atualizado com sucesso" });
    } else {
      if (!form.email.trim() || !form.password.trim()) {
        toast({ title: "Preencha e-mail e senha", variant: "destructive" });
        return;
      }
      // Create user via auth (trigger auto-creates profile + role)
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nome: form.nome, role: form.role } },
      });
      if (error) {
        toast({ title: "Erro ao criar usuário", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Usuário criado com sucesso" });
    }
    setDialogOpen(false);
    fetchUsuarios();
  };

  const excluir = async (userId: string) => {
    // We can't delete auth users from client-side, so just remove profile/role
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);
    setDeleteConfirm(null);
    toast({ title: "Usuário removido" });
    fetchUsuarios();
  };

  const stats = {
    total: usuarios.length,
    alunos: usuarios.filter((u) => u.role === "aluno").length,
    professores: usuarios.filter((u) => u.role === "professor").length,
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-accent" />
              Gestão de Usuários
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{stats.total} usuários cadastrados</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Usuário
          </Button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Alunos", value: stats.alunos, color: "text-info" },
            { label: "Professores", value: stats.professores, color: "text-accent-foreground" },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-3 text-center shadow-card">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
          </div>
          <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Perfil" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="aluno">Aluno</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="coordenador">Coordenador</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Perfil</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Criado</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">Carregando...</td></tr>
                ) : filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{u.nome}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-[10px] gap-1 ${PERFIL_BADGE[u.role]}`}>
                        {PERFIL_ICON[u.role]} {ROLE_LABELS[u.role]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(u)}>
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {deleteConfirm === u.user_id ? (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => excluir(u.user_id)}>
                              <Check className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(null)}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(u.user_id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filtrados.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination totalItems={filtrados.length} currentPage={currentPage} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
        </div>

        {/* Dialog criar/editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs">Nome completo</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do usuário" />
              </div>
              {!editando && (
                <>
                  <div>
                    <Label className="text-xs">E-mail</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@instituicao.edu.br" />
                  </div>
                  <div>
                    <Label className="text-xs">Senha</Label>
                    <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
                  </div>
                </>
              )}
              <div>
                <Label className="text-xs">Perfil</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="coordenador">Coordenador</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={salvar}>{editando ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AppLayout>
  );
}
