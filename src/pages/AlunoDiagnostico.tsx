import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain, Target, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, BookOpen,
  BarChart3, Zap, ArrowRight, ShieldAlert, Award,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie,
} from "recharts";
import { mockQuestoes } from "@/data/mockQuestoes";
import { gerarDiagnosticoMock, DiagnosticoCompleto } from "@/lib/diagnosticoEngine";

const COLORS_DISC = [
  "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))",
  "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--destructive))",
  "hsl(210 60% 50%)", "hsl(280 60% 50%)",
];

function getBarColor(pct: number) {
  if (pct >= 75) return "hsl(var(--success))";
  if (pct >= 50) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export default function AlunoDiagnostico() {
  const diagnostico: DiagnosticoCompleto = useMemo(() => gerarDiagnosticoMock(mockQuestoes), []);

  const radarData = diagnostico.desempenhoPorCompetencia.map((c) => ({
    subject: c.competencia.length > 14 ? c.competencia.slice(0, 14) + "…" : c.competencia,
    full: c.competencia,
    score: c.percentual,
    fullMark: 100,
  }));

  const disciplinaBarData = diagnostico.desempenhoPorDisciplina.map((d) => ({
    name: d.disciplina.replace("Direito ", "D. ").replace("Direitos ", "D. "),
    percentual: d.percentual,
    peso: +(d.pesoTotal).toFixed(2),
  }));

  const dificuldadeData = diagnostico.desempenhoPorDificuldade.map((d) => ({
    name: d.nivel,
    percentual: d.percentual,
    acertos: d.acertos,
    total: d.total,
  }));

  const pieData = [
    { name: "Acertos", value: diagnostico.acertos },
    { name: "Erros", value: diagnostico.erros },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-accent" />
            Diagnóstico Acadêmico
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análise multidimensional do seu desempenho com redistribuição proporcional de erros
          </p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Nota Bruta" value={diagnostico.notaBruta.toFixed(1)} icon={<Award className="h-5 w-5" />} />
          <StatCard title="Taxa de Acerto" value={`${diagnostico.taxaAcerto}%`} icon={<Target className="h-5 w-5" />} />
          <StatCard title="Pontos Fortes" value={String(diagnostico.pontosFortes.length)} icon={<CheckCircle className="h-5 w-5" />} subtitle="disciplinas ≥70%" />
          <StatCard title="Áreas Críticas" value={String(diagnostico.areasDeficitarias.length)} icon={<AlertTriangle className="h-5 w-5" />} subtitle="disciplinas <60%" />
        </div>

        {/* Acerto/Erro pie + Radar competências */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-1">Resumo Geral</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {diagnostico.acertos} acertos e {diagnostico.erros} erros em {diagnostico.totalQuestoes} questões
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                  <Cell fill="hsl(var(--success))" />
                  <Cell fill="hsl(var(--destructive))" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Radar — competências */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-1">Mapa de Competências</h3>
            <p className="text-xs text-muted-foreground mb-4">Desempenho por competência avaliada</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Desempenho" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desempenho por disciplina — com redistribuição */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-medium text-foreground">Desempenho por Disciplina</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Erros redistribuídos proporcionalmente conforme o peso de cada disciplina na questão
          </p>
          <ResponsiveContainer width="100%" height={Math.max(200, disciplinaBarData.length * 40)}>
            <BarChart data={disciplinaBarData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={130} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                formatter={(value: number, name: string) => [`${value}%`, "Aproveitamento"]}
              />
              <Bar dataKey="percentual" radius={[0, 4, 4, 0]}>
                {disciplinaBarData.map((d, i) => (
                  <Cell key={i} fill={getBarColor(d.percentual)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Desempenho por dificuldade + por tema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dificuldade */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Desempenho por Dificuldade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dificuldadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="percentual" radius={[4, 4, 0, 0]}>
                  {dificuldadeData.map((d, i) => (
                    <Cell key={i} fill={getBarColor(d.percentual)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Temas */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Desempenho por Tema</h3>
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {diagnostico.desempenhoPorTema.map((t, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-medium truncate max-w-[60%]">{t.tema}</span>
                    <span className={`text-xs font-semibold ${
                      t.percentual >= 75 ? "text-success" : t.percentual >= 50 ? "text-warning" : "text-destructive"
                    }`}>{t.percentual}%</span>
                  </div>
                  <Progress value={t.percentual} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.disciplina} • {t.acertos}/{t.total} acertos</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pontos fortes e fracos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pontos fortes */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="text-sm font-medium text-foreground">Pontos Fortes</h3>
            </div>
            {diagnostico.pontosFortes.length > 0 ? (
              <div className="space-y-2">
                {diagnostico.pontosFortes.map((pf, i) => {
                  const disc = diagnostico.desempenhoPorDisciplina.find((d) => d.disciplina === pf);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-success/5 border border-success/20">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{pf}</p>
                        <p className="text-xs text-muted-foreground">Aproveitamento: {disc?.percentual}%</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20 text-xs shrink-0">{disc?.percentual}%</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum ponto forte identificado ainda.</p>
            )}
          </div>

          {/* Áreas deficitárias */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <h3 className="text-sm font-medium text-foreground">Áreas Deficitárias</h3>
            </div>
            {diagnostico.areasDeficitarias.length > 0 ? (
              <div className="space-y-2">
                {diagnostico.areasDeficitarias.map((ad, i) => {
                  const disc = diagnostico.desempenhoPorDisciplina.find((d) => d.disciplina === ad);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-destructive/5 border border-destructive/20">
                      <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{ad}</p>
                        <p className="text-xs text-muted-foreground">Aproveitamento: {disc?.percentual}%</p>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs shrink-0">{disc?.percentual}%</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma área crítica detectada. Parabéns!</p>
            )}
          </div>
        </div>

        {/* Padrões de erro recorrente */}
        {diagnostico.padroesErro.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-medium text-foreground">Padrões de Erro Recorrente</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {diagnostico.padroesErro.slice(0, 6).map((pe, i) => (
                <div key={i} className="p-3 rounded-md bg-warning/5 border border-warning/20">
                  <p className="text-sm font-medium text-foreground">{pe.tema}</p>
                  <p className="text-xs text-muted-foreground">{pe.disciplina}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Zap className="h-3 w-3 text-warning" />
                    <span className="text-xs text-warning font-medium">{pe.frequencia} erro{pe.frequencia > 1 ? "s" : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prioridade de estudo */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Prioridade de Estudo</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Tópicos ordenados por urgência de reforço</p>
          <div className="space-y-2">
            {diagnostico.prioridadeEstudo.length > 0 ? (
              diagnostico.prioridadeEstudo.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-primary bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground flex-1">{p}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Sem prioridades de reforço — excelente desempenho!</p>
            )}
          </div>
        </div>

        {/* Competências detalhadas */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Detalhamento por Competência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnostico.desempenhoPorCompetencia.map((c, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{c.competencia}</span>
                  <span className={`text-xs font-bold ${
                    c.percentual >= 75 ? "text-success" : c.percentual >= 50 ? "text-warning" : "text-destructive"
                  }`}>{c.percentual}%</span>
                </div>
                <Progress value={c.percentual} className="h-2" />
                <p className="text-[10px] text-muted-foreground">{c.acertos}/{c.total} acertos</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
