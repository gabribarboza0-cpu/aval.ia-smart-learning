import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Award, Target, Calendar, BarChart3, ArrowUpRight,
  ArrowDownRight, Minus, ChevronDown, BookOpen, Brain, ClipboardList,
  Activity, Percent, Clock,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

// ===== Mock data =====
interface Avaliacao {
  id: string;
  nome: string;
  tipo: "AV1" | "AV2" | "AV3" | "Simulado" | "Quiz";
  data: string;
  nota: number;
  notaMaxima: number;
  acertos: number;
  total: number;
  tempo: number; // minutos
  disciplinas: { nome: string; nota: number; max: number }[];
  competencias: { nome: string; percentual: number }[];
}

const historicoAvaliacoes: Avaliacao[] = [
  {
    id: "av1", nome: "AV1 — D. Constitucional", tipo: "AV1", data: "2025-08-15", nota: 6.5, notaMaxima: 10, acertos: 13, total: 20, tempo: 85,
    disciplinas: [{ nome: "D. Constitucional", nota: 6.0, max: 7 }, { nome: "D. Humanos", nota: 0.5, max: 3 }],
    competencias: [{ nome: "Interpretação Normativa", percentual: 70 }, { nome: "Análise Crítica", percentual: 55 }, { nome: "Argumentação", percentual: 65 }],
  },
  {
    id: "av2", nome: "Simulado ENADE #1", tipo: "Simulado", data: "2025-09-10", nota: 7.2, notaMaxima: 10, acertos: 18, total: 25, tempo: 120,
    disciplinas: [{ nome: "D. Constitucional", nota: 2.5, max: 3 }, { nome: "D. Civil", nota: 2.0, max: 3 }, { nome: "D. Penal", nota: 1.5, max: 2 }, { nome: "D. Administrativo", nota: 1.2, max: 2 }],
    competencias: [{ nome: "Interpretação Normativa", percentual: 75 }, { nome: "Análise Crítica", percentual: 68 }, { nome: "Argumentação", percentual: 72 }, { nome: "Interdisciplinaridade", percentual: 60 }],
  },
  {
    id: "q1", nome: "Quiz: Atos Administrativos", tipo: "Quiz", data: "2025-09-22", nota: 7.8, notaMaxima: 10, acertos: 8, total: 10, tempo: 15,
    disciplinas: [{ nome: "D. Administrativo", nota: 7.8, max: 10 }],
    competencias: [{ nome: "Análise Crítica", percentual: 80 }, { nome: "Raciocínio Lógico", percentual: 75 }],
  },
  {
    id: "av3", nome: "AV2 — D. Civil", tipo: "AV2", data: "2025-10-05", nota: 8.1, notaMaxima: 10, acertos: 16, total: 20, tempo: 90,
    disciplinas: [{ nome: "D. Civil", nota: 6.5, max: 7 }, { nome: "D. Empresarial", nota: 1.6, max: 3 }],
    competencias: [{ nome: "Aplicação Prática", percentual: 85 }, { nome: "Argumentação", percentual: 80 }, { nome: "Interpretação Normativa", percentual: 78 }],
  },
  {
    id: "q2", nome: "Quiz: Princípios Tributários", tipo: "Quiz", data: "2025-10-18", nota: 6.0, notaMaxima: 10, acertos: 6, total: 10, tempo: 12,
    disciplinas: [{ nome: "D. Tributário", nota: 6.0, max: 10 }],
    competencias: [{ nome: "Interpretação Normativa", percentual: 65 }, { nome: "Raciocínio Lógico", percentual: 55 }],
  },
  {
    id: "av4", nome: "AV3 — D. Penal", tipo: "AV3", data: "2025-11-12", nota: 8.5, notaMaxima: 10, acertos: 17, total: 20, tempo: 78,
    disciplinas: [{ nome: "D. Penal", nota: 6.8, max: 7 }, { nome: "D. Constitucional", nota: 1.7, max: 3 }],
    competencias: [{ nome: "Análise Crítica", percentual: 88 }, { nome: "Argumentação", percentual: 85 }, { nome: "Aplicação Prática", percentual: 82 }],
  },
  {
    id: "sim2", nome: "Simulado ENADE #2", tipo: "Simulado", data: "2025-12-01", nota: 8.0, notaMaxima: 10, acertos: 20, total: 25, tempo: 110,
    disciplinas: [{ nome: "D. Constitucional", nota: 2.8, max: 3 }, { nome: "D. Civil", nota: 2.2, max: 3 }, { nome: "D. Penal", nota: 1.8, max: 2 }, { nome: "D. Administrativo", nota: 1.2, max: 2 }],
    competencias: [{ nome: "Interpretação Normativa", percentual: 82 }, { nome: "Análise Crítica", percentual: 78 }, { nome: "Argumentação", percentual: 80 }, { nome: "Interdisciplinaridade", percentual: 72 }],
  },
  {
    id: "av5", nome: "AV1 — D. Trabalhista", tipo: "AV1", data: "2026-02-20", nota: 7.9, notaMaxima: 10, acertos: 16, total: 20, tempo: 88,
    disciplinas: [{ nome: "D. Trabalhista", nota: 6.2, max: 7 }, { nome: "D. Constitucional", nota: 1.7, max: 3 }],
    competencias: [{ nome: "Aplicação Prática", percentual: 80 }, { nome: "Argumentação", percentual: 78 }, { nome: "Análise Crítica", percentual: 75 }],
  },
];

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

function getNotaColor(nota: number, max: number = 10) {
  const pct = (nota / max) * 100;
  if (pct >= 70) return "text-success";
  if (pct >= 55) return "text-warning";
  return "text-destructive";
}

function getBarFill(nota: number) {
  if (nota >= 7) return "hsl(var(--success))";
  if (nota >= 5.5) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

const TIPO_BADGE: Record<string, string> = {
  AV1: "bg-primary/10 text-primary border-primary/20",
  AV2: "bg-primary/10 text-primary border-primary/20",
  AV3: "bg-primary/10 text-primary border-primary/20",
  Simulado: "bg-info/10 text-info border-info/20",
  Quiz: "bg-accent/10 text-accent-foreground border-accent/20",
};

export default function AlunoEvolucao() {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [avalSelecionada, setAvalSelecionada] = useState<string | null>(null);

  const avaliacoesFiltradas = useMemo(() => {
    if (filtroTipo === "todos") return historicoAvaliacoes;
    return historicoAvaliacoes.filter((a) => a.tipo === filtroTipo);
  }, [filtroTipo]);

  // Linha temporal
  const lineData = avaliacoesFiltradas.map((a) => ({
    nome: a.nome.length > 18 ? a.nome.slice(0, 18) + "…" : a.nome,
    nota: a.nota,
    acerto: Math.round((a.acertos / a.total) * 100),
  }));

  // Média por tipo
  const mediasPorTipo = useMemo(() => {
    const map: Record<string, { soma: number; count: number }> = {};
    historicoAvaliacoes.forEach((a) => {
      if (!map[a.tipo]) map[a.tipo] = { soma: 0, count: 0 };
      map[a.tipo].soma += a.nota;
      map[a.tipo].count += 1;
    });
    return Object.entries(map).map(([tipo, v]) => ({
      tipo,
      media: +(v.soma / v.count).toFixed(1),
    }));
  }, []);

  // Evolução por competência (across simulados)
  const compEvolution = useMemo(() => {
    const simulados = historicoAvaliacoes.filter((a) => a.tipo === "Simulado");
    if (simulados.length < 2) return [];
    const allComps = [...new Set(simulados.flatMap((s) => s.competencias.map((c) => c.nome)))];
    return allComps.map((comp) => {
      const points: Record<string, number> = {};
      simulados.forEach((s) => {
        const c = s.competencias.find((x) => x.nome === comp);
        points[s.nome.length > 14 ? s.nome.slice(0, 14) + "…" : s.nome] = c?.percentual ?? 0;
      });
      return { competencia: comp, ...points };
    });
  }, []);

  // Radar — latest vs first
  const radarComparativo = useMemo(() => {
    const simulados = historicoAvaliacoes.filter((a) => a.tipo === "Simulado");
    if (simulados.length < 2) return [];
    const first = simulados[0];
    const last = simulados[simulados.length - 1];
    const allComps = [...new Set([...first.competencias, ...last.competencias].map((c) => c.nome))];
    return allComps.map((comp) => ({
      competencia: comp.length > 12 ? comp.slice(0, 12) + "…" : comp,
      primeiro: first.competencias.find((c) => c.nome === comp)?.percentual ?? 0,
      ultimo: last.competencias.find((c) => c.nome === comp)?.percentual ?? 0,
    }));
  }, []);

  // Stats
  const mediaGeral = +(historicoAvaliacoes.reduce((s, a) => s + a.nota, 0) / historicoAvaliacoes.length).toFixed(1);
  const melhorNota = Math.max(...historicoAvaliacoes.map((a) => a.nota));
  const taxaAcertoGeral = Math.round(
    (historicoAvaliacoes.reduce((s, a) => s + a.acertos, 0) / historicoAvaliacoes.reduce((s, a) => s + a.total, 0)) * 100
  );
  const ultimasNotas = historicoAvaliacoes.slice(-3);
  const tendencia = ultimasNotas.length >= 2
    ? ultimasNotas[ultimasNotas.length - 1].nota - ultimasNotas[0].nota
    : 0;

  const avalDetalhe = avalSelecionada ? historicoAvaliacoes.find((a) => a.id === avalSelecionada) : null;

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" />
            Evolução Acadêmica
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe seu progresso ao longo das avaliações e identifique tendências
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média Geral" value={String(mediaGeral)} icon={<Award className="h-5 w-5" />}
            trend={{ value: tendencia >= 0 ? `+${tendencia.toFixed(1)} tendência` : `${tendencia.toFixed(1)} tendência`, positive: tendencia >= 0 }}
          />
          <StatCard title="Melhor Nota" value={String(melhorNota)} icon={<Target className="h-5 w-5" />} />
          <StatCard title="Taxa de Acerto" value={`${taxaAcertoGeral}%`} icon={<Percent className="h-5 w-5" />} />
          <StatCard title="Avaliações" value={String(historicoAvaliacoes.length)} icon={<ClipboardList className="h-5 w-5" />}
            subtitle={`${mediasPorTipo.length} tipos diferentes`}
          />
        </div>

        {/* Linha temporal de notas */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" /> Progresso Temporal
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Nota e taxa de acerto por avaliação</p>
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="h-8 text-xs w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="AV1">AV1</SelectItem>
                <SelectItem value="AV2">AV2</SelectItem>
                <SelectItem value="AV3">AV3</SelectItem>
                <SelectItem value="Simulado">Simulado</SelectItem>
                <SelectItem value="Quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="gradNota" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="nome" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-20} textAnchor="end" height={50} />
              <YAxis yAxisId="left" domain={[0, 10]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <Tooltip contentStyle={CHART_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="nota" name="Nota" stroke="hsl(var(--accent))" fill="url(#gradNota)" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="acerto" name="Acerto %" stroke="hsl(var(--info))" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: "hsl(var(--info))", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Média por tipo */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-primary" /> Média por Tipo de Avaliação
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mediasPorTipo}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tipo" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="media" name="Média" radius={[4, 4, 0, 0]}>
                  {mediasPorTipo.map((d, i) => (
                    <Cell key={i} fill={getBarFill(d.media)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar comparativo */}
          {radarComparativo.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-accent" /> Comparação de Competências
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Primeiro simulado vs último simulado</p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarComparativo}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Primeiro" dataKey="primeiro" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
                  <Radar name="Último" dataKey="ultimo" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Histórico detalhado */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-primary" /> Histórico de Avaliações
          </h3>
          <div className="space-y-2">
            {historicoAvaliacoes.slice().reverse().map((a) => (
              <div key={a.id}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-md border transition-colors cursor-pointer ${
                    avalSelecionada === a.id ? "bg-primary/5 border-primary/20" : "bg-background border-border hover:bg-muted/30"
                  }`}
                  onClick={() => setAvalSelecionada(avalSelecionada === a.id ? null : a.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{a.nome}</span>
                      <Badge className={`text-[9px] ${TIPO_BADGE[a.tipo] || ""}`}>{a.tipo}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.data).toLocaleDateString("pt-BR")} • {a.acertos}/{a.total} acertos • {a.tempo} min
                    </p>
                  </div>
                  <span className={`text-lg font-bold shrink-0 ${getNotaColor(a.nota)}`}>{a.nota.toFixed(1)}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${avalSelecionada === a.id ? "rotate-180" : ""}`} />
                </div>

                {avalSelecionada === a.id && avalDetalhe && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border border-t-0 border-border rounded-b-md bg-muted/10 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Disciplinas */}
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Desempenho por Disciplina</p>
                          <div className="space-y-2">
                            {avalDetalhe.disciplinas.map((d, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-foreground">{d.nome}</span>
                                  <span className={`font-semibold ${getNotaColor(d.nota, d.max)}`}>{d.nota}/{d.max}</span>
                                </div>
                                <Progress value={(d.nota / d.max) * 100} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Competências */}
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Competências</p>
                          <div className="space-y-2">
                            {avalDetalhe.competencias.map((c, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-foreground">{c.nome}</span>
                                  <span className={`font-semibold ${c.percentual >= 75 ? "text-success" : c.percentual >= 55 ? "text-warning" : "text-destructive"}`}>
                                    {c.percentual}%
                                  </span>
                                </div>
                                <Progress value={c.percentual} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
