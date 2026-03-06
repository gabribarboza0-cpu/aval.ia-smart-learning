import { motion } from "framer-motion";
import { Users, FileText, BarChart3, Target, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import AppLayout from "@/components/AppLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts";

const notasDistribuicao = [
  { faixa: "0-2", alunos: 2 },
  { faixa: "2-4", alunos: 5 },
  { faixa: "4-6", alunos: 12 },
  { faixa: "6-8", alunos: 25 },
  { faixa: "8-10", alunos: 16 },
];

const disciplinaDesempenho = [
  { name: "D. Constitucional", media: 7.8 },
  { name: "D. Civil", media: 6.2 },
  { name: "D. Penal", media: 7.1 },
  { name: "D. Administrativo", media: 5.8 },
  { name: "D. Trabalhista", media: 6.9 },
];

const questoesErro = [
  { questao: "Q12", tema: "Atos Administrativos", erros: 78, dificuldade: "Alta" },
  { questao: "Q05", tema: "Responsabilidade Civil", erros: 65, dificuldade: "Média" },
  { questao: "Q18", tema: "Competências Legislativas", erros: 58, dificuldade: "Alta" },
  { questao: "Q03", tema: "Contratos", erros: 52, dificuldade: "Média" },
  { questao: "Q21", tema: "Princípio da Legalidade", erros: 48, dificuldade: "Baixa" },
];

const provas = [
  { nome: "AV1 - Direito Constitucional", turma: "DIR-5A", data: "15/03/2026", status: "Aplicada", taxa: "95%" },
  { nome: "Quiz Reforço - D. Administrativo", turma: "DIR-5A", data: "22/03/2026", status: "Agendada", taxa: "-" },
  { nome: "AV1 - Direito Civil", turma: "DIR-3B", data: "10/03/2026", status: "Aplicada", taxa: "88%" },
];

const COLORS = ["hsl(var(--destructive))", "hsl(var(--warning))", "hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--success))"];

export default function ProfessorDashboard() {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Painel do Professor</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral das suas turmas e avaliações</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média das Turmas" value="6.8" icon={<BarChart3 className="h-5 w-5" />} trend={{ value: "+0.3", positive: true }} />
          <StatCard title="Provas Criadas" value="24" icon={<FileText className="h-5 w-5" />} subtitle="3 este mês" />
          <StatCard title="Alunos Ativos" value="142" icon={<Users className="h-5 w-5" />} subtitle="4 turmas" />
          <StatCard title="Taxa de Conclusão" value="91%" icon={<CheckCircle className="h-5 w-5" />} trend={{ value: "+2%", positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de notas */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Distribuição de Notas — Última Prova</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={notasDistribuicao}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="faixa" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="alunos" radius={[4, 4, 0, 0]}>
                  {notasDistribuicao.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Desempenho por disciplina */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-4">Média por Disciplina</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={disciplinaDesempenho} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={120} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="media" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Questões com maior erro */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-medium text-foreground">Questões com Maior Taxa de Erro</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Questão</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Tema</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Dificuldade</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">% Erros</th>
                </tr>
              </thead>
              <tbody>
                {questoesErro.map((q, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{q.questao}</td>
                    <td className="py-2.5 text-muted-foreground">{q.tema}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        q.dificuldade === "Alta" ? "bg-destructive/10 text-destructive" :
                        q.dificuldade === "Média" ? "bg-warning/10 text-warning" :
                        "bg-success/10 text-success"
                      }`}>{q.dificuldade}</span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-destructive">{q.erros}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provas recentes */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Provas Recentes</h3>
          <div className="space-y-3">
            {provas.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-muted/20 border border-border/50 gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">{p.turma} • {p.data}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "Aplicada" ? "bg-success/10 text-success" : "bg-info/10 text-info"
                  }`}>{p.status}</span>
                  {p.taxa !== "-" && <span className="text-xs text-muted-foreground">Conclusão: {p.taxa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
