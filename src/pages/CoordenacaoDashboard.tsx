import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, BarChart3, TrendingUp, TrendingDown,
  AlertTriangle, Target, Award, BookOpen, ShieldAlert, ArrowUpRight,
  ArrowDownRight, Minus, Eye, ChevronDown, ChevronUp, Percent,
  Activity, UserX, FileText, Scale,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
  AreaChart, Area, Legend, ComposedChart,
} from "recharts";
import {
  turmasDesempenho, alunosEmRisco, docentesIndicadores, enadeEixos,
  historicoInstitucional, disciplinasConsolidadas, AlunoRisco,
} from "@/data/mockCoordenacao";

const CHART_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

const TURMA_COLORS = [
  "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--primary))",
  "hsl(var(--destructive))", "hsl(var(--accent))", "hsl(var(--info))",
  "hsl(210 60% 50%)", "hsl(280 60% 50%)",
];

function getMediaColor(media: number) {
  if (media >= 7) return "text-success";
  if (media >= 5.5) return "text-warning";
  return "text-destructive";
}

function TendenciaIcon({ tendencia }: { tendencia: AlunoRisco["tendencia"] }) {
  if (tendencia === "caindo") return <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />;
  if (tendencia === "subindo") return <ArrowUpRight className="h-3.5 w-3.5 text-success" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

// ===== Seção: Indicadores Institucionais Históricos =====
function SecaoHistorico() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
        <Activity className="h-4 w-4 text-accent" />
        Evolução Institucional
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Indicadores-chave ao longo dos semestres</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={historicoInstitucional}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis yAxisId="right" orientation="right" domain={[4, 8]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={CHART_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area yAxisId="left" type="monotone" dataKey="taxaAprovacao" name="Aprovação %" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.1} strokeWidth={2} />
          <Area yAxisId="left" type="monotone" dataKey="aderenciaEnade" name="Aderência ENADE %" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.1} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="mediaGeral" name="Média Geral" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
          <Line yAxisId="left" type="monotone" dataKey="taxaEvasao" name="Evasão %" stroke="hsl(var(--destructive))" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: "hsl(var(--destructive))", r: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ===== Seção: Aderência ENADE Detalhada =====
function SecaoEnade() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
          <Target className="h-4 w-4 text-accent" />
          Mapa de Aderência ENADE
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Curso vs Meta vs Média Nacional</p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={enadeEixos}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <Radar name="Curso" dataKey="curso" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Meta" dataKey="meta" stroke="hsl(var(--primary))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            <Radar name="Nacional" dataKey="nacional" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.05} strokeWidth={1} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Gap analysis */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
          <BarChart3 className="h-4 w-4 text-primary" />
          Análise de Gap — Eixos ENADE
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Distância entre desempenho atual e meta institucional</p>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {enadeEixos
            .sort((a, b) => a.gap - b.gap)
            .map((e, i) => {
              const severity = Math.abs(e.gap) >= 10 ? "destructive" : Math.abs(e.gap) >= 7 ? "warning" : "info";
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{e.eixo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{e.curso}% / {e.meta}%</span>
                      <Badge className={`text-[10px] bg-${severity}/10 text-${severity} border-${severity}/20`}>
                        {e.gap}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={e.curso} className="h-2" />
                    <div
                      className="absolute top-0 h-2 w-0.5 bg-primary"
                      style={{ left: `${e.meta}%` }}
                      title={`Meta: ${e.meta}%`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Média nacional: {e.nacional}% • Acima da média em {e.curso - e.nacional} pontos
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ===== Seção: Comparação entre Turmas =====
function SecaoTurmas() {
  const [turmaExpandida, setTurmaExpandida] = useState<string | null>(null);

  const barData = turmasDesempenho.map((t) => ({
    turma: t.turma,
    media: t.media,
    aprovacao: t.aprovacao,
    enade: t.enade,
  }));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-accent" />
          Comparação entre Turmas
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Média, taxa de aprovação e aderência ENADE por turma</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="turma" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CHART_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="aprovacao" name="Aprovação %" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} barSize={16} />
            <Bar dataKey="enade" name="ENADE %" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards por turma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {turmasDesempenho.map((t) => (
          <div
            key={t.turma}
            className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={() => setTurmaExpandida(turmaExpandida === t.turma ? null : t.turma)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">{t.turma}</h4>
              <Badge variant="outline" className="text-[10px]">{t.alunos} alunos</Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Média</span>
                <span className={`font-semibold ${getMediaColor(t.media)}`}>{t.media.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Aprovação</span>
                <span className="font-medium text-foreground">{t.aprovacao}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ENADE</span>
                <span className="font-medium text-foreground">{t.enade}%</span>
              </div>
            </div>
            {turmaExpandida === t.turma && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-3 pt-3 border-t border-border space-y-2"
              >
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Disciplinas</p>
                {t.disciplinas.map((d, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-foreground">{d.nome}</span>
                    <span className={`text-xs font-semibold ${getMediaColor(d.media)}`}>{d.media.toFixed(1)}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Seção: Alunos em Risco =====
function SecaoAlunosRisco() {
  const [filtroTurma, setFiltroTurma] = useState<string>("todas");
  const [filtroTendencia, setFiltroTendencia] = useState<string>("todas");

  const turmasUnicas = [...new Set(alunosEmRisco.map((a) => a.turma))].sort();

  const filtrados = useMemo(() => {
    return alunosEmRisco.filter((a) => {
      if (filtroTurma !== "todas" && a.turma !== filtroTurma) return false;
      if (filtroTendencia !== "todas" && a.tendencia !== filtroTendencia) return false;
      return true;
    }).sort((a, b) => a.media - b.media);
  }, [filtroTurma, filtroTendencia]);

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium text-foreground">Monitoramento de Alunos em Risco</h3>
          <Badge variant="destructive" className="text-[10px]">{filtrados.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Select value={filtroTurma} onValueChange={setFiltroTurma}>
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="Turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {turmasUnicas.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroTendencia} onValueChange={setFiltroTendencia}>
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Tendência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="caindo">Caindo</SelectItem>
              <SelectItem value="estavel">Estável</SelectItem>
              <SelectItem value="subindo">Subindo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 text-xs text-muted-foreground font-medium">Aluno</th>
              <th className="text-left py-2.5 text-xs text-muted-foreground font-medium">Turma</th>
              <th className="text-left py-2.5 text-xs text-muted-foreground font-medium hidden sm:table-cell">Áreas Críticas</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium">Freq.</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium">Tend.</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium hidden md:table-cell">Aval.</th>
              <th className="text-right py-2.5 text-xs text-muted-foreground font-medium">Média</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 font-medium text-foreground text-xs">{a.nome}</td>
                <td className="py-3 text-xs">
                  <Badge variant="outline" className="text-[10px]">{a.turma}</Badge>
                </td>
                <td className="py-3 text-xs text-muted-foreground hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {a.areasCriticas.map((ac, i) => (
                      <Badge key={i} className="text-[9px] bg-destructive/10 text-destructive border-destructive/20">{ac}</Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className={`text-xs font-medium ${a.frequencia < 75 ? "text-destructive" : "text-foreground"}`}>
                    {a.frequencia}%
                  </span>
                </td>
                <td className="py-3 text-center"><TendenciaIcon tendencia={a.tendencia} /></td>
                <td className="py-3 text-center text-xs text-muted-foreground hidden md:table-cell">
                  {a.avaliacoesRealizadas}/{a.avaliacoesRealizadas + a.avaliacoesPendentes}
                </td>
                <td className="py-3 text-right">
                  <span className={`text-sm font-bold ${getMediaColor(a.media)}`}>{a.media.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Seção: Desempenho Docente =====
function SecaoDocentes() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Indicadores Docentes</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docentesIndicadores.map((doc, i) => (
          <div key={i} className="p-4 rounded-md border border-border bg-background hover:bg-muted/20 transition-colors">
            <h4 className="text-sm font-semibold text-foreground">{doc.nome}</h4>
            <p className="text-xs text-muted-foreground mb-3">{doc.disciplina} • {doc.turmas.join(", ")}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Questões criadas</span>
                <span className="font-medium text-foreground">{doc.questoesCriadas}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Taxa de aprovação</span>
                <span className={`font-medium ${doc.taxaAprovacao >= 85 ? "text-success" : doc.taxaAprovacao >= 75 ? "text-warning" : "text-destructive"}`}>
                  {doc.taxaAprovacao}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Aderência ENADE</span>
                <span className="font-medium text-foreground">{doc.aderenciaEnade}%</span>
              </div>
              <Progress value={doc.aderenciaEnade} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Seção: Disciplinas Consolidadas =====
function SecaoDisciplinas() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-medium text-foreground">Panorama por Disciplina</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 text-xs text-muted-foreground font-medium">Disciplina</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium">Média</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium hidden sm:table-cell">Questões</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium">ENADE</th>
              <th className="text-center py-2.5 text-xs text-muted-foreground font-medium">Tendência</th>
            </tr>
          </thead>
          <tbody>
            {disciplinasConsolidadas.sort((a, b) => b.media - a.media).map((d, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 text-xs font-medium text-foreground">{d.disciplina}</td>
                <td className="py-3 text-center">
                  <span className={`text-sm font-bold ${getMediaColor(d.media)}`}>{d.media.toFixed(1)}</span>
                </td>
                <td className="py-3 text-center text-xs text-muted-foreground hidden sm:table-cell">{d.questoes}</td>
                <td className="py-3 text-center">
                  <Badge variant="outline" className="text-[10px]">{d.aderencia}%</Badge>
                </td>
                <td className="py-3 text-center">
                  <span className={`text-xs font-medium flex items-center justify-center gap-1 ${d.tendencia > 0 ? "text-success" : d.tendencia < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {d.tendencia > 0 ? <ArrowUpRight className="h-3 w-3" /> : d.tendencia < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {d.tendencia > 0 ? "+" : ""}{d.tendencia.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Main Dashboard =====
export default function CoordenacaoDashboard() {
  const totalAlunos = turmasDesempenho.reduce((s, t) => s + t.alunos, 0);
  const mediaGeral = (turmasDesempenho.reduce((s, t) => s + t.media * t.alunos, 0) / totalAlunos).toFixed(1);
  const taxaAprovMedia = Math.round(turmasDesempenho.reduce((s, t) => s + t.aprovacao, 0) / turmasDesempenho.length);
  const aderenciaMedia = Math.round(turmasDesempenho.reduce((s, t) => s + t.enade, 0) / turmasDesempenho.length);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-accent" />
            Painel da Coordenação
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão institucional completa do curso de Direito — {turmasDesempenho.length} turmas, {totalAlunos} alunos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média Geral" value={mediaGeral} icon={<Award className="h-5 w-5" />} trend={{ value: "+0.2 vs semestre anterior", positive: true }} />
          <StatCard title="Alunos Matriculados" value={String(totalAlunos)} icon={<Users className="h-5 w-5" />} subtitle={`${turmasDesempenho.length} turmas ativas`} />
          <StatCard title="Taxa de Aprovação" value={`${taxaAprovMedia}%`} icon={<Percent className="h-5 w-5" />} trend={{ value: "+2%", positive: true }} />
          <StatCard title="Aderência ENADE" value={`${aderenciaMedia}%`} icon={<Target className="h-5 w-5" />} trend={{ value: "+4%", positive: true }} />
        </div>

        {/* Alert strip */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {alunosEmRisco.filter((a) => a.tendencia === "caindo").length} alunos com tendência de queda identificados
            </p>
            <p className="text-xs text-muted-foreground">
              Turma DIR-3B concentra {alunosEmRisco.filter((a) => a.turma === "DIR-3B").length} alunos em risco — requer atenção imediata
            </p>
          </div>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 shrink-0">
            {alunosEmRisco.length} em risco
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="visao-geral" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 max-w-3xl">
            <TabsTrigger value="visao-geral" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" />Visão Geral</TabsTrigger>
            <TabsTrigger value="enade" className="text-xs gap-1.5"><Target className="h-3.5 w-3.5" />ENADE</TabsTrigger>
            <TabsTrigger value="turmas" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" />Turmas</TabsTrigger>
            <TabsTrigger value="alunos" className="text-xs gap-1.5"><UserX className="h-3.5 w-3.5" />Em Risco</TabsTrigger>
            <TabsTrigger value="docentes" className="text-xs gap-1.5"><GraduationCap className="h-3.5 w-3.5" />Docentes</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <SecaoHistorico />
            <SecaoDisciplinas />
          </TabsContent>

          <TabsContent value="enade" className="space-y-6">
            <SecaoEnade />
          </TabsContent>

          <TabsContent value="turmas" className="space-y-6">
            <SecaoTurmas />
          </TabsContent>

          <TabsContent value="alunos" className="space-y-6">
            <SecaoAlunosRisco />
          </TabsContent>

          <TabsContent value="docentes" className="space-y-6">
            <SecaoDocentes />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
