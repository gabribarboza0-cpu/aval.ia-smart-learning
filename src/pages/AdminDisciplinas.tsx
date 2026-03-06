import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Plus, Search, Edit2, Trash2, Check, X,
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

interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  carga_horaria: number;
  periodo: string;
  status: string;
  professor_id: string | null;
  professor_nome?: string;
  turmas_count: number;
}

const emptyForm = { codigo: "", nome: "", carga_horaria: 60, periodo: "1º", status: "Ativa", professor_id: "" };

export default function AdminDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Disciplina | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [vincularOpen, setVincularOpen] = useState<Disciplina | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [professores, setProfessores] = useState<{ id: string; nome: string }[]>([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<{ id: string; codigo: string }[]>([]);
  const [turmasVinculadas, setTurmasVinculadas] = useState<string[]>([]);

  const fetchDisciplinas = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("disciplinas")
      .select("*, disciplina_turmas(count)")
      .order("codigo");

    if (data) {
      // Fetch professor names
      const profIds = [...new Set(data.filter((d: any) => d.professor_id).map((d: any) => d.professor_id))];
      let profMap = new Map<string, string>();
      if (profIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, nome").in("user_id", profIds);
        profiles?.forEach((p) => profMap.set(p.user_id, p.nome));
      }

      setDisciplinas(data.map((d: any) => ({
        id: d.id,
        codigo: d.codigo,
        nome: d.nome,
        carga_horaria: d.carga_horaria,
        periodo: d.periodo,
        status: d.status,
        professor_id: d.professor_id,
        professor_nome: d.professor_id ? profMap.get(d.professor_id) || "—" : "—",
        turmas_count: d.disciplina_turmas?.[0]?.count || 0,
      })));
    }
    setIsLoading(false);
  };

  const fetchProfessores = async () => {
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "professor");
    if (roles) {
      const ids = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, nome").in("user_id", ids);
      setProfessores(profiles?.map((p) => ({ id: p.user_id, nome: p.nome })) || []);
    }
  };

  useEffect(() => { fetchDisciplinas(); fetchProfessores(); }, []);

  const filtradas = useMemo(() => {
    return disciplinas.filter((d) => {
      if (filtroStatus !== "todos" && d.status !== filtroStatus) return false;
      if (busca) {
        const q = busca.toLowerCase();
        return d.codigo.toLowerCase().includes(q) || d.nome.toLowerCase().includes(q);
      }
      return true;
    });
  }, [disciplinas, busca, filtroStatus]);

  const openCreate = () => { setEditando(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (d: Disciplina) => {
    setEditando(d);
    setForm({ codigo: d.codigo, nome: d.nome, carga_horaria: d.carga_horaria, periodo: d.periodo, status: d.status, professor_id: d.professor_id || "" });
    setDialogOpen(true);
  };

  const salvar = async () => {
    if (!form.codigo.trim() || !form.nome.trim()) {
      toast({ title: "Preencha código e nome", variant: "destructive" });
      return;
    }
    const payload = {
      codigo: form.codigo, nome: form.nome, carga_horaria: form.carga_horaria,
      periodo: form.periodo, status: form.status,
      professor_id: form.professor_id || null,
    };
    if (editando) {
      const { error } = await supabase.from("disciplinas").update(payload).eq("id", editando.id);
      if (error) { toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Disciplina atualizada com sucesso" });
    } else {
      const { error } = await supabase.from("disciplinas").insert(payload);
      if (error) { toast({ title: "Erro ao criar", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Disciplina criada com sucesso" });
    }
    setDialogOpen(false);
    fetchDisciplinas();
  };

  const excluir = async (id: string) => {
    await supabase.from("disciplinas").delete().eq("id", id);
    setDeleteConfirm(null);
    toast({ title: "Disciplina excluída" });
    fetchDisciplinas();
  };

  const openVincularTurmas = async (d: Disciplina) => {
    setVincularOpen(d);
    const { data: turmas } = await supabase.from("turmas").select("id, codigo").eq("status", "Ativa").order("codigo");
    setTurmasDisponiveis(turmas || []);
    const { data: linked } = await supabase.from("disciplina_turmas").select("turma_id").eq("disciplina_id", d.id);
    setTurmasVinculadas(linked?.map((l) => l.turma_id) || []);
  };

  const toggleTurma = async (discId: string, turmaId: string) => {
    const isLinked = turmasVinculadas.includes(turmaId);
    if (isLinked) {
      await supabase.from("disciplina_turmas").delete().eq("disciplina_id", discId).eq("turma_id", turmaId);
      setTurmasVinculadas((prev) => prev.filter((t) => t !== turmaId));
    } else {
      await supabase.from("disciplina_turmas").insert({ disciplina_id: discId, turma_id: turmaId });
      setTurmasVinculadas((prev) => [...prev, turmaId]);
    }
    fetchDisciplinas();
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent" /> Gestão de Disciplinas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{disciplinas.length} disciplinas cadastradas</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Nova Disciplina</Button>
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
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Disciplina</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">CH</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Período</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Professor</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Turmas</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Carregando...</td></tr>
                ) : filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{d.codigo}</td>
                    <td className="py-3 px-4 text-foreground">{d.nome}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden sm:table-cell">{d.carga_horaria}h</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden md:table-cell">{d.periodo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{d.professor_nome}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openVincularTurmas(d)} className="cursor-pointer">
                        <Badge className="text-[10px] bg-info/10 text-info border-info/20">{d.turmas_count} turmas</Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`text-[10px] ${d.status === "Ativa" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}>
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {deleteConfirm === d.id ? (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => excluir(d.id)}>
                              <Check className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(null)}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirm(d.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filtradas.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Nenhuma disciplina encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination totalItems={filtradas.length} currentPage={currentPage} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
        </div>

        {/* Dialog criar/editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editando ? "Editar Disciplina" : "Nova Disciplina"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Código</Label>
                  <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="DCV01" />
                </div>
                <div>
                  <Label className="text-xs">Carga Horária</Label>
                  <Input type="number" value={form.carga_horaria} onChange={(e) => setForm({ ...form, carga_horaria: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Nome</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Direito Civil I" />
              </div>
              <div className="grid grid-cols-2 gap-3">
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
              <div>
                <Label className="text-xs">Professor responsável</Label>
                <Select value={form.professor_id} onValueChange={(v) => setForm({ ...form, professor_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {professores.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
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

        {/* Dialog vincular turmas */}
        <Dialog open={!!vincularOpen} onOpenChange={() => setVincularOpen(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Turmas — {vincularOpen?.nome}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2 max-h-64 overflow-y-auto">
              {turmasDisponiveis.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma turma cadastrada.</p>
              ) : turmasDisponiveis.map((t) => {
                const vinculada = turmasVinculadas.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => vincularOpen && toggleTurma(vincularOpen.id, t.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      vinculada ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <span>{t.codigo}</span>
                    {vinculada && <Check className="h-4 w-4" />}
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
