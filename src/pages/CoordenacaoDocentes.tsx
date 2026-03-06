import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Award, Target, BookOpen, FileText, BarChart3,
  Users, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronDown,
  Percent, Brain, Eye,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";
import { docentesIndicadores } from "@/data/mockCoordenacao";

const CHART_STYLE = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12,
};

// Extended mock per docente
const docentesDetalhados = docentesIndicadores.map((d) => ({
  ...d,
  email: `${d.nome.split(" ").pop()?.toLowerCase()}@direito.edu.br`,
  titulacao: ["Doutor(a)", "Mestre", "Especialista"][Math.floor(Math.random() * 3)],
  cargaHoraria: 20 + Math.floor(Math.random() * 20),
  avaliacoesCriadas: Math.floor(d.questoesCriadas / 5),
  mediaTurmas: +(d.mediaQuestoes + (Math.random() - 0.3)).toFixed(1),
  ultimaAtividade: `${Math.floor(Math.random() * 7) + 1} dias atrás`,
  historico: [
    { semestre: "2025.1", aprovacao: d.taxaAprovacao - 5, enade: d.aderenciaEnade - 4 },
    { semestre: "2025.2", aprovacao: d.taxaAprovacao - 2, enade: d.aderenciaEnade - 1 },
    { semestre: "2026.1", aprovacao: d.taxaAprovacao, enade: d.aderenciaEnade },
  ],
}));

export default function CoordenacaoDocentes() {
  const [docenteExpandido, setDocenteExpandido] = useState<string | null>(null);

  const totalQuestoes = docentesDetalhados.reduce((s, d) => s + d.questoesCriadas, 0);
  const mediaAprovacao = Math.round(docentesDetalhados.reduce((s, d) => s + d.taxaAprovacao, 0) / docentesDetalhados.length);
  const mediaEnade = Math.round(docentesDetalhados.reduce((s, d) => s + d.aderenciaEnade, 0) / docentesDetalhados.length);

  const barData = docentesDetalhados.map((d) => ({
    nome: d.nome.replace("Prof. ", ""),
    questoes: d.questoesCriadas,
    aprovacao: d.taxaAprovacao,
    enade: d.aderenciaEnade,
  }));

  const radarData = docentesDetalhados.map((d) => ({
    docente: d.nome.replace("Prof. ", "").split(" ")[0],
    questoes: Math.min(d.questoesCriadas / 0.52, 100),
    aprovacao: d.taxaAprovacao,
    enade: d.aderenciaEnade,
  }));

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent" />
            Corpo Docente
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Indicadores de produtividade e qualidade do corpo docente
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Docentes Ativos" value={String(docentesDetalhados.length)} icon={<GraduationCap className="h-5 w-5" />} subtitle="6 disciplinas" />
          <StatCard title="Questões Criadas" value={String(totalQuestoes)} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Média Aprovação" value={`${mediaAprovacao}%`} icon={<Percent className="h-5 w-5" />} />
          <StatCard title="Aderência ENADE" value={`${mediaEnade}%`} icon={<Target className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Questões por docente */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-accent" /> Produção de Questões
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical" margin={{ left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="nome" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={90} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="questoes" name="Questões" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar comparativo */}
          <div className="bg-card rounded-lg border border-border p-5 shadow-card">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-primary" /> Comparativo Docente
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="nome" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="aprovacao" name="Aprovação %" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="enade" name="ENADE %" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards docentes */}
        <div className="space-y-3">
          {docentesDetalhados.map((doc) => (
            <div key={doc.nome} className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setDocenteExpandido(docenteExpandido === doc.nome ? null : doc.nome)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {doc.nome.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{doc.nome}</h4>
                      <Badge variant="outline" className="text-[9px]">{doc.titulacao}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.disciplina} • {doc.turmas.join(", ")} • {doc.cargaHoraria}h/sem</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-xs">
                    <div className="text-center hidden sm:block">
                      <p className="text-muted-foreground">Questões</p>
                      <p className="font-bold text-foreground">{doc.questoesCriadas}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-muted-foreground">Aprovação</p>
                      <p className={`font-bold ${doc.taxaAprovacao >= 85 ? "text-success" : doc.taxaAprovacao >= 75 ? "text-warning" : "text-destructive"}`}>{doc.taxaAprovacao}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">ENADE</p>
                      <p className="font-bold text-foreground">{doc.aderenciaEnade}%</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${docenteExpandido === doc.nome ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </div>

              {docenteExpandido === doc.nome && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Detalhes</p>
                        <div className="text-xs space-y-1.5">
                          <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{doc.email}</span></p>
                          <p><span className="text-muted-foreground">Avaliações criadas:</span> <span className="text-foreground">{doc.avaliacoesCriadas}</span></p>
                          <p><span className="text-muted-foreground">Média das turmas:</span> <span className={`font-semibold ${doc.mediaTurmas >= 7 ? "text-success" : "text-warning"}`}>{doc.mediaTurmas}</span></p>
                          <p><span className="text-muted-foreground">Última atividade:</span> <span className="text-foreground">{doc.ultimaAtividade}</span></p>
                        </div>
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Evolução Semestral</p>
                        <div className="space-y-2">
                          {doc.historico.map((h, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-14">{h.semestre}</span>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">Aprovação</span>
                                  <span className="text-foreground">{h.aprovacao}%</span>
                                </div>
                                <Progress value={h.aprovacao} className="h-1" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-muted-foreground">ENADE</span>
                                  <span className="text-foreground">{h.enade}%</span>
                                </div>
                                <Progress value={h.enade} className="h-1" />
                              </div>
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
      </motion.div>
    </AppLayout>
  );
}
