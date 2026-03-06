import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flag, ChevronLeft, ChevronRight, Send, AlertTriangle, CheckCircle, BookmarkCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProvaDisponivel, RespostaAluno, TentativaProva } from "@/types/prova";
import { useToast } from "@/hooks/use-toast";

interface Props {
  prova: ProvaDisponivel;
  onFinish: (tentativa: TentativaProva) => void;
  onExit: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ProvaInterface({ prova, onFinish, onExit }: Props) {
  const { toast } = useToast();
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(prova.tempoMinutos * 60);
  const [respostas, setRespostas] = useState<RespostaAluno[]>(
    prova.questoes.map((q) => ({
      questaoId: q.id,
      alternativaSelecionada: null,
      marcadaParaRevisao: false,
      tempoGasto: 0,
    }))
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const tempoQuestaoRef = useRef(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      tempoQuestaoRef.current += 1;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
      // In real app, save to server here
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAutoSubmit = useCallback(() => {
    const tentativa: TentativaProva = {
      provaId: prova.id,
      respostas,
      questaoAtual,
      tempoRestante: 0,
      iniciada: new Date().toISOString(),
      finalizada: new Date().toISOString(),
    };
    onFinish(tentativa);
    toast({ title: "Tempo esgotado!", description: "Sua prova foi enviada automaticamente.", variant: "destructive" });
  }, [respostas, questaoAtual, prova.id, onFinish, toast]);

  const selectAnswer = (alternativa: number) => {
    setRespostas((prev) =>
      prev.map((r, i) =>
        i === questaoAtual
          ? { ...r, alternativaSelecionada: alternativa, tempoGasto: r.tempoGasto + tempoQuestaoRef.current }
          : r
      )
    );
    tempoQuestaoRef.current = 0;
  };

  const toggleRevisao = () => {
    setRespostas((prev) =>
      prev.map((r, i) =>
        i === questaoAtual ? { ...r, marcadaParaRevisao: !r.marcadaParaRevisao } : r
      )
    );
  };

  const goToQuestion = (idx: number) => {
    // Save time for current question
    setRespostas((prev) =>
      prev.map((r, i) =>
        i === questaoAtual ? { ...r, tempoGasto: r.tempoGasto + tempoQuestaoRef.current } : r
      )
    );
    tempoQuestaoRef.current = 0;
    setQuestaoAtual(idx);
    setShowNavPanel(false);
  };

  const handleSubmit = () => {
    const tentativa: TentativaProva = {
      provaId: prova.id,
      respostas,
      questaoAtual,
      tempoRestante,
      iniciada: new Date().toISOString(),
      finalizada: new Date().toISOString(),
    };
    onFinish(tentativa);
  };

  const respondidas = respostas.filter((r) => r.alternativaSelecionada !== null).length;
  const revisao = respostas.filter((r) => r.marcadaParaRevisao).length;
  const questao = prova.questoes[questaoAtual];
  const resposta = respostas[questaoAtual];
  const progress = (respondidas / prova.questoes.length) * 100;
  const timeWarning = tempoRestante < 300;
  const timeCritical = tempoRestante < 60;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">{prova.titulo}</h1>
            <p className="text-xs text-muted-foreground">{prova.disciplina} • {prova.professor}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Auto-save indicator */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Save className="h-3 w-3" />
              <span>Salvo {lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${
              timeCritical ? "bg-destructive/10 text-destructive animate-pulse" :
              timeWarning ? "bg-warning/10 text-warning" :
              "bg-muted text-foreground"
            }`}>
              <Clock className="h-4 w-4" />
              {formatTime(tempoRestante)}
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-xs text-muted-foreground shrink-0">
            {respondidas}/{prova.questoes.length} respondidas
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Question area */}
        <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={questaoAtual}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Question header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Questão {questaoAtual + 1} de {prova.questoes.length}
                  </span>
                  {resposta.marcadaParaRevisao && (
                    <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
                      <Flag className="h-3 w-3" /> Revisão
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={toggleRevisao} className="gap-1 text-xs">
                  <Flag className={`h-3.5 w-3.5 ${resposta.marcadaParaRevisao ? "text-warning fill-warning" : ""}`} />
                  {resposta.marcadaParaRevisao ? "Desmarcar" : "Marcar para revisão"}
                </Button>
              </div>

              {/* Question body */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <p className="text-foreground leading-relaxed">{questao.enunciado}</p>
              </div>

              {/* Alternatives */}
              <RadioGroup
                value={resposta.alternativaSelecionada !== null ? String(resposta.alternativaSelecionada) : ""}
                onValueChange={(v) => selectAnswer(Number(v))}
                className="space-y-3"
              >
                {questao.alternativas.map((alt, ai) => (
                  <label
                    key={ai}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      resposta.alternativaSelecionada === ai
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <RadioGroupItem value={String(ai)} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-primary mr-2">
                        {String.fromCharCode(65 + ai)})
                      </span>
                      <span className="text-sm text-foreground">{alt}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            <Button
              variant="outline"
              onClick={() => goToQuestion(questaoAtual - 1)}
              disabled={questaoAtual === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>

            <Button variant="outline" onClick={() => setShowNavPanel(!showNavPanel)} className="sm:hidden text-xs">
              Navegação
            </Button>

            {questaoAtual < prova.questoes.length - 1 ? (
              <Button onClick={() => goToQuestion(questaoAtual + 1)} className="gap-1">
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="h-4 w-4" /> Enviar Prova
              </Button>
            )}
          </div>
        </div>

        {/* Side navigation panel - desktop */}
        <aside className="hidden sm:block w-60 border-l border-border bg-card p-4 shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Navegação</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {respostas.map((r, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`h-9 w-9 rounded-md text-xs font-medium flex items-center justify-center transition-all ${
                  i === questaoAtual
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : r.marcadaParaRevisao
                    ? "bg-warning/10 text-warning border border-warning/30"
                    : r.alternativaSelecionada !== null
                    ? "bg-success/10 text-success border border-success/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-success/10 border border-success/30" />
              <span className="text-muted-foreground">Respondidas ({respondidas})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-warning/10 border border-warning/30" />
              <span className="text-muted-foreground">Para revisão ({revisao})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-muted border border-border" />
              <span className="text-muted-foreground">Não respondidas ({prova.questoes.length - respondidas})</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="w-full gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              <Send className="h-3.5 w-3.5" /> Enviar Prova
            </Button>
          </div>
        </aside>
      </div>

      {/* Mobile navigation panel */}
      <AnimatePresence>
        {showNavPanel && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 bg-card border-t border-border p-4 z-50 sm:hidden shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">Navegação</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNavPanel(false)}>Fechar</Button>
            </div>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {respostas.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className={`h-9 rounded-md text-xs font-medium flex items-center justify-center transition-all ${
                    i === questaoAtual
                      ? "bg-primary text-primary-foreground"
                      : r.marcadaParaRevisao
                      ? "bg-warning/10 text-warning border border-warning/30"
                      : r.alternativaSelecionada !== null
                      ? "bg-success/10 text-success border border-success/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              onClick={() => { setShowNavPanel(false); setShowSubmitDialog(true); }}
              className="w-full gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              <Send className="h-3.5 w-3.5" /> Enviar Prova
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {respondidas < prova.questoes.length ? (
                <AlertTriangle className="h-5 w-5 text-warning" />
              ) : (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
              Enviar prova?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você respondeu <strong>{respondidas}</strong> de <strong>{prova.questoes.length}</strong> questões.
              </p>
              {prova.questoes.length - respondidas > 0 && (
                <p className="text-warning">
                  ⚠️ Existem {prova.questoes.length - respondidas} questão(ões) sem resposta.
                </p>
              )}
              {revisao > 0 && (
                <p className="text-warning">
                  🔖 Existem {revisao} questão(ões) marcada(s) para revisão.
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Após o envio, não será possível alterar as respostas.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar à prova</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Confirmar envio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
