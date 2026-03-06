import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Shield, Settings, BarChart3, Database, Activity,
  Award, FileText, ClipboardList, TrendingUp, AlertTriangle,
  BookOpen, GraduationCap, Target, Percent,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from "recharts";

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

const atividadeRecente = [
  { acao: "Novo usuário cadastrado", detalhe: "Prof. Roberto Mendes", tempo: "2 min atrás", tipo: "usuario" },
  { acao: "Prova publicada", detalhe: "AV2 — D. Constitucional (DIR-1A)", tempo: "15 min atrás", tipo: "prova" },
  { acao: "Questão validada", detalhe: "Q089 — D. Penal", tempo: "32 min atrás", tipo: "questao" },
  { acao: "Configuração alterada", detalhe: "Peso ENADE atualizado", tempo: "1h atrás", tipo: "config" },
  { acao: "Relatório gerado", detalhe: "Indicadores 2026.1", tempo: "2h atrás", tipo: "relatorio" },
  { acao: "Usuário desativado", detalhe: "Fernanda Lima (Aluno)", tempo: "3h atrás", tipo: "usuario" },
];

const usoPorModulo = [
  { modulo: "Banco de Questões", acessos: 342 },
  { modulo: "Avaliações", acessos: 287 },
  { modulo: "Diagnóstico", acessos: 198 },
  { modulo: "Recomendações", acessos: 156 },
  { modulo: "Provas", acessos: 423 },
];

const usuariosPorPerfil = [
  { name: "Alunos", value: 384 },
  { name: "Professores", value: 28 },
  { name: "Coordenadores", value: 6 },
  { name: "Admins", value: 4 },
];

const crescimentoUsuarios = [
  { mes: "Out", total: 380 },
  { mes: "Nov", total: 395 },
  { mes: "Dez", total: 402 },
  { mes: "Jan", total: 418 },
  { mes: "Fev", total: 435 },
  { mes: "Mar", total: 456 },
];

const PIE_COLORS = ["hsl(var(--info))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--primary))"];

const TIPO_ICONE: Record<string, React.ReactNode> = {
  usuario: <Users className="h-3.5 w-3.5 text-info" />,
  prova: <ClipboardList className="h-3.5 w-3.5 text-accent" />,
  questao: <FileText className="h-3.5 w-3.5 text-success" />,
  config: <Settings className="h-3.5 w-3.5 text-warning" />,
  relatorio: <BarChart3 className="h-3.5 w-3.5 text-primary" />,
};

export default function AdminDashboard() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da plataforma AVAL.IA</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Usuários Totais" value="456" icon={<Users className="h-5 w-5" />} trend={{ value: "+21 este mês", positive: true }} />
          <StatCard title="Questões no Banco" value="1.247" icon={<Database className="h-5 w-5" />} trend={{ value: "+82 este mês", positive: true }} />
          <StatCard title="Provas Aplicadas" value="186" icon={<ClipboardList className="h-5 w-5" />} subtitle="Este semestre" />
          <StatCard title="Uptime" value="99.8%" icon={<Activity className="h-5 w-5" />} subtitle="Últimos 30 dias" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crescimento */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Crescimento de Usuários</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={crescimentoUsuarios}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[350, 480]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Usuários por Perfil</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={usuariosPorPerfil} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}
                  label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                  {usuariosPorPerfil.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uso por módulo */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Acessos por Módulo (mês)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usoPorModulo} layout="vertical" margin={{ left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="modulo" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="acessos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Atividade recente */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Atividade Recente</h3>
            <div className="space-y-2.5">
              {atividadeRecente.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-background hover:bg-muted/30 transition-colors">
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    {TIPO_ICONE[a.tipo]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{a.acao}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{a.detalhe}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{a.tempo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
