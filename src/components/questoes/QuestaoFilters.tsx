import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DISCIPLINAS, COMPETENCIAS, NivelDificuldade, TipoQuestao, StatusValidacao } from "@/types/questao";

export interface QuestaoFilterValues {
  busca: string;
  disciplina: string;
  tema: string;
  dificuldade: string;
  tipoQuestao: string;
  status: string;
  professor: string;
  competencia: string;
}

const defaultFilters: QuestaoFilterValues = {
  busca: "",
  disciplina: "",
  tema: "",
  dificuldade: "",
  tipoQuestao: "",
  status: "",
  professor: "",
  competencia: "",
};

interface Props {
  filters: QuestaoFilterValues;
  onChange: (filters: QuestaoFilterValues) => void;
  professores: string[];
}

export { defaultFilters };

export default function QuestaoFilters({ filters, onChange, professores }: Props) {
  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== "busca").length;

  const update = (key: keyof QuestaoFilterValues, value: string) => {
    const next = { ...filters, [key]: value };
    if (key === "disciplina") next.tema = "";
    onChange(next);
  };

  const clearAll = () => onChange(defaultFilters);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por enunciado, tema ou ID..."
          value={filters.busca}
          onChange={(e) => update("busca", e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <Select value={filters.disciplina} onValueChange={(v) => update("disciplina", v)}>
          <SelectTrigger className="w-[180px] h-9 text-xs">
            <SelectValue placeholder="Disciplina" />
          </SelectTrigger>
          <SelectContent>
            {DISCIPLINAS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.dificuldade} onValueChange={(v) => update("dificuldade", v)}>
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            {(["Fácil", "Médio", "Difícil", "Muito Difícil"] as NivelDificuldade[]).map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.tipoQuestao} onValueChange={(v) => update("tipoQuestao", v)}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {(["Múltipla Escolha", "Verdadeiro/Falso", "Dissertativa", "Caso Prático"] as TipoQuestao[]).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => update("status", v)}>
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {(["Rascunho", "Em Revisão", "Validada", "Arquivada"] as StatusValidacao[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.professor} onValueChange={(v) => update("professor", v)}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Professor" />
          </SelectTrigger>
          <SelectContent>
            {professores.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.competencia} onValueChange={(v) => update("competencia", v)}>
          <SelectTrigger className="w-[180px] h-9 text-xs">
            <SelectValue placeholder="Competência" />
          </SelectTrigger>
          <SelectContent>
            {COMPETENCIAS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-xs gap-1 text-muted-foreground">
            <X className="h-3 w-3" />
            Limpar ({activeCount})
          </Button>
        )}
      </div>
    </div>
  );
}
