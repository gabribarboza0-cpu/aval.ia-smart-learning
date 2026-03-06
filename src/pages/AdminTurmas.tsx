import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, Check, X, GraduationCap,
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

interface Turma {
  id: string;
  codigo: string;
  nome: string;
  periodo: string;
  turno: "Matutino" | "Vespertino" | "Noturno";
  status: string;
  alunos_count: number;
}

interface TurmaAluno {
  aluno_id: string;
  nome: string;
}

const emptyForm = { codigo: "", nome: "", periodo: "1º", turno: "Matutino" as "Matutino" | "Vespertino" | "Noturno", status: "Ativa" };

export default function AdminTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Turma | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [vincularOpen, setVincularOpen] = useState<Turma | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<{ id: string; nome: string }[]>([]);
  const [alunosVinculados, setAlunosVinculados] = useState<string[]>([]);

  const fetchTurmas = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("turmas")
      .select("*, turma_alunos(count)")
      .order("codigo");

    if (data) {
      setTurmas(data.map((t: any) => ({
        id: t.id,
        codigo: t.codigo,
        nome: t.nome,
        periodo: t.periodo,
        turno: t.turno,
        status: t.status,
        alunos_count: t.turma_alunos?.[0]?.count || 0,
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchTurmas(); }, []);

  const filtradas = useMemo(() => {
    return turmas.filter((t) => {
      if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
      if (busca) {
        const q = busca.toLowerCase();
        return t.codigo.toLowerCase().includes(q) || t.nome.toLowerCase().includes(q);
      }
      return true;
    });
  }, [turmas, busca, filtroStatus]);

  const openCreate = () => { setEditando(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (t: Turma) => {
    setEditando(t);
    setForm({ codigo: t.codigo, nome: t.nome, periodo: t.periodo, turno: t.turno, status: t.status });
    setDialogOpen(true);
  };

  const salvar = async () => {
    if (!form.codigo.trim() || !form.nome.trim()) {
      toast({ title: "Preencha código e nome", variant: "destructive" });
      return;
    }
    if (editando) {
      const { error } = await supabase.from("turmas").update({
        codigo: form.codigo, nome: form.nome, periodo: form.periodo,
        turno: form.turno as any, status: form.status,
      }).eq("id", editando.id);
      if (error) { toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Turma atualizada com sucesso" });
    } else {
      const { error } = await supabase.from("turmas").insert({
        codigo: form.codigo, nome: form.nome, periodo: form.periodo,
        turno: form.turno as any, status: form.status,
      });
      if (error) { toast({ title: "Erro ao criar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Turma criada com sucesso" });
    }
    setDialogOpen(false);
    fetchTurmas();
  };

  const excluir = async (id: string) => {
    await supabase.from("turmas").delete().eq("id", id);
    setDeleteConfirm(null);
    toast({ title: "Turma excluída" });
    fetchTurmas();
  };

  const openVincular = async (t: Turma) => {
    setVincularOpen(t);
    // Fetch alunos (profiles with role aluno)
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "aluno");
    if (roles) {
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, nome").in("user_id", userIds);
      setAlunosDisponiveis(profiles?.map((p) => ({ id: p.user_id, nome: p.nome })) || []);
    }
    // Fetch currently linked
    const { data: linked } = await supabase.from("turma_alunos").select("aluno_id").eq("turma_id", t.id);
    setAlunosVinculados(linked?.map((l) => l.aluno_id) || []);
  };

  const toggleAluno = async (turmaId: string, alunoId: string) => {
    const isLinked = alunosVinculados.includes(alunoId);
    if (isLinked) {
      await supabase.from("turma_alunos").delete().eq("turma_id", turmaId).eq("aluno_id", alunoId);
      setAlunosVinculados((prev) => prev.filter((a) => a !== alunoId));
    } else {
      await supabase.from("turma_alunos").insert({ turma_id: turmaId, aluno_id: alunoId });
      setAlunosVinculados((prev) => [...prev, alunoId]);
    }
    fetchTurmas();
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-accent" /> Gestão de Turmas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{turmas.length} turmas cadastradas</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Nova Turma</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por código ou nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
          </div>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Ativa">Ativa</SelectItem>
              <SelectItem value="Inativa">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Código</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Nome</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Período</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Turno</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Alunos</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Carregando...</td></tr>
                ) : filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{t.codigo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{t.nome}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{t.periodo}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden md:table-cell">{t.turno}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openVincular(t)} className="cursor-pointer">
                        <Badge className="text-[10px] bg-info/10 text-info border-info/20">{t.alunos_count} alunos</Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`text-[10px] ${t.status === "Ativa" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}>
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {deleteConfirm === t.id ? (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => excluir(t.id)}>
                              <Check className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(null)}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(t.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filtradas.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Nenhuma turma encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination totalItems={filtradas.length} currentPage={currentPage} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
        </div>

        {/* Dialog criar/editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editando ? "Editar Turma" : "Nova Turma"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Código</Label>
                  <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="DIR-1A" />
                </div>
                <div>
                  <Label className="text-xs">Período</Label>
                  <Select value={form.periodo} onValueChange={(v) => setForm({ ...form, periodo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Nome da turma</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Direito 1º Período - Turma A" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Turno</Label>
                  <Select value={form.turno} onValueChange={(v) => setForm({ ...form, turno: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matutino">Matutino</SelectItem>
                      <SelectItem value="Vespertino">Vespertino</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Inativa">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={salvar}>{editando ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog vincular alunos */}
        <Dialog open={!!vincularOpen} onOpenChange={() => setVincularOpen(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Alunos — {vincularOpen?.codigo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2 max-h-64 overflow-y-auto">
              {alunosDisponiveis.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum aluno cadastrado no sistema.</p>
              ) : alunosDisponiveis.map((a) => {
                const vinculado = alunosVinculados.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => vincularOpen && toggleAluno(vincularOpen.id, a.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      vinculado ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <span>{a.nome}</span>
                    {vinculado && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            <DialogFooter>
              <Button onClick={() => setVincularOpen(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AppLayout>
  );
}
