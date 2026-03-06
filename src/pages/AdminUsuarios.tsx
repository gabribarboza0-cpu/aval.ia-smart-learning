import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Plus, Search, Edit2, Trash2, Check, X, Shield,
  GraduationCap, BookOpen, UserCheck, UserX, ChevronDown,
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

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "Aluno" | "Professor" | "Coordenador" | "Admin";
  status: "Ativo" | "Inativo";
  turma?: string;
  disciplina?: string;
  criadoEm: string;
}

const INITIAL_USUARIOS: Usuario[] = [
  { id: "u1", nome: "Maria Silva", email: "maria@uni.edu.br", perfil: "Aluno", status: "Ativo", turma: "DIR-1A", criadoEm: "2025-08-10" },
  { id: "u2", nome: "Dr. João Santos", email: "joao@uni.edu.br", perfil: "Professor", status: "Ativo", disciplina: "D. Civil", criadoEm: "2024-02-15" },
  { id: "u3", nome: "Dra. Ana Oliveira", email: "ana@uni.edu.br", perfil: "Coordenador", status: "Ativo", criadoEm: "2023-08-01" },
  { id: "u4", nome: "Carlos Admin", email: "carlos@uni.edu.br", perfil: "Admin", status: "Ativo", criadoEm: "2023-01-10" },
  { id: "u5", nome: "Fernanda Lima", email: "fernanda@uni.edu.br", perfil: "Aluno", status: "Inativo", turma: "DIR-3B", criadoEm: "2025-03-20" },
  { id: "u6", nome: "Prof. Beatriz Nunes", email: "beatriz@uni.edu.br", perfil: "Professor", status: "Ativo", disciplina: "D. Trabalhista", criadoEm: "2024-06-10" },
  { id: "u7", nome: "Pedro Almeida", email: "pedro@uni.edu.br", perfil: "Aluno", status: "Ativo", turma: "DIR-3B", criadoEm: "2025-08-10" },
  { id: "u8", nome: "Juliana Costa", email: "juliana@uni.edu.br", perfil: "Aluno", status: "Ativo", turma: "DIR-1B", criadoEm: "2025-08-10" },
  { id: "u9", nome: "Prof. Carlos Lima", email: "carloslima@uni.edu.br", perfil: "Professor", status: "Ativo", disciplina: "D. Penal", criadoEm: "2024-02-15" },
  { id: "u10", nome: "Prof. Roberto Mendes", email: "roberto@uni.edu.br", perfil: "Professor", status: "Ativo", disciplina: "D. Tributário", criadoEm: "2025-01-20" },
  { id: "u11", nome: "Ricardo Lima", email: "ricardo@uni.edu.br", perfil: "Aluno", status: "Ativo", turma: "DIR-3B", criadoEm: "2025-08-10" },
  { id: "u12", nome: "Camila Rocha", email: "camila@uni.edu.br", perfil: "Aluno", status: "Ativo", turma: "DIR-5B", criadoEm: "2025-08-10" },
];

const PERFIL_BADGE: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Professor: "bg-accent/10 text-accent-foreground border-accent/20",
  Coordenador: "bg-info/10 text-info border-info/20",
  Aluno: "bg-muted text-muted-foreground border-border",
};

const PERFIL_ICON: Record<string, React.ReactNode> = {
  Admin: <Shield className="h-3.5 w-3.5" />,
  Professor: <GraduationCap className="h-3.5 w-3.5" />,
  Coordenador: <BookOpen className="h-3.5 w-3.5" />,
  Aluno: <Users className="h-3.5 w-3.5" />,
};

const emptyUser: Omit<Usuario, "id" | "criadoEm"> = {
  nome: "", email: "", perfil: "Aluno", status: "Ativo", turma: "", disciplina: "",
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroPerfil !== "todos" && u.perfil !== filtroPerfil) return false;
      if (filtroStatus !== "todos" && u.status !== filtroStatus) return false;
      if (busca) {
        const q = busca.toLowerCase();
        return u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [usuarios, busca, filtroPerfil, filtroStatus]);

  const openCreate = () => {
    setEditando(null);
    setForm(emptyUser);
    setDialogOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditando(u);
    setForm({ nome: u.nome, email: u.email, perfil: u.perfil, status: u.status, turma: u.turma || "", disciplina: u.disciplina || "" });
    setDialogOpen(true);
  };

  const salvar = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      toast({ title: "Preencha nome e e-mail", variant: "destructive" });
      return;
    }
    if (editando) {
      setUsuarios((prev) => prev.map((u) => u.id === editando.id ? { ...u, ...form } : u));
      toast({ title: "Usuário atualizado com sucesso" });
    } else {
      const novo: Usuario = {
        ...form,
        id: `u${Date.now()}`,
        criadoEm: new Date().toISOString().slice(0, 10),
      };
      setUsuarios((prev) => [...prev, novo]);
      toast({ title: "Usuário criado com sucesso" });
    }
    setDialogOpen(false);
  };

  const excluir = (id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Usuário excluído" });
  };

  const toggleStatus = (id: string) => {
    setUsuarios((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === "Ativo" ? "Inativo" : "Ativo" } : u
    ));
  };

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter((u) => u.status === "Ativo").length,
    alunos: usuarios.filter((u) => u.perfil === "Aluno").length,
    professores: usuarios.filter((u) => u.perfil === "Professor").length,
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
            <p className="text-sm text-muted-foreground mt-1">{stats.total} usuários • {stats.ativos} ativos</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Usuário
          </Button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Ativos", value: stats.ativos, color: "text-success" },
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
            <Input placeholder="Buscar por nome ou e-mail..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
          </div>
          <Select value={filtroPerfil} onValueChange={setFiltroPerfil}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Perfil" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Aluno">Aluno</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Coordenador">Coordenador</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
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
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">E-mail</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Perfil</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Detalhe</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Criado</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{u.nome}</p>
                      <p className="text-[10px] text-muted-foreground md:hidden">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{u.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={`text-[10px] gap-1 ${PERFIL_BADGE[u.perfil]}`}>
                        {PERFIL_ICON[u.perfil]} {u.perfil}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground hidden sm:table-cell">
                      {u.turma || u.disciplina || "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleStatus(u.id)} className="inline-flex items-center gap-1">
                        {u.status === "Ativo" ? (
                          <Badge className="text-[10px] bg-success/10 text-success border-success/20 cursor-pointer">
                            <UserCheck className="h-3 w-3 mr-0.5" /> Ativo
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] bg-muted text-muted-foreground border-border cursor-pointer">
                            <UserX className="h-3 w-3 mr-0.5" /> Inativo
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(u.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(u)}>
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {deleteConfirm === u.id ? (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => excluir(u.id)}>
                              <Check className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(null)}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(u.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
              <div>
                <Label className="text-xs">E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@instituicao.edu.br" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Perfil</Label>
                  <Select value={form.perfil} onValueChange={(v) => setForm({ ...form, perfil: v as Usuario["perfil"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aluno">Aluno</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Coordenador">Coordenador</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Usuario["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.perfil === "Aluno" && (
                <div>
                  <Label className="text-xs">Turma</Label>
                  <Input value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} placeholder="Ex: DIR-1A" />
                </div>
              )}
              {form.perfil === "Professor" && (
                <div>
                  <Label className="text-xs">Disciplina</Label>
                  <Input value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} placeholder="Ex: D. Constitucional" />
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={salvar}>{editando ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AppLayout>
  );
}
