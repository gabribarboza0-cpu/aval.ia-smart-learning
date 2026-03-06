import { motion } from "framer-motion";
import {
  BarChart3, Target, TrendingUp, TrendingDown, Award, Users,
  AlertTriangle, Percent, Activity, ArrowUpRight, ArrowDownRight,
  Minus, BookOpen, ShieldAlert, UserX, GraduationCap,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, AreaChart, Area, ComposedChart,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import {
  turmasDesempenho, enadeEixos, historicoInstitucional, disciplinasConsolidadas,
  alunosEmRisco, docentesIndicadores,
} from "@/data/mockCoordenacao";

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

const ultimoPeriodo = historicoInstitucional[historicoInstitucional.length - 1];
const penultimoPeriodo = historicoInstitucional[historicoInstitucional.length - 2];

export default function CoordenacaoIndicadores() {
  const totalAlunos = turmasDesempenho.reduce((s, t) => s + t.alunos, 0);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            Indicadores Institucionais
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas estratégicas consolidadas — período {ultimoPeriodo.periodo}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Média Geral" value={String(ultimoPeriodo.mediaGeral)} icon={<Award className="h-5 w-5" />}
            trend={{ value: `${(ultimoPeriodo.mediaGeral - penultimoPeriodo.mediaGeral) > 0 ? "+" : ""}${(ultimoPeriodo.mediaGeral - penultimoPeriodo.mediaGeral).toFixed(1)}`, positive: ultimoPeriodo.mediaGeral >= penultimoPeriodo.mediaGeral }}
          />
          <StatCard title="Aprovação" value={`${ultimoPeriodo.taxaAprovacao}%`} icon={<Percent className="h-5 w-5" />}
            trend={{ value: `${ultimoPeriodo.taxaAprovacao - penultimoPeriodo.taxaAprovacao > 0 ? "+" : ""}${ultimoPeriodo.taxaAprovacao - penultimoPeriodo.taxaAprovacao}%`, positive: ultimoPeriodo.taxaAprovacao >= penultimoPeriodo.taxaAprovacao }}
          />
          <StatCard title="Evasão" value={`${ultimoPeriodo.taxaEvasao}%`} icon={<UserX className="h-5 w-5" />}
            trend={{ value: `${(ultimoPeriodo.taxaEvasao - penultimoPeriodo.taxaEvasao).toFixed(1)}%`, positive: ultimoPeriodo.taxaEvasao <= penultimoPeriodo.taxaEvasao }}
          />
          <StatCard title="ENADE" value={`${ultimoPeriodo.aderenciaEnade}%`} icon={<Target className="h-5 w-5" />}
            trend={{ value: `+${ultimoPeriodo.aderenciaEnade - penultimoPeriodo.aderenciaEnade}%`, positive: true }}
          />
          <StatCard title="Em Risco" value={String(ultimoPeriodo.alunosRisco)} icon={<AlertTriangle className="h-5 w-5" />}
            trend={{ value: `${ultimoPeriodo.alunosRisco - penultimoPeriodo.alunosRisco}`, positive: ultimoPeriodo.alunosRisco <= penultimoPeriodo.alunosRisco }}
          />
        </div>

        {/* Evolução histórica */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-accent" />
            Evolução Histórica dos Indicadores
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Tendências semestrais desde 2023.1</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={historicoInstitucional}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="periodo" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="right" orientation="right" domain={[4, 8]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={CHART_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="taxaAprovacao" name="Aprovação %" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.1} strokeWidth={2} />
              <Area yAxisId="left" type="monotone" dataKey="aderenciaEnade" name="ENADE %" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.1} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="mediaGeral" name="Média" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="taxaEvasao" name="Evasão %" stroke="hsl(var(--destructive))" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: "hsl(var(--destructive))", r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ENADE Radar */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-accent" />
              Aderência ENADE por Eixo
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Curso vs Meta vs Nacional</p>
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
              <ShieldAlert className="h-4 w-4 text-destructive" />
              Gap para Meta — Eixos ENADE
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Ordenado por urgência</p>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {enadeEixos.sort((a, b) => a.gap - b.gap).map((e, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{e.eixo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{e.curso}% / {e.meta}%</span>
                      <Badge className={`text-[10px] ${Math.abs(e.gap) >= 10 ? "bg-destructive/10 text-destructive border-destructive/20" : Math.abs(e.gap) >= 7 ? "bg-warning/10 text-warning border-warning/20" : "bg-info/10 text-info border-info/20"}`}>
                        {e.gap}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={e.curso} className="h-2" />
                    <div className="absolute top-0 h-2 w-0.5 bg-primary" style={{ left: `${e.meta}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Acima da média nacional em +{e.curso - e.nacional} pontos</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alunos em risco por turma */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Distribuição de Alunos em Risco por Turma
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={turmasDesempenho.map((t) => ({
              turma: t.turma,
              risco: alunosEmRisco.filter((a) => a.turma === t.turma).length,
              total: t.alunos,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="turma" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={CHART_STYLE} />
              <Bar dataKey="risco" name="Em Risco" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Panorama disciplinas */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-accent" />
            Panorama por Disciplina
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Disciplina</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium">Média</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium hidden sm:table-cell">Questões</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium">ENADE</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {disciplinasConsolidadas.sort((a, b) => b.media - a.media).map((d, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 text-xs font-medium text-foreground">{d.disciplina}</td>
                    <td className="py-2.5 text-center">
                      <span className={`text-sm font-bold ${d.media >= 7 ? "text-success" : d.media >= 5.5 ? "text-warning" : "text-destructive"}`}>{d.media.toFixed(1)}</span>
                    </td>
                    <td className="py-2.5 text-center text-xs text-muted-foreground hidden sm:table-cell">{d.questoes}</td>
                    <td className="py-2.5 text-center"><Badge variant="outline" className="text-[10px]">{d.aderencia}%</Badge></td>
                    <td className="py-2.5 text-center">
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

        {/* Resumo docente */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-primary" />
            Resumo Docente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {docentesIndicadores.map((doc, i) => (
              <div key={i} className="p-3 rounded-md border border-border bg-background">
                <p className="text-sm font-medium text-foreground">{doc.nome}</p>
                <p className="text-xs text-muted-foreground mb-2">{doc.disciplina}</p>
                <div className="flex gap-3 text-xs">
                  <span className="text-muted-foreground">Aprov: <span className={`font-semibold ${doc.taxaAprovacao >= 85 ? "text-success" : "text-warning"}`}>{doc.taxaAprovacao}%</span></span>
                  <span className="text-muted-foreground">ENADE: <span className="font-semibold text-foreground">{doc.aderenciaEnade}%</span></span>
                  <span className="text-muted-foreground">Quest: <span className="font-semibold text-foreground">{doc.questoesCriadas}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
