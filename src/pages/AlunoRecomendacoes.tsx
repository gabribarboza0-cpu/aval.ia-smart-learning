import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Target, Clock, Zap, CheckCircle, Circle, Play, Award,
  ChevronDown, ChevronRight, FileText, Video, BookMarked, Scale,
  Brain, ListChecks, BarChart3, Sparkles,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockQuestoes } from "@/data/mockQuestoes";
import { gerarDiagnosticoMock } from "@/lib/diagnosticoEngine";
import { gerarRecomendacoes, TrilhaEstudo, QuizReforco } from "@/lib/recomendacaoEngine";

const TIPO_ICONS: Record<string, React.ReactNode> = {
  leitura: <FileText className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  exercicio: <Zap className="h-3.5 w-3.5" />,
  jurisprudencia: <Scale className="h-3.5 w-3.5" />,
  resumo: <BookMarked className="h-3.5 w-3.5" />,
};

const PRIORIDADE_STYLES: Record<string, string> = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-warning/10 text-warning border-warning/20",
  baixa: "bg-info/10 text-info border-info/20",
};

const PRIORIDADE_LABELS: Record<string, string> = {
  alta: "Alta Prioridade",
  media: "Média Prioridade",
  baixa: "Baixa Prioridade",
};

function TrilhaCard({ trilha }: { trilha: TrilhaEstudo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-card rounded-lg border border-border shadow-card overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`text-[10px] ${PRIORIDADE_STYLES[trilha.prioridade]}`}>
                {PRIORIDADE_LABELS[trilha.prioridade]}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {trilha.nivel === "iniciante" ? "Iniciante" : trilha.nivel === "intermediario" ? "Intermediário" : "Avançado"}
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-foreground">{trilha.disciplina}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{trilha.tema}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-muted-foreground">
              {trilha.etapaConcluida}/{trilha.totalEtapas}
            </span>
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <Progress value={trilha.progresso} className="h-1.5" />
          <p className="text-[10px] text-muted-foreground mt-1">{trilha.progresso}% concluído</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
              {trilha.conteudos.map((conteudo) => (
                <div
                  key={conteudo.id}
                  className={`flex items-center gap-3 p-2.5 rounded-md border transition-colors ${
                    conteudo.concluido
                      ? "bg-success/5 border-success/20 opacity-70"
                      : "bg-background border-border hover:border-primary/30 cursor-pointer"
                  }`}
                >
                  {conteudo.concluido ? (
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {TIPO_ICONS[conteudo.tipo]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${conteudo.concluido ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {conteudo.titulo}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{conteudo.duracao}</span>
                </div>
              ))}
              {trilha.quizDisponivel && (
                <Button size="sm" className="w-full mt-2 gap-2" variant="outline">
                  <Play className="h-3.5 w-3.5" />
                  Iniciar Quiz de Reforço
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuizCard({ quiz }: { quiz: QuizReforco }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">{quiz.titulo}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{quiz.disciplina} • {quiz.tema}</p>
        </div>
        <Brain className="h-5 w-5 text-accent shrink-0" />
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ListChecks className="h-3 w-3" /> {quiz.totalQuestoes} questões
        </span>
        <span className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" /> {quiz.tentativas} tentativa{quiz.tentativas !== 1 ? "s" : ""}
        </span>
        {quiz.melhorNota !== null && (
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" /> Melhor: {quiz.melhorNota}%
          </span>
        )}
      </div>
      <Button size="sm" className="w-full mt-3 gap-2" variant={quiz.melhorNota !== null ? "outline" : "default"}>
        <Play className="h-3.5 w-3.5" />
        {quiz.melhorNota !== null ? "Tentar Novamente" : "Iniciar Quiz"}
      </Button>
    </div>
  );
}

export default function AlunoRecomendacoes() {
  const recomendacao = useMemo(() => {
    const diagnostico = gerarDiagnosticoMock(mockQuestoes);
    return gerarRecomendacoes(diagnostico);
  }, []);

  const { resumoGeral, trilhas, quizzes, metasSemana } = recomendacao;

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Recomendações de Reforço
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trilhas de estudo personalizadas com base no seu diagnóstico acadêmico
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Trilhas Ativas" value={String(resumoGeral.trilhasAtivas)} icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Conteúdos Pendentes" value={String(resumoGeral.conteudosPendentes)} icon={<Target className="h-5 w-5" />} />
          <StatCard title="Quizzes Disponíveis" value={String(resumoGeral.quizzesDisponiveis)} icon={<Zap className="h-5 w-5" />} />
          <StatCard title="Horas Estimadas" value={`${resumoGeral.horasEstimadas}h`} icon={<Clock className="h-5 w-5" />} />
        </div>

        {/* Metas semanais */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            Metas da Semana
          </h3>
          <div className="space-y-2">
            {metasSemana.map((meta) => (
              <div
                key={meta.id}
                className={`flex items-center gap-3 p-3 rounded-md border transition-colors ${
                  meta.concluida
                    ? "bg-success/5 border-success/20"
                    : "bg-background border-border"
                }`}
              >
                {meta.concluida ? (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm flex-1 ${meta.concluida ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {meta.descricao}
                </span>
                {meta.disciplina && (
                  <Badge variant="outline" className="text-[10px] shrink-0">{meta.disciplina}</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs: Trilhas e Quizzes */}
        <Tabs defaultValue="trilhas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="trilhas" className="gap-2">
              <BookOpen className="h-4 w-4" /> Trilhas de Estudo
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="gap-2">
              <Zap className="h-4 w-4" /> Quizzes de Reforço
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trilhas" className="space-y-4">
            {trilhas.length > 0 ? (
              trilhas.map((trilha) => <TrilhaCard key={trilha.id} trilha={trilha} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nenhuma trilha de reforço necessária. Excelente desempenho!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quizzes">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhum quiz de reforço disponível no momento.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
