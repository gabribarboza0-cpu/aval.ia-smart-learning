import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, BarChart3, ArrowLeft, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProvaDisponivel, TentativaProva } from "@/types/prova";

interface Props {
  prova: ProvaDisponivel;
  tentativa: TentativaProva;
  onBack: () => void;
}

export default function ProvaResultado({ prova, tentativa, onBack }: Props) {
  const { respostas } = tentativa;
  const corretas = respostas.filter((r, i) => r.alternativaSelecionada === prova.questoes[i]?.gabarito).length;
  const nota = (corretas / prova.questoes.length) * 10;
  const percentual = Math.round((corretas / prova.questoes.length) * 100);
  const tempoTotal = prova.tempoMinutos * 60 - tentativa.tempoRestante;
  const minutos = Math.floor(tempoTotal / 60);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Header */}
        <Button variant="ghost" onClick={onBack} className="gap-1 -ml-3 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar às provas
        </Button>

        {/* Result card */}
        <div className="bg-card rounded-xl border border-border p-8 shadow-card text-center space-y-4">
          <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mx-auto ${
            nota >= 7 ? "bg-success/10" : nota >= 5 ? "bg-warning/10" : "bg-destructive/10"
          }`}>
            {nota >= 7 ? (
              <CheckCircle className="h-10 w-10 text-success" />
            ) : (
              <BarChart3 className={`h-10 w-10 ${nota >= 5 ? "text-warning" : "text-destructive"}`} />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Prova Enviada!</h1>
            <p className="text-muted-foreground mt-1">{prova.titulo}</p>
          </div>

          <div className="text-5xl font-bold text-foreground">{nota.toFixed(1)}</div>
          <p className="text-sm text-muted-foreground">Nota obtida</p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-lg font-semibold text-foreground">{corretas}/{prova.questoes.length}</p>
              <p className="text-xs text-muted-foreground">Acertos</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{percentual}%</p>
              <p className="text-xs text-muted-foreground">Aproveitamento</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{minutos} min</p>
              <p className="text-xs text-muted-foreground">Tempo utilizado</p>
            </div>
          </div>
        </div>

        {/* Gabarito */}
        {prova.gabaritoPosProva && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" /> Gabarito Comentado
            </h2>

            {prova.questoes.map((q, idx) => {
              const resp = respostas[idx];
              const acertou = resp.alternativaSelecionada === q.gabarito;

              return (
                <div
                  key={q.id}
                  className={`bg-card rounded-lg border p-5 shadow-card ${
                    acertou ? "border-success/30" : "border-destructive/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      acertou ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}>
                      Q{String(idx + 1).padStart(2, "0")}
                    </span>
                    {acertou ? (
                      <Badge className="bg-success/10 text-success border-success/20 gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" /> Correta
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-xs">
                        <XCircle className="h-3 w-3" /> Incorreta
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-foreground mb-3">{q.enunciado}</p>

                  <div className="space-y-1.5 mb-3">
                    {q.alternativas.map((alt, ai) => (
                      <div
                        key={ai}
                        className={`text-sm px-3 py-1.5 rounded-md ${
                          ai === q.gabarito
                            ? "bg-success/10 text-success font-medium border border-success/20"
                            : resp.alternativaSelecionada === ai && ai !== q.gabarito
                            ? "bg-destructive/10 text-destructive line-through border border-destructive/20"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + ai)})</span>
                        {alt}
                        {ai === q.gabarito && <CheckCircle className="h-3.5 w-3.5 inline ml-2" />}
                        {resp.alternativaSelecionada === ai && ai !== q.gabarito && <XCircle className="h-3.5 w-3.5 inline ml-2" />}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-muted/30 rounded-md border border-border/50">
                    <p className="text-xs font-medium text-foreground mb-1">Justificativa:</p>
                    <p className="text-xs text-muted-foreground">{q.justificativa}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar às provas
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
