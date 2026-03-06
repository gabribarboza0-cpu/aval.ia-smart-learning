import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Award, Target, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Minus, Eye, BarChart3, BookOpen, ShieldAlert, UserCheck, UserX,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";
import { turmasDesempenho, alunosEmRisco } from "@/data/mockCoordenacao";

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

function getMediaColor(m: number) {
  if (m >= 7) return "text-success";
  if (m >= 5.5) return "text-warning";
  return "text-destructive";
}

function getBarFill(v: number) {
  if (v >= 7) return "hsl(var(--success))";
  if (v >= 5.5) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

// Mock alunos por turma
function gerarAlunos(turma: string) {
  const risco = alunosEmRisco.filter((a) => a.turma === turma);
  const t = turmasDesempenho.find((t) => t.turma === turma)!;
  const normais = Array.from({ length: t.alunos - risco.length }, (_, i) => ({
    id: `n-${turma}-${i}`,
    nome: [
      "Gabriel Oliveira", "Isabela Martins", "Thiago Pereira", "Larissa Mendes",
      "Bruno Carvalho", "Amanda Ribeiro", "Vinícius Alves", "Natália Castro",
      "Rafael Souza", "Carolina Nunes", "Diego Santos", "Bianca Lima",
      "Henrique Araújo", "Fernanda Gomes", "Matheus Costa", "Letícia Barbosa",
      "André Melo", "Patrícia Rocha", "Gustavo Cardoso", "Daniela Freitas",
      "Leonardo Pinto", "Renata Moreira", "Felipe Correia", "Vanessa Duarte",
      "Rodrigo Teixeira", "Jéssica Monteiro", "Eduardo Fonseca", "Tatiana Lopes",
      "Marcelo Vieira", "Priscila Machado",
    ][i % 30],
    media: +(t.media + (Math.random() * 2 - 0.8)).toFixed(1),
    frequencia: Math.round(82 + Math.random() * 15),
    status: "regular" as const,
  }));
  return [
    ...risco.map((r) => ({ ...r, status: "risco" as const })),
    ...normais,
  ].sort((a, b) => a.media - b.media);
}

export default function CoordenacaoTurmas() {
  const [turmaSelecionada, setTurmaSelecionada] = useState(turmasDesempenho[0].turma);
  const turma = turmasDesempenho.find((t) => t.turma === turmaSelecionada)!;
  const alunos = gerarAlunos(turmaSelecionada);
  const alunosRiscoTurma = alunosEmRisco.filter((a) => a.turma === turmaSelecionada);

  const totalAlunos = turmasDesempenho.reduce((s, t) => s + t.alunos, 0);
  const mediaGeral = +(turmasDesempenho.reduce((s, t) => s + t.media * t.alunos, 0) / totalAlunos).toFixed(1);

  const compData = turma.disciplinas.map((d) => ({
    disciplina: d.nome,
    media: d.media,
  }));

  // Comparison bar chart
  const comparacaoData = turmasDesempenho.map((t) => ({
    turma: t.turma,
    media: t.media,
    aprovacao: t.aprovacao,
  }));

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-accent" />
              Gestão de Turmas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {turmasDesempenho.length} turmas ativas • {totalAlunos} alunos matriculados
            </p>
          </div>
          <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {turmasDesempenho.map((t) => (
                <SelectItem key={t.turma} value={t.turma}>{t.turma} — {t.alunos} alunos</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats turma selecionada */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Média da Turma" value={turma.media.toFixed(1)} icon={<Award className="h-5 w-5" />}
            trend={{ value: turma.media >= mediaGeral ? `acima da geral (${mediaGeral})` : `abaixo da geral (${mediaGeral})`, positive: turma.media >= mediaGeral }}
          />
          <StatCard title="Alunos" value={String(turma.alunos)} icon={<Users className="h-5 w-5" />} subtitle={turma.semestre} />
          <StatCard title="Aprovação" value={`${turma.aprovacao}%`} icon={<UserCheck className="h-5 w-5" />} />
          <StatCard title="Em Risco" value={String(alunosRiscoTurma.length)} icon={<AlertTriangle className="h-5 w-5" />}
            trend={alunosRiscoTurma.length > 0 ? { value: "requer atenção", positive: false } : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disciplinas da turma */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-accent" />
              Desempenho por Disciplina — {turmaSelecionada}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={compData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="disciplina" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                  {compData.map((d, i) => <Cell key={i} fill={getBarFill(d.media)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparação entre turmas */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              Comparativo Geral
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparacaoData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="turma" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="aprovacao" name="Aprovação %" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de alunos */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Alunos — {turmaSelecionada}
            </h3>
            <Badge variant="outline" className="text-xs">{alunos.length} alunos</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Aluno</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium">Freq.</th>
                  <th className="text-center py-2 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Média</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 text-xs font-medium text-foreground">{a.nome}</td>
                    <td className="py-2.5 text-center text-xs text-muted-foreground">{a.frequencia}%</td>
                    <td className="py-2.5 text-center">
                      {a.status === "risco" ? (
                        <Badge className="text-[9px] bg-destructive/10 text-destructive border-destructive/20">Em risco</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px]">Regular</Badge>
                      )}
                    </td>
                    <td className={`py-2.5 text-right text-sm font-bold ${getMediaColor(a.media)}`}>{a.media.toFixed(1)}</td>
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
