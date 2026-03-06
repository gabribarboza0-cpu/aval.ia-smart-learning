import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, FileText, Download, Calendar, Filter,
  Users, Target, Award, TrendingUp, Activity, Percent,
  BookOpen, GraduationCap, AlertTriangle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, AreaChart, Area, ComposedChart, PieChart, Pie,
} from "recharts";
import { toast } from "@/hooks/use-toast";

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

// ===== Data =====
const desempenhoSemestral = [
  { semestre: "2024.1", mediaGeral: 6.5, aprovacao: 82, enade: 65, evasao: 6.8 },
  { semestre: "2024.2", mediaGeral: 6.8, aprovacao: 84, enade: 68, evasao: 6.2 },
  { semestre: "2025.1", mediaGeral: 7.0, aprovacao: 86, enade: 70, evasao: 5.5 },
  { semestre: "2025.2", mediaGeral: 7.1, aprovacao: 87, enade: 72, evasao: 5.1 },
  { semestre: "2026.1", mediaGeral: 7.3, aprovacao: 88, enade: 74, evasao: 4.8 },
];

const questoesPorMes = [
  { mes: "Out", criadas: 32, validadas: 28 },
  { mes: "Nov", criadas: 45, validadas: 38 },
  { mes: "Dez", criadas: 28, validadas: 25 },
  { mes: "Jan", criadas: 52, validadas: 44 },
  { mes: "Fev", criadas: 41, validadas: 35 },
  { mes: "Mar", criadas: 38, validadas: 30 },
];

const provasPorTipo = [
  { name: "AV1", value: 24 },
  { name: "AV2", value: 22 },
  { name: "AV3", value: 18 },
  { name: "Simulado", value: 12 },
  { name: "Quiz", value: 45 },
];

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--info))", "hsl(var(--warning))"];

const turmasRanking = [
  { turma: "DIR-9A", media: 8.1, aprovacao: 96 },
  { turma: "DIR-5A", media: 7.8, aprovacao: 94 },
  { turma: "DIR-7A", media: 7.6, aprovacao: 93 },
  { turma: "DIR-1A", media: 7.5, aprovacao: 91 },
  { turma: "DIR-3A", media: 7.2, aprovacao: 88 },
  { turma: "DIR-5B", media: 7.0, aprovacao: 87 },
  { turma: "DIR-1B", media: 6.8, aprovacao: 84 },
  { turma: "DIR-3B", media: 6.1, aprovacao: 75 },
];

const docentesRanking = [
  { nome: "Prof. Beatriz Nunes", disciplina: "D. Trabalhista", aprovacao: 90, questoes: 41 },
  { nome: "Prof. Maria Silva", disciplina: "D. Constitucional", aprovacao: 88, questoes: 45 },
  { nome: "Prof. Roberto Mendes", disciplina: "D. Tributário", aprovacao: 85, questoes: 35 },
  { nome: "Prof. João Santos", disciplina: "D. Civil", aprovacao: 82, questoes: 38 },
  { nome: "Prof. Ana Costa", disciplina: "D. Administrativo", aprovacao: 80, questoes: 52 },
  { nome: "Prof. Carlos Lima", disciplina: "D. Penal", aprovacao: 78, questoes: 30 },
];

const relatoriosGerados = [
  { id: "r1", titulo: "Relatório Semestral 2026.1", tipo: "Institucional", data: "2026-03-01", status: "Gerado" },
  { id: "r2", titulo: "Aderência ENADE — Março 2026", tipo: "ENADE", data: "2026-03-05", status: "Gerado" },
  { id: "r3", titulo: "Alunos em Risco — DIR-3B", tipo: "Acadêmico", data: "2026-02-28", status: "Gerado" },
  { id: "r4", titulo: "Produtividade Docente — 2025.2", tipo: "Docente", data: "2026-01-15", status: "Arquivado" },
  { id: "r5", titulo: "Desempenho por Disciplina", tipo: "Acadêmico", data: "2026-02-20", status: "Gerado" },
];

export default function AdminRelatorios() {
  const [periodo, setPeriodo] = useState("2026.1");

  const gerarRelatorio = () => toast({ title: "Relatório gerado com sucesso!", description: "O PDF está disponível para download." });

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-accent" />
              Relatórios
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Análises consolidadas e exportação de dados</p>
          </div>
          <div className="flex gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025.2">2025.2</SelectItem>
                <SelectItem value="2026.1">2026.1</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={gerarRelatorio} className="gap-2">
              <Download className="h-4 w-4" /> Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média Geral" value="7.3" icon={<Award className="h-5 w-5" />} trend={{ value: "+0.2", positive: true }} />
          <StatCard title="Taxa de Aprovação" value="88%" icon={<Percent className="h-5 w-5" />} trend={{ value: "+1%", positive: true }} />
          <StatCard title="Aderência ENADE" value="74%" icon={<Target className="h-5 w-5" />} trend={{ value: "+2%", positive: true }} />
          <StatCard title="Taxa de Evasão" value="4.8%" icon={<AlertTriangle className="h-5 w-5" />} trend={{ value: "-0.3%", positive: true }} />
        </div>

        <Tabs defaultValue="desempenho" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl">
            <TabsTrigger value="desempenho" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" />Desempenho</TabsTrigger>
            <TabsTrigger value="producao" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" />Produção</TabsTrigger>
            <TabsTrigger value="rankings" className="text-xs gap-1.5"><Award className="h-3.5 w-3.5" />Rankings</TabsTrigger>
            <TabsTrigger value="exportar" className="text-xs gap-1.5"><Download className="h-3.5 w-3.5" />Exportar</TabsTrigger>
          </TabsList>

          {/* Desempenho */}
          <TabsContent value="desempenho" className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground mb-4">Evolução Semestral</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={desempenhoSemestral}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="semestre" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="right" orientation="right" domain={[5, 8]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={CHART_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area yAxisId="left" type="monotone" dataKey="aprovacao" name="Aprovação %" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.1} strokeWidth={2} />
                  <Area yAxisId="left" type="monotone" dataKey="enade" name="ENADE %" stroke="hsl(var(--info))" fill="hsl(var(--info))" fillOpacity={0.1} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="mediaGeral" name="Média" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
                  <Line yAxisId="left" type="monotone" dataKey="evasao" name="Evasão %" stroke="hsl(var(--destructive))" strokeWidth={1.5} strokeDasharray="4 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Produção */}
          <TabsContent value="producao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-border p-5 shadow-card">
                <h3 className="text-sm font-medium text-foreground mb-4">Questões por Mês</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={questoesPorMes} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="criadas" name="Criadas" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} barSize={16} />
                    <Bar dataKey="validadas" name="Validadas" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-lg border border-border p-5 shadow-card">
                <h3 className="text-sm font-medium text-foreground mb-4">Provas por Tipo</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={provasPorTipo} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}
                      label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                      {provasPorTipo.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Rankings */}
          <TabsContent value="rankings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Turmas */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-card">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-accent" /> Ranking de Turmas
                </h3>
                <div className="space-y-2">
                  {turmasRanking.map((t, i) => (
                    <div key={t.turma} className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-background">
                      <span className={`text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                        i < 3 ? "bg-accent/10 text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</span>
                      <span className="text-sm font-medium text-foreground flex-1">{t.turma}</span>
                      <span className={`text-sm font-bold ${t.media >= 7 ? "text-success" : t.media >= 5.5 ? "text-warning" : "text-destructive"}`}>{t.media.toFixed(1)}</span>
                      <Badge variant="outline" className="text-[10px]">{t.aprovacao}%</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Docentes */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-card">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4 text-primary" /> Ranking Docente
                </h3>
                <div className="space-y-2">
                  {docentesRanking.map((d, i) => (
                    <div key={d.nome} className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-background">
                      <span className={`text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                        i < 3 ? "bg-accent/10 text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{d.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{d.disciplina} • {d.questoes} questões</p>
                      </div>
                      <Badge className={`text-[10px] ${d.aprovacao >= 85 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                        {d.aprovacao}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Exportar */}
          <TabsContent value="exportar" className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" /> Relatórios Disponíveis
              </h3>
              <div className="space-y-2">
                {relatoriosGerados.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-md border border-border bg-background hover:bg-muted/20 transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.tipo} • {new Date(r.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${r.status === "Gerado" ? "text-success border-success/20" : "text-muted-foreground"}`}>
                      {r.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={gerarRelatorio}>
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick generate */}
            <div className="bg-card rounded-lg border border-border p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground mb-4">Gerar Novo Relatório</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { titulo: "Relatório Institucional", desc: "Visão consolidada do semestre", icon: Activity },
                  { titulo: "Aderência ENADE", desc: "Análise por eixo e competência", icon: Target },
                  { titulo: "Desempenho por Turma", desc: "Comparativo detalhado", icon: Users },
                  { titulo: "Produtividade Docente", desc: "Questões, aprovação e ENADE", icon: GraduationCap },
                  { titulo: "Alunos em Risco", desc: "Monitoramento e alertas", icon: AlertTriangle },
                  { titulo: "Banco de Questões", desc: "Estatísticas de uso e qualidade", icon: BookOpen },
                ].map((r, i) => (
                  <button
                    key={i}
                    onClick={gerarRelatorio}
                    className="p-4 rounded-md border border-border bg-background hover:bg-primary/5 hover:border-primary/20 transition-colors text-left"
                  >
                    <r.icon className="h-5 w-5 text-accent mb-2" />
                    <p className="text-sm font-medium text-foreground">{r.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
