import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Plus, Search, Edit2, Trash2, Check, X, GraduationCap,
} from "lucide-react";
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

interface Turma {
  id: string;
  codigo: string;
  nome: string;
  periodo: string;
  turno: "Matutino" | "Vespertino" | "Noturno";
  status: "Ativa" | "Inativa";
  alunos: string[]; // user ids
}

const INITIAL_TURMAS: Turma[] = [
  { id: "t1", codigo: "DIR-1A", nome: "Direito 1º Período - Turma A", periodo: "1º", turno: "Matutino", status: "Ativa", alunos: ["u1"] },
  { id: "t2", codigo: "DIR-1B", nome: "Direito 1º Período - Turma B", periodo: "1º", turno: "Noturno", status: "Ativa", alunos: ["u8"] },
  { id: "t3", codigo: "DIR-3B", nome: "Direito 3º Período - Turma B", periodo: "3º", turno: "Noturno", status: "Ativa", alunos: ["u5", "u7", "u11"] },
  { id: "t4", codigo: "DIR-5B", nome: "Direito 5º Período - Turma B", periodo: "5º", turno: "Vespertino", status: "Ativa", alunos: ["u12"] },
  { id: "t5", codigo: "DIR-7A", nome: "Direito 7º Período - Turma A", periodo: "7º", turno: "Matutino", status: "Inativa", alunos: [] },
];

const ALUNOS_DISPONIVEIS = [
  { id: "u1", nome: "Maria Silva" },
  { id: "u5", nome: "Fernanda Lima" },
  { id: "u7", nome: "Pedro Almeida" },
  { id: "u8", nome: "Juliana Costa" },
  { id: "u11", nome: "Ricardo Lima" },
  { id: "u12", nome: "Camila Rocha" },
];

const emptyTurma: Omit<Turma, "id"> = { codigo: "", nome: "", periodo: "1º", turno: "Matutino", status: "Ativa", alunos: [] };

export default function AdminTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>(INITIAL_TURMAS);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Turma | null>(null);
  const [form, setForm] = useState(emptyTurma);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [vincularOpen, setVincularOpen] = useState<Turma | null>(null);

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

  const openCreate = () => { setEditando(null); setForm(emptyTurma); setDialogOpen(true); };

  const openEdit = (t: Turma) => {
    setEditando(t);
    setForm({ codigo: t.codigo, nome: t.nome, periodo: t.periodo, turno: t.turno, status: t.status, alunos: [...t.alunos] });
    setDialogOpen(true);
  };

  const salvar = () => {
    if (!form.codigo.trim() || !form.nome.trim()) {
      toast({ title: "Preencha código e nome", variant: "destructive" });
      return;
    }
    if (editando) {
      setTurmas((prev) => prev.map((t) => t.id === editando.id ? { ...t, ...form } : t));
      toast({ title: "Turma atualizada com sucesso" });
    } else {
      setTurmas((prev) => [...prev, { ...form, id: `t${Date.now()}` }]);
      toast({ title: "Turma criada com sucesso" });
    }
    setDialogOpen(false);
  };

  const excluir = (id: string) => {
    setTurmas((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Turma excluída" });
  };

  const toggleAluno = (turmaId: string, alunoId: string) => {
    setTurmas((prev) => prev.map((t) => {
      if (t.id !== turmaId) return t;
      const has = t.alunos.includes(alunoId);
      return { ...t, alunos: has ? t.alunos.filter((a) => a !== alunoId) : [...t.alunos, alunoId] };
    }));
  };

  const getNomeAluno = (id: string) => ALUNOS_DISPONIVEIS.find((a) => a.id === id)?.nome || id;

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
                {filtradas.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{t.codigo}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{t.nome}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{t.periodo}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground hidden md:table-cell">{t.turno}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => setVincularOpen(t)} className="cursor-pointer">
                        <Badge className="text-[10px] bg-info/10 text-info border-info/20">{t.alunos.length} alunos</Badge>
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
                {filtradas.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Nenhuma turma encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
                  <Select value={form.turno} onValueChange={(v) => setForm({ ...form, turno: v as Turma["turno"] })}>
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
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Turma["status"] })}>
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
              {ALUNOS_DISPONIVEIS.map((a) => {
                const vinculado = vincularOpen?.alunos.includes(a.id);
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
