import { motion } from "framer-motion";
import { Users, GraduationCap, BarChart3, TrendingUp, AlertTriangle, BookOpen, Target, Award } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from "recharts";

const tendenciaData = [
  { semestre: "2024.1", media: 6.2 },
  { semestre: "2024.2", media: 6.5 },
  { semestre: "2025.1", media: 6.8 },
  { semestre: "2025.2", media: 7.1 },
  { semestre: "2026.1", media: 7.3 },
];

const turmasData = [
  { turma: "DIR-1A", media: 7.5 },
  { turma: "DIR-1B", media: 6.8 },
  { turma: "DIR-3A", media: 7.2 },
  { turma: "DIR-3B", media: 6.1 },
  { turma: "DIR-5A", media: 7.8 },
  { turma: "DIR-5B", media: 7.0 },
];

const enadeRadar = [
  { eixo: "Formação Geral", curso: 72, meta: 80 },
  { eixo: "Comp. Específica", curso: 68, meta: 75 },
  { eixo: "Interdisciplinar", curso: 58, meta: 70 },
  { eixo: "Prática Jurídica", curso: 75, meta: 80 },
  { eixo: "Argumentação", curso: 70, meta: 78 },
  { eixo: "Legislação", curso: 65, meta: 72 },
];

const alunosRisco = [
  { nome: "Pedro Almeida", turma: "DIR-3B", media: 4.2, areas: "D. Administrativo, D. Civil" },
  { nome: "Juliana Costa", turma: "DIR-1B", media: 4.8, areas: "D. Constitucional, D. Humanos" },
  { nome: "Ricardo Lima", turma: "DIR-3B", media: 5.0, areas: "D. Penal, D. Processual" },
  { nome: "Camila Rocha", turma: "DIR-5B", media: 5.1, areas: "D. Trabalhista" },
];

const COLORS_TURMA = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--accent))", "hsl(var(--info))"];

export default function CoordenacaoDashboard() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Painel da Coordenação</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão institucional do curso de Direito</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média Geral do Curso" value="7.0" icon={<Award className="h-5 w-5" />} trend={{ value: "+0.5 vs semestre anterior", positive: true }} />
          <StatCard title="Alunos Matriculados" value="384" icon={<Users className="h-5 w-5" />} subtitle="12 turmas ativas" />
          <StatCard title="Docentes Ativos" value="28" icon={<GraduationCap className="h-5 w-5" />} subtitle="6 disciplinas" />
          <StatCard title="Aderência ENADE" value="72%" icon={<Target className="h-5 w-5" />} trend={{ value: "+8%", positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendência histórica */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Tendência Histórica — Média do Curso</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="semestre" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[5, 9]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Line type="monotone" dataKey="media" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Aderência ENADE Radar */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Aderência ao Modelo ENADE</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={enadeRadar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Curso" dataKey="curso" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Meta" dataKey="meta" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Média por turma */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Média por Turma</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={turmasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="turma" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                {turmasData.map((_, i) => (
                  <Cell key={i} fill={COLORS_TURMA[i % COLORS_TURMA.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alunos em risco */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-medium text-foreground">Alunos em Risco Acadêmico</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Aluno</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Turma</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Áreas Críticas</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Média</th>
                </tr>
              </thead>
              <tbody>
                {alunosRisco.map((a, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{a.nome}</td>
                    <td className="py-2.5 text-muted-foreground">{a.turma}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{a.areas}</td>
                    <td className="py-2.5 text-right font-semibold text-destructive">{a.media}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
