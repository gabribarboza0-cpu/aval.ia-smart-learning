import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Send, Eye, EyeOff, Trash2, ArrowLeft, Clock, BookOpen, Target, BarChart3, Shuffle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avaliacao } from "@/types/avaliacao";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface Props {
  avaliacao: Avaliacao;
  onBack: () => void;
  onPublish: () => void;
  onRemoveQuestao: (index: number) => void;
  onShuffleQuestoes: () => void;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--destructive))",
];

export default function AvaliacaoPreview({ avaliacao, onBack, onPublish, onRemoveQuestao, onShuffleQuestoes }: Props) {
  const [showGabarito, setShowGabarito] = useState(false);
  const { toast } = useToast();
  const { config, questoes } = avaliacao;

  // Stats
  const disciplinaCount: Record<string, number> = {};
  const dificuldadeCount: Record<string, number> = {};
  questoes.forEach((q) => {
    disciplinaCount[q.disciplinaPredominante] = (disciplinaCount[q.disciplinaPredominante] || 0) + 1;
    dificuldadeCount[q.nivelDificuldade] = (dificuldadeCount[q.nivelDificuldade] || 0) + 1;
  });

  const disciplinaData = Object.entries(disciplinaCount).map(([name, value]) => ({ name, value }));
  const dificuldadeData = Object.entries(dificuldadeCount).map(([name, value]) => ({ name, value }));

  const mediaAcertoHistorico = questoes.filter((q) => q.historicoUso > 0).reduce((s, q) => s + q.taxaAcerto, 0) / Math.max(1, questoes.filter((q) => q.historicoUso > 0).length);

  const handleDownload = () => {
    toast({ title: "Download iniciado", description: "A prova será baixada em PDF." });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="gap-1 -ml-3 mb-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao formulário
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">{config.titulo}</h1>
          <p className="text-sm text-muted-foreground mt-1">{config.descricao || "Sem descrição"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onShuffleQuestoes} className="gap-1">
            <Shuffle className="h-3.5 w-3.5" /> Embaralhar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
            <Download className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button size="sm" onClick={onPublish} className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="h-3.5 w-3.5" /> Publicar para Turma
          </Button>
        </div>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> {config.tipoAvaliacao}</Badge>
        <Badge variant="outline" className="gap-1"><BookOpen className="h-3 w-3" /> {questoes.length} questões</Badge>
        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {config.tempoProva} min</Badge>
        <Badge variant="outline" className="gap-1"><Target className="h-3 w-3" /> {config.nivelDificuldade}</Badge>
        <Badge variant="outline">{config.turma}</Badge>
        <Badge variant="outline">{config.modoAplicacao}</Badge>
        {config.aderenciaENADE && <Badge className="bg-info/10 text-info border-info/20">ENADE</Badge>}
      </div>

      {/* Dashboard estrutural */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Questões</p>
          <p className="text-2xl font-bold text-foreground mt-1">{questoes.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Disciplinas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{Object.keys(disciplinaCount).length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Média Acerto Histórico</p>
          <p className="text-2xl font-bold text-foreground mt-1">{Math.round(mediaAcertoHistorico)}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Nota Total</p>
          <p className="text-2xl font-bold text-foreground mt-1">{avaliacao.notaTotal.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-3">Distribuição por Disciplina</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={disciplinaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name.split(" ").pop()} (${value})`} labelLine={false} fontSize={10}>
                {disciplinaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-3">Distribuição por Dificuldade</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dificuldadeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gabarito toggle */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setShowGabarito(!showGabarito)} className="gap-1">
          {showGabarito ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showGabarito ? "Ocultar Gabarito" : "Mostrar Gabarito"}
        </Button>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {questoes.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="bg-card rounded-lg border border-border p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Q{String(idx + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="outline" className="text-xs">{q.disciplinaPredominante}</Badge>
                  <Badge variant="outline" className="text-xs">{q.nivelDificuldade}</Badge>
                  <span className="text-xs text-muted-foreground">{avaliacao.pontuacaoPorQuestao[idx]?.toFixed(1)} pts</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{q.enunciado}</p>

                <div className="mt-3 space-y-1.5">
                  {q.alternativas.map((alt, ai) => (
                    <div
                      key={ai}
                      className={`text-sm px-3 py-1.5 rounded-md ${
                        showGabarito && ai === q.gabarito
                          ? "bg-success/10 text-success font-medium border border-success/20"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + ai)})</span>
                      {alt}
                      {showGabarito && ai === q.gabarito && <CheckCircle className="h-3.5 w-3.5 inline ml-2" />}
                    </div>
                  ))}
                </div>

                {showGabarito && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-md border border-border/50">
                    <p className="text-xs font-medium text-foreground mb-1">Justificativa:</p>
                    <p className="text-xs text-muted-foreground">{q.justificativa}</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onRemoveQuestao(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
