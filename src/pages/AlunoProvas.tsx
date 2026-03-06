import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock, BookOpen, Target, Play, CheckCircle, Lock, RotateCcw, Award } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import ProvaInterface from "@/components/provas/ProvaInterface";
import ProvaResultado from "@/components/provas/ProvaResultado";
import { ProvaDisponivel, TentativaProva } from "@/types/prova";
import { mockProvasDisponiveis } from "@/data/mockProvas";
import { useToast } from "@/hooks/use-toast";

type View = "lista" | "prova" | "resultado";

export default function AlunoProvas() {
  const [view, setView] = useState<View>("lista");
  const [provas] = useState<ProvaDisponivel[]>(mockProvasDisponiveis);
  const [provaAtual, setProvaAtual] = useState<ProvaDisponivel | null>(null);
  const [ultimaTentativa, setUltimaTentativa] = useState<TentativaProva | null>(null);
  const { toast } = useToast();

  const iniciarProva = (prova: ProvaDisponivel) => {
    if (prova.tentativasRealizadas >= prova.tentativasPermitidas) {
      toast({ title: "Limite de tentativas atingido", description: "Você já utilizou todas as tentativas permitidas.", variant: "destructive" });
      return;
    }
    setProvaAtual(prova);
    setView("prova");
  };

  const handleFinish = (tentativa: TentativaProva) => {
    const corretas = tentativa.respostas.filter((r, i) => r.alternativaSelecionada === provaAtual!.questoes[i]?.gabarito).length;
    const nota = (corretas / provaAtual!.questoes.length) * 10;
    tentativa.nota = nota;
    setUltimaTentativa(tentativa);
    setView("resultado");
    toast({ title: "Prova enviada com sucesso!", description: `Nota obtida: ${nota.toFixed(1)}` });
  };

  const handleBackToList = () => {
    setView("lista");
    setProvaAtual(null);
    setUltimaTentativa(null);
  };

  // Prova view - full screen without sidebar
  if (view === "prova" && provaAtual) {
    return <ProvaInterface prova={provaAtual} onFinish={handleFinish} onExit={handleBackToList} />;
  }

  // Resultado view - full screen
  if (view === "resultado" && provaAtual && ultimaTentativa) {
    return <ProvaResultado prova={provaAtual} tentativa={ultimaTentativa} onBack={handleBackToList} />;
  }

  // Stats
  const disponiveis = provas.filter((p) => p.status === "Disponível" && p.tentativasRealizadas < p.tentativasPermitidas).length;
  const realizadas = provas.filter((p) => p.tentativasRealizadas > 0).length;
  const mediaNotas = provas.filter((p) => p.notaObtida !== undefined).reduce((s, p) => s + p.notaObtida!, 0) / Math.max(1, provas.filter((p) => p.notaObtida !== undefined).length);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-accent" />
            Minhas Provas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Provas disponíveis e realizadas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Disponíveis" value={String(disponiveis)} icon={<BookOpen className="h-5 w-5" />} />
          <StatCard title="Realizadas" value={String(realizadas)} icon={<CheckCircle className="h-5 w-5" />} />
          <StatCard title="Média" value={mediaNotas > 0 ? mediaNotas.toFixed(1) : "—"} icon={<Award className="h-5 w-5" />} />
          <StatCard title="Total" value={String(provas.length)} icon={<ClipboardList className="h-5 w-5" />} />
        </div>

        {/* Prova cards */}
        <div className="space-y-4">
          {provas.map((prova) => {
            const podeIniciar = prova.status === "Disponível" && prova.tentativasRealizadas < prova.tentativasPermitidas;
            const esgotada = prova.tentativasRealizadas >= prova.tentativasPermitidas;

            return (
              <motion.div
                key={prova.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{prova.titulo}</h3>
                      <Badge
                        className={`text-xs ${
                          prova.status === "Disponível" ? "bg-success/10 text-success border-success/20" :
                          prova.status === "Corrigida" ? "bg-info/10 text-info border-info/20" :
                          prova.status === "Expirada" ? "bg-muted text-muted-foreground" :
                          "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        {prova.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{prova.modo}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {prova.disciplina} • {prova.professor} • {prova.turma}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {prova.totalQuestoes} questões</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {prova.tempoMinutos} min</span>
                      <span className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        {prova.tentativasRealizadas}/{prova.tentativasPermitidas} tentativa{prova.tentativasPermitidas > 1 ? "s" : ""}
                      </span>
                      <span>
                        Até {new Date(prova.dataFim).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {prova.notaObtida !== undefined && (
                      <div className="text-center">
                        <p className={`text-xl font-bold ${prova.notaObtida >= 7 ? "text-success" : prova.notaObtida >= 5 ? "text-warning" : "text-destructive"}`}>
                          {prova.notaObtida.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Melhor nota</p>
                      </div>
                    )}
                    {podeIniciar ? (
                      <Button onClick={() => iniciarProva(prova)} className="gap-1.5">
                        <Play className="h-4 w-4" />
                        {prova.tentativasRealizadas > 0 ? "Nova tentativa" : "Iniciar"}
                      </Button>
                    ) : esgotada ? (
                      <Button variant="outline" disabled className="gap-1.5">
                        <Lock className="h-4 w-4" /> Esgotada
                      </Button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
}
