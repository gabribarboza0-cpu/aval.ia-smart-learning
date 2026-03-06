import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Library, Plus, BarChart3, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import QuestaoFilters, { QuestaoFilterValues, defaultFilters } from "@/components/questoes/QuestaoFilters";
import QuestaoCard from "@/components/questoes/QuestaoCard";
import QuestaoDetailDialog from "@/components/questoes/QuestaoDetailDialog";
import QuestaoFormDialog from "@/components/questoes/QuestaoFormDialog";
import { Questao } from "@/types/questao";
import { fetchQuestoes } from "@/lib/questaoService";
import { useAuth } from "@/hooks/useAuth";

export default function BancoQuestoes() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [filters, setFilters] = useState<QuestaoFilterValues>(defaultFilters);
  const [viewQuestao, setViewQuestao] = useState<Questao | null>(null);
  const [editQuestao, setEditQuestao] = useState<Questao | null | undefined>(undefined);
  const [viewOpen, setViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadQuestoes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuestoes();
      setQuestoes(data);
    } catch (e) {
      console.error("Erro ao carregar questões:", e);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadQuestoes(); }, []);

  const professores = useMemo(() => [...new Set(questoes.map((q) => q.professorResponsavel).filter(Boolean))], [questoes]);

  const filtered = useMemo(() => {
    return questoes.filter((q) => {
      if (filters.busca) {
        const s = filters.busca.toLowerCase();
        if (!q.enunciado.toLowerCase().includes(s) && !q.tema.toLowerCase().includes(s) && !q.id.toLowerCase().includes(s)) return false;
      }
      if (filters.disciplina && q.disciplinaPredominante !== filters.disciplina) return false;
      if (filters.dificuldade && q.nivelDificuldade !== filters.dificuldade) return false;
      if (filters.tipoQuestao && q.tipoQuestao !== filters.tipoQuestao) return false;
      if (filters.status && q.statusValidacao !== filters.status) return false;
      if (filters.professor && q.professorResponsavel !== filters.professor) return false;
      if (filters.competencia && !q.competencias.includes(filters.competencia)) return false;
      return true;
    });
  }, [questoes, filters]);

  const stats = useMemo(() => {
    const validadas = questoes.filter((q) => q.statusValidacao === "Validada").length;
    const usadas = questoes.filter((q) => q.historicoUso > 0);
    const mediaAcerto = usadas.length > 0 ? usadas.reduce((s, q) => s + q.taxaAcerto, 0) / usadas.length : 0;
    const disciplinas = new Set(questoes.map((q) => q.disciplinaPredominante)).size;
    return { total: questoes.length, validadas, mediaAcerto: Math.round(mediaAcerto), disciplinas };
  }, [questoes]);

  const handleView = (q: Questao) => { setViewQuestao(q); setViewOpen(true); };
  const handleEdit = (q: Questao) => setEditQuestao(q);
  const handleNew = () => setEditQuestao(null);

  const handleSave = () => {
    loadQuestoes();
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Library className="h-6 w-6 text-accent" />
              Banco de Questões
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Repositório institucional de questões pedagógicas</p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Questão
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total de Questões" value={String(stats.total)} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Validadas" value={String(stats.validadas)} icon={<CheckCircle className="h-5 w-5" />} subtitle={`${Math.round((stats.validadas / Math.max(1, stats.total)) * 100)}% do total`} />
          <StatCard title="Média de Acerto" value={`${stats.mediaAcerto}%`} icon={<BarChart3 className="h-5 w-5" />} />
          <StatCard title="Disciplinas" value={String(stats.disciplinas)} icon={<Library className="h-5 w-5" />} subtitle="áreas cobertas" />
        </div>

        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <QuestaoFilters filters={filters} onChange={setFilters} professores={professores} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Carregando..." : `${filtered.length} questão${filtered.length !== 1 ? "ões" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestaoCard key={q.id} questao={q} onView={handleView} onEdit={handleEdit} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhuma questão encontrada com os filtros selecionados.</p>
            </div>
          )}
        </div>

        <QuestaoDetailDialog questao={viewQuestao} open={viewOpen} onOpenChange={setViewOpen} />
        <QuestaoFormDialog
          questao={editQuestao === undefined ? undefined : editQuestao}
          open={editQuestao !== undefined}
          onOpenChange={(open) => { if (!open) setEditQuestao(undefined); }}
          onSave={handleSave}
          professorId={user?.id}
        />
      </motion.div>
    </AppLayout>
  );
}
