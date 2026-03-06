import { Questao } from "@/types/questao";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, BarChart3, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  questao: Questao;
  onView: (q: Questao) => void;
  onEdit: (q: Questao) => void;
}

const difficultyColor: Record<string, string> = {
  "Fácil": "bg-success/10 text-success border-success/20",
  "Médio": "bg-warning/10 text-warning border-warning/20",
  "Difícil": "bg-destructive/10 text-destructive border-destructive/20",
  "Muito Difícil": "bg-destructive/20 text-destructive border-destructive/30",
};

const statusColor: Record<string, string> = {
  "Rascunho": "bg-muted text-muted-foreground",
  "Em Revisão": "bg-info/10 text-info",
  "Validada": "bg-success/10 text-success",
  "Arquivada": "bg-muted text-muted-foreground",
};

export default function QuestaoCard({ questao, onView, onEdit }: Props) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-elevated transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{questao.id}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColor[questao.nivelDificuldade]}`}>
              {questao.nivelDificuldade}
            </Badge>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColor[questao.statusValidacao]}`}>
              {questao.statusValidacao}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {questao.tipoQuestao}
            </Badge>
          </div>

          {/* Enunciado */}
          <p className="text-sm text-foreground line-clamp-2 mb-3">{questao.enunciado}</p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="flex items-center gap-1 text-accent-foreground bg-accent/10 px-2 py-0.5 rounded-full">
              <BookOpen className="h-3 w-3" />
              {questao.disciplinaPredominante}
            </span>
            <span className="text-muted-foreground">{questao.tema}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{questao.professorResponsavel}</span>
          </div>

          {/* Stats */}
          {questao.historicoUso > 0 && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {questao.historicoUso}x usado
              </span>
              <span className="text-success">{questao.taxaAcerto}% acerto</span>
              <span className="text-destructive">{questao.taxaErro}% erro</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(questao)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(questao)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
