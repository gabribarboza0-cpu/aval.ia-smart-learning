import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Questao, DISCIPLINAS, COMPETENCIAS, TEMAS_POR_DISCIPLINA, NivelDificuldade, TipoQuestao, StatusValidacao, AderenciaDisciplina } from "@/types/questao";
import { useToast } from "@/hooks/use-toast";
import { upsertQuestao } from "@/lib/questaoService";

interface Props {
  questao?: Questao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  professorId?: string;
}

const emptyQuestao: Omit<Questao, "id" | "dataCriacao"> = {
  enunciado: "",
  alternativas: ["", "", "", ""],
  gabarito: 0,
  justificativa: "",
  disciplinaPredominante: "",
  disciplinasSecundarias: [],
  nivelDificuldade: "Médio",
  tipoQuestao: "Múltipla Escolha",
  competencias: [],
  tema: "",
  subtema: "",
  repertorioContemporaneo: "",
  nivelInterdisciplinaridade: "Baixo",
  perfilTurma: "",
  origemQuestao: "",
  professorResponsavel: "",
  statusValidacao: "Rascunho",
  historicoUso: 0,
  taxaAcerto: 0,
  taxaErro: 0,
  indiceDificuldadeObservado: 0,
  poderDiscriminacao: 0,
};

export default function QuestaoFormDialog({ questao, open, onOpenChange, onSave, professorId }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<Omit<Questao, "id" | "dataCriacao">>(emptyQuestao);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (questao) {
      const { id, dataCriacao, ...rest } = questao;
      setForm(rest);
    } else {
      setForm(emptyQuestao);
    }
  }, [questao, open]);

  const temas = form.disciplinaPredominante ? (TEMAS_POR_DISCIPLINA[form.disciplinaPredominante] || []) : [];

  const toggleCompetencia = (c: string) => {
    setForm((f) => ({
      ...f,
      competencias: f.competencias.includes(c) ? f.competencias.filter((x) => x !== c) : [...f.competencias, c],
    }));
  };

  const updateAlternativa = (i: number, val: string) => {
    const alts = [...form.alternativas];
    alts[i] = val;
    setForm((f) => ({ ...f, alternativas: alts }));
  };

  const addSecundaria = () => {
    setForm((f) => ({ ...f, disciplinasSecundarias: [...f.disciplinasSecundarias, { disciplina: "", percentual: 10 }] }));
  };

  const removeSecundaria = (i: number) => {
    setForm((f) => ({ ...f, disciplinasSecundarias: f.disciplinasSecundarias.filter((_, idx) => idx !== i) }));
  };

  const updateSecundaria = (i: number, field: keyof AderenciaDisciplina, val: string | number) => {
    const secs = [...form.disciplinasSecundarias];
    secs[i] = { ...secs[i], [field]: val };
    setForm((f) => ({ ...f, disciplinasSecundarias: secs }));
  };

  const handleSave = async () => {
    if (!form.enunciado.trim() || !form.disciplinaPredominante) {
      toast({ title: "Campos obrigatórios", description: "Preencha o enunciado e a disciplina predominante.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await upsertQuestao(form, questao?.id, professorId);
      onSave();
      onOpenChange(false);
      toast({ title: questao ? "Questão atualizada" : "Questão criada", description: "Salva com sucesso no banco de dados." });
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{questao ? "Editar Questão" : "Nova Questão"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>Enunciado *</Label>
            <Textarea value={form.enunciado} onChange={(e) => setForm((f) => ({ ...f, enunciado: e.target.value }))} rows={4} placeholder="Digite o enunciado da questão..." />
          </div>

          <div className="space-y-2">
            <Label>Alternativas</Label>
            {form.alternativas.map((alt, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gabarito: i }))}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 border transition-colors ${
                    form.gabarito === i ? "bg-success text-success-foreground border-success" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </button>
                <Input value={alt} onChange={(e) => updateAlternativa(i, e.target.value)} placeholder={`Alternativa ${String.fromCharCode(65 + i)}`} className="flex-1" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Clique na letra para marcar o gabarito.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Justificativa</Label>
            <Textarea value={form.justificativa} onChange={(e) => setForm((f) => ({ ...f, justificativa: e.target.value }))} rows={2} placeholder="Justificativa do gabarito..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Disciplina Predominante *</Label>
              <Select value={form.disciplinaPredominante} onValueChange={(v) => setForm((f) => ({ ...f, disciplinaPredominante: v, tema: "", subtema: "" }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{DISCIPLINAS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de Questão</Label>
              <Select value={form.tipoQuestao} onValueChange={(v) => setForm((f) => ({ ...f, tipoQuestao: v as TipoQuestao }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Múltipla Escolha">Múltipla Escolha</SelectItem>
                  <SelectItem value="Verdadeiro/Falso">Verdadeiro/Falso</SelectItem>
                  <SelectItem value="Dissertativa">Dissertativa</SelectItem>
                  <SelectItem value="Caso Prático">Caso Prático</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Dificuldade</Label>
              <Select value={form.nivelDificuldade} onValueChange={(v) => setForm((f) => ({ ...f, nivelDificuldade: v as NivelDificuldade }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                  <SelectItem value="Muito Difícil">Muito Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tema</Label>
              <Select value={form.tema} onValueChange={(v) => setForm((f) => ({ ...f, tema: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o tema" /></SelectTrigger>
                <SelectContent>{temas.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subtema</Label>
              <Input value={form.subtema} onChange={(e) => setForm((f) => ({ ...f, subtema: e.target.value }))} placeholder="Ex: Princípio da Legalidade" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Disciplinas Secundárias (Aderência)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addSecundaria} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" /> Adicionar
              </Button>
            </div>
            {form.disciplinasSecundarias.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Select value={d.disciplina} onValueChange={(v) => updateSecundaria(i, "disciplina", v)}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Disciplina" /></SelectTrigger>
                  <SelectContent>{DISCIPLINAS.filter((dd) => dd !== form.disciplinaPredominante).map((dd) => <SelectItem key={dd} value={dd}>{dd}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={d.percentual} onChange={(e) => updateSecundaria(i, "percentual", Number(e.target.value))} className="w-20" min={1} max={100} />
                <span className="text-xs text-muted-foreground">%</span>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSecundaria(i)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Competências Avaliadas</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMPETENCIAS.map((c) => (
                <Badge
                  key={c}
                  variant={form.competencias.includes(c) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleCompetencia(c)}
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Interdisciplinaridade</Label>
              <Select value={form.nivelInterdisciplinaridade} onValueChange={(v) => setForm((f) => ({ ...f, nivelInterdisciplinaridade: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.statusValidacao} onValueChange={(v) => setForm((f) => ({ ...f, statusValidacao: v as StatusValidacao }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                  <SelectItem value="Validada">Validada</SelectItem>
                  <SelectItem value="Arquivada">Arquivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Perfil da Turma</Label>
              <Input value={form.perfilTurma} onChange={(e) => setForm((f) => ({ ...f, perfilTurma: e.target.value }))} placeholder="Ex: 5º Semestre" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Origem da Questão</Label>
              <Input value={form.origemQuestao} onChange={(e) => setForm((f) => ({ ...f, origemQuestao: e.target.value }))} placeholder="Ex: Autoral, ENADE, Concurso..." />
            </div>
            <div className="space-y-1.5">
              <Label>Repertório Contemporâneo</Label>
              <Input value={form.repertorioContemporaneo} onChange={(e) => setForm((f) => ({ ...f, repertorioContemporaneo: e.target.value }))} placeholder="Referências atuais..." />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : questao ? "Salvar Alterações" : "Criar Questão"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
