import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Plus, Search, Edit2, Trash2, Check, X, Users,
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

interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  periodo: string;
  status: "Ativa" | "Inativa";
  professorId?: string;
  turmasVinculadas: string[];
}

const PROFESSORES = [
  { id: "u2", nome: "Dr. João Santos" },
  { id: "u6", nome: "Prof. Beatriz Nunes" },
  { id: "u9", nome: "Prof. Carlos Lima" },
  { id: "u10", nome: "Prof. Roberto Mendes" },
];

const TURMAS = [
  { id: "t1", codigo: "DIR-1A" },
  { id: "t2", codigo: "DIR-1B" },
  { id: "t3", codigo: "DIR-3B" },
  { id: "t4", codigo: "DIR-5B" },
];

const INITIAL_DISCIPLINAS: Disciplina[] = [
  { id: "d1", codigo: "DCV01", nome: "Direito Civil I", cargaHoraria: 80, periodo: "1º", status: "Ativa", professorId: "u2", turmasVinculadas: ["t1", "t2"] },
  { id: "d2", codigo: "DPN01", nome: "Direito Penal I", cargaHoraria: 80, periodo: "1º", status: "Ativa", professorId: "u9", turmasVinculadas: ["t1", "t2"] },
  { id: "d3", codigo: "DTR01", nome: "Direito Trabalhista I", cargaHoraria: 60, periodo: "3º", status: "Ativa", professorId: "u6", turmasVinculadas: ["t3"] },
  { id: "d4", codigo: "DTB01", nome: "Direito Tributário I", cargaHoraria: 60, periodo: "5º", status: "Ativa", professorId: "u10", turmasVinculadas: ["t4"] },
  { id: "d5", codigo: "DCN01", nome: "Direito Constitucional I", cargaHoraria: 80, periodo: "1º", status: "Ativa", turmasVinculadas: ["t1", "t2"] },
  { id: "d6", codigo: "DPR01", nome: "Direito Processual Civil I", cargaHoraria: 80, periodo: "3º", status: "Inativa", turmasVinculadas: [] },
];

const emptyForm: Omit<Disciplina, "id"> = { codigo: "", nome: "", cargaHoraria: 60, periodo: "1º", status: "Ativa", professorId: "", turmasVinculadas: [] };

export default function AdminDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(INITIAL_DISCIPLINAS);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Disciplina | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [vincularOpen, setVincularOpen] = useState<Disciplina | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    setForm({ codigo: d.codigo, nome: d.nome, cargaHoraria: d.cargaHoraria, periodo: d.periodo, status: d.status, professorId: d.professorId || "", turmasVinculadas: [...d.turmasVinculadas] });
    setDialogOpen(true);
  };

  const salvar = () => {
    if (!form.codigo.trim() || !form.nome.trim()) {
      toast({ title: "Preencha código e nome", variant: "destructive" });
      return;
    }
    if (editando) {
      setDisciplinas((prev) => prev.map((d) => d.id === editando.id ? { ...d, ...form } : d));
      toast({ title: "Disciplina atualizada com sucesso" });
    } else {
      setDisciplinas((prev) => [...prev, { ...form, id: `d${Date.now()}` }]);
      toast({ title: "Disciplina criada com sucesso" });
    }
    setDialogOpen(false);
  };

  const excluir = (id: string) => {
    setDisciplinas((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Disciplina excluída" });
  };

  const toggleTurma = (discId: string, turmaId: string) => {
    setDisciplinas((prev) => prev.map((d) => {
      if (d.id !== discId) return d;
      const has = d.turmasVinculadas.includes(turmaId);
      return { ...d, turmasVinculadas: has ? d.turmasVinculadas.filter((t) => t !== turmaId) : [...d.turmasVinculadas, turmaId] };
    }));
  };

  const getProfNome = (id?: string) => PROFESSORES.find((p) => p.id === id)?.nome || "—";
  const getTurmaCodigo = (id: string) => TURMAS.find((t) => t.id === id)?.codigo || id;

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
                {filtradas.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{d.codigo}</td>
                    <td className="py-3 px-4 text-foreground">{d.nome}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden sm:table-cell">{d.cargaHoraria}h</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden md:table-cell">{d.periodo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{getProfNome(d.professorId)}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => setVincularOpen(d)} className="cursor-pointer">
                        <Badge className="text-[10px] bg-info/10 text-info border-info/20">{d.turmasVinculadas.length} turmas</Badge>
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
                {filtradas.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Nenhuma disciplina encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
                  <Input type="number" value={form.cargaHoraria} onChange={(e) => setForm({ ...form, cargaHoraria: Number(e.target.value) })} />
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
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Disciplina["status"] })}>
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
                <Select value={form.professorId} onValueChange={(v) => setForm({ ...form, professorId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {PROFESSORES.map((p) => (
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
            <div className="space-y-2 py-2">
              {TURMAS.map((t) => {
                const vinculada = vincularOpen?.turmasVinculadas.includes(t.id);
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
