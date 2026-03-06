import { Questao } from "@/types/questao";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, BarChart3, BookOpen, Calendar, User, Target, Layers } from "lucide-react";

interface Props {
  questao: Questao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuestaoDetailDialog({ questao, open, onOpenChange }: Props) {
  if (!questao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{questao.id}</span>
            <Badge variant="outline" className="text-[10px]">{questao.statusValidacao}</Badge>
            <Badge variant="outline" className="text-[10px]">{questao.nivelDificuldade}</Badge>
          </div>
          <DialogTitle className="text-base font-medium leading-relaxed">{questao.enunciado}</DialogTitle>
        </DialogHeader>

        {/* Alternativas */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alternativas</h4>
          {questao.alternativas.map((alt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-2.5 rounded-md text-sm border ${
                i === questao.gabarito
                  ? "border-success/30 bg-success/5"
                  : "border-border bg-muted/20"
              }`}
            >
              {i === questao.gabarito ? (
                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
              )}
              <span className={i === questao.gabarito ? "text-foreground font-medium" : "text-muted-foreground"}>
                {String.fromCharCode(65 + i)}) {alt}
              </span>
            </div>
          ))}
        </div>

        {/* Justificativa */}
        <div className="bg-accent/5 border border-accent/20 rounded-md p-3">
          <h4 className="text-xs font-medium text-accent-foreground uppercase tracking-wider mb-1">Justificativa</h4>
          <p className="text-sm text-foreground">{questao.justificativa}</p>
        </div>

        <Separator />

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Disciplina</p>
              <p className="font-medium text-foreground">{questao.disciplinaPredominante}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Tema / Subtema</p>
              <p className="font-medium text-foreground">{questao.tema} — {questao.subtema}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Professor</p>
              <p className="font-medium text-foreground">{questao.professorResponsavel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Criação</p>
              <p className="font-medium text-foreground">{new Date(questao.dataCriacao).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Interdisciplinaridade</p>
              <p className="font-medium text-foreground">{questao.nivelInterdisciplinaridade}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium text-foreground">{questao.origemQuestao}</p>
            </div>
          </div>
        </div>

        {/* Disciplinas secundárias */}
        {questao.disciplinasSecundarias.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Aderência por Área</h4>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{questao.disciplinaPredominante}</span>
                <span className="text-muted-foreground">
                  {100 - questao.disciplinasSecundarias.reduce((s, d) => s + d.percentual, 0)}%
                </span>
              </div>
              {questao.disciplinasSecundarias.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{d.disciplina}</span>
                  <span className="text-muted-foreground">{d.percentual}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Competências */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Competências</h4>
          <div className="flex flex-wrap gap-1.5">
            {questao.competencias.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
            ))}
          </div>
        </div>

        {/* Repertório */}
        {questao.repertorioContemporaneo && (
          <div className="bg-muted/30 rounded-md p-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Repertório Contemporâneo</h4>
            <p className="text-sm text-foreground">{questao.repertorioContemporaneo}</p>
          </div>
        )}

        {/* Métricas */}
        {questao.historicoUso > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Métricas de Desempenho</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-muted/20 rounded-md p-2.5 text-center">
                <p className="text-lg font-semibold text-foreground">{questao.historicoUso}</p>
                <p className="text-[10px] text-muted-foreground">Usos</p>
              </div>
              <div className="bg-success/5 rounded-md p-2.5 text-center">
                <p className="text-lg font-semibold text-success">{questao.taxaAcerto}%</p>
                <p className="text-[10px] text-muted-foreground">Acerto</p>
              </div>
              <div className="bg-destructive/5 rounded-md p-2.5 text-center">
                <p className="text-lg font-semibold text-destructive">{questao.taxaErro}%</p>
                <p className="text-[10px] text-muted-foreground">Erro</p>
              </div>
              <div className="bg-info/5 rounded-md p-2.5 text-center">
                <p className="text-lg font-semibold text-info">{questao.poderDiscriminacao.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">Discriminação</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
