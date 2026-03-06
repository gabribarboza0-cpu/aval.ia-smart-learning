import { motion } from "framer-motion";
import { BookOpen, ClipboardList, Brain, TrendingUp, BarChart3, Target, Award, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

const radarData = [
  { subject: "D. Constitucional", score: 82, fullMark: 100 },
  { subject: "D. Civil", score: 65, fullMark: 100 },
  { subject: "D. Penal", score: 78, fullMark: 100 },
  { subject: "D. Administrativo", score: 55, fullMark: 100 },
  { subject: "D. Trabalhista", score: 72, fullMark: 100 },
  { subject: "D. Humanos", score: 88, fullMark: 100 },
];

const evolutionData = [
  { prova: "AV1", nota: 6.5 },
  { prova: "AV2", nota: 7.2 },
  { prova: "Quiz 1", nota: 7.8 },
  { prova: "AV3", nota: 8.1 },
  { prova: "Quiz 2", nota: 8.5 },
  { prova: "AV4", nota: 7.9 },
];

const competenciasData = [
  { name: "Argumentação", valor: 85 },
  { name: "Análise Crítica", valor: 72 },
  { name: "Legislação", valor: 68 },
  { name: "Jurisprudência", valor: 78 },
  { name: "Interdisciplinar", valor: 62 },
];

const recommendations = [
  { title: "Princípios do Direito Administrativo", type: "Texto", priority: "Alta", icon: BookOpen },
  { title: "Quiz: Atos Administrativos", type: "Quiz", priority: "Alta", icon: Brain },
  { title: "Videoaula: Licitações", type: "Vídeo", priority: "Média", icon: Target },
  { title: "Simulado: D. Civil - Obrigações", type: "Simulado", priority: "Média", icon: ClipboardList },
];

export default function AlunoDashboard() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Meu Painel</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe seu desempenho e recomendações</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média Geral" value="7.6" icon={<Award className="h-5 w-5" />} trend={{ value: "+0.4 vs semestre anterior", positive: true }} />
          <StatCard title="Provas Realizadas" value="12" icon={<ClipboardList className="h-5 w-5" />} subtitle="3 pendentes" />
          <StatCard title="Taxa de Acerto" value="74%" icon={<Target className="h-5 w-5" />} trend={{ value: "+5% vs última prova", positive: true }} />
          <StatCard title="Quizzes Completados" value="8" icon={<Brain className="h-5 w-5" />} subtitle="2 recomendados" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Mapa de Competências por Disciplina</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Desempenho" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Evolution */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Evolução de Desempenho</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="prova" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Line type="monotone" dataKey="nota" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competências */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Competências Avaliadas</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={competenciasData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={110} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recomendações */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Recomendações de Estudo</h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border/50">
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${rec.priority === "Alta" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                    <rec.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.type} • Prioridade {rec.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Áreas de atenção */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-medium text-foreground">Áreas que Precisam de Atenção</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { area: "Direito Administrativo", score: "55%", detail: "Atos administrativos e licitações" },
              { area: "Interdisciplinaridade", score: "62%", detail: "Conexões entre áreas do Direito" },
              { area: "Direito Civil", score: "65%", detail: "Obrigações e contratos" },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-md bg-warning/5 border border-warning/20">
                <p className="text-sm font-medium text-foreground">{item.area}</p>
                <p className="text-lg font-semibold text-warning mt-1">{item.score}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
