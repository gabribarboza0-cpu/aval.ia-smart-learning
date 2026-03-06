import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AvaliacaoConfig, TipoAvaliacao, ModoAplicacao, EstiloProva, TURMAS, PERFIS_TURMA } from "@/types/avaliacao";
import { DISCIPLINAS, TEMAS_POR_DISCIPLINA, NivelDificuldade, TipoQuestao } from "@/types/questao";

const TIPOS_AVALIACAO: TipoAvaliacao[] = ["AV1", "AV2", "AV3", "Simulado", "Quiz", "Diagnóstica", "Recuperação"];
const MODOS_APLICACAO: ModoAplicacao[] = ["Presencial", "Digital", "Híbrido"];
const ESTILOS_PROVA: EstiloProva[] = ["Tradicional", "Interdisciplinar", "Caso Prático", "Mista"];
const NIVEIS_DIFICULDADE: NivelDificuldade[] = ["Fácil", "Médio", "Difícil", "Muito Difícil"];
const TIPOS_QUESTAO: TipoQuestao[] = ["Múltipla Escolha", "Verdadeiro/Falso", "Dissertativa", "Caso Prático"];

const defaultConfig: AvaliacaoConfig = {
  tipoAvaliacao: "AV1",
  titulo: "",
  descricao: "",
  numeroQuestoes: 10,
  tiposQuestao: ["Múltipla Escolha"],
  disciplinaPredominante: "",
  disciplinasSecundarias: [],
  grauInterdisciplinaridade: "Baixo",
  nivelDificuldade: "Médio",
  perfilTurma: "",
  temasDesejados: [],
  estiloProva: "Tradicional",
  aderenciaENADE: false,
  repertorioContemporaneo: false,
  dataAplicacao: "",
  tempoProva: 120,
  modoAplicacao: "Digital",
  turma: "",
};

interface Props {
  onGenerate: (config: AvaliacaoConfig) => void;
}

const STEP_TITLES = [
  "Informações Básicas",
  "Conteúdo e Disciplinas",
  "Estrutura da Prova",
  "Aplicação",
];

export default function AvaliacaoFormSteps({ onGenerate }: Props) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<AvaliacaoConfig>(defaultConfig);

  const update = <K extends keyof AvaliacaoConfig>(key: K, value: AvaliacaoConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const toggleArrayItem = <K extends keyof AvaliacaoConfig>(key: K, item: string) => {
    const arr = config[key] as string[];
    update(key, (arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]) as AvaliacaoConfig[K]);
  };

  const temasDisponiveis = config.disciplinaPredominante
    ? TEMAS_POR_DISCIPLINA[config.disciplinaPredominante] || []
    : [];

  const canNext = () => {
    switch (step) {
      case 0: return config.titulo.trim().length > 0 && config.tipoAvaliacao;
      case 1: return config.disciplinaPredominante.length > 0;
      case 2: return config.numeroQuestoes > 0 && config.tiposQuestao.length > 0;
      case 3: return config.turma.length > 0 && config.tempoProva > 0;
      default: return true;
    }
  };

  const handleSubmit = () => {
    if (canNext()) onGenerate(config);
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEP_TITLES.map((title, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                  ? "bg-primary/10 text-primary cursor-pointer"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{title}</span>
            </button>
            {i < STEP_TITLES.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-card rounded-lg border border-border p-6 shadow-card space-y-5"
        >
          <h2 className="text-lg font-semibold text-foreground">{STEP_TITLES[step]}</h2>

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Avaliação *</Label>
                  <Select value={config.tipoAvaliacao} onValueChange={(v) => update("tipoAvaliacao", v as TipoAvaliacao)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_AVALIACAO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estilo da Prova</Label>
                  <Select value={config.estiloProva} onValueChange={(v) => update("estiloProva", v as EstiloProva)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ESTILOS_PROVA.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Título da Avaliação *</Label>
                <Input
                  value={config.titulo}
                  onChange={(e) => update("titulo", e.target.value)}
                  placeholder="Ex: AV1 - Direito Constitucional - 5º Semestre"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição / Instruções</Label>
                <Textarea
                  value={config.descricao}
                  onChange={(e) => update("descricao", e.target.value)}
                  placeholder="Instruções para os alunos..."
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Disciplina Predominante *</Label>
                <Select value={config.disciplinaPredominante} onValueChange={(v) => { update("disciplinaPredominante", v); update("temasDesejados", []); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
                  <SelectContent>
                    {DISCIPLINAS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Disciplinas Secundárias</Label>
                <div className="flex flex-wrap gap-2">
                  {DISCIPLINAS.filter((d) => d !== config.disciplinaPredominante).map((d) => (
                    <Badge
                      key={d}
                      variant={config.disciplinasSecundarias.includes(d) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayItem("disciplinasSecundarias", d)}
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grau de Interdisciplinaridade</Label>
                <Select value={config.grauInterdisciplinaridade} onValueChange={(v) => update("grauInterdisciplinaridade", v as "Baixo" | "Médio" | "Alto")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Baixo", "Médio", "Alto"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {temasDisponiveis.length > 0 && (
                <div className="space-y-2">
                  <Label>Temas Desejados</Label>
                  <div className="flex flex-wrap gap-2">
                    {temasDisponiveis.map((t) => (
                      <Badge
                        key={t}
                        variant={config.temasDesejados.includes(t) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleArrayItem("temasDesejados", t)}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número de Questões: {config.numeroQuestoes}</Label>
                  <Slider
                    value={[config.numeroQuestoes]}
                    onValueChange={([v]) => update("numeroQuestoes", v)}
                    min={1}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Dificuldade</Label>
                  <Select value={config.nivelDificuldade} onValueChange={(v) => update("nivelDificuldade", v as NivelDificuldade)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NIVEIS_DIFICULDADE.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Questão</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TIPOS_QUESTAO.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={config.tiposQuestao.includes(t)}
                        onCheckedChange={() => toggleArrayItem("tiposQuestao", t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <Switch checked={config.aderenciaENADE} onCheckedChange={(v) => update("aderenciaENADE", v)} />
                  <Label className="text-sm cursor-pointer">Aderência ao modelo ENADE</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={config.repertorioContemporaneo} onCheckedChange={(v) => update("repertorioContemporaneo", v)} />
                  <Label className="text-sm cursor-pointer">Repertório contemporâneo</Label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Turma *</Label>
                  <Select value={config.turma} onValueChange={(v) => update("turma", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione a turma" /></SelectTrigger>
                    <SelectContent>
                      {TURMAS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Perfil da Turma</Label>
                  <Select value={config.perfilTurma} onValueChange={(v) => update("perfilTurma", v)}>
                    <SelectTrigger><SelectValue placeholder="Semestre" /></SelectTrigger>
                    <SelectContent>
                      {PERFIS_TURMA.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Aplicação</Label>
                  <Input type="date" value={config.dataAplicacao} onChange={(e) => update("dataAplicacao", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tempo de Prova: {config.tempoProva} min</Label>
                  <Slider
                    value={[config.tempoProva]}
                    onValueChange={([v]) => update("tempoProva", v)}
                    min={10}
                    max={300}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Modo de Aplicação</Label>
                <Select value={config.modoAplicacao} onValueChange={(v) => update("modoAplicacao", v as ModoAplicacao)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MODOS_APLICACAO.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
        {step < STEP_TITLES.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-1">
            Próximo <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canNext()} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Sparkles className="h-4 w-4" /> Gerar Avaliação
          </Button>
        )}
      </div>
    </div>
  );
}
