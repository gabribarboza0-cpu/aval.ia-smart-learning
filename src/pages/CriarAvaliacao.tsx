import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AvaliacaoFormSteps from "@/components/avaliacoes/AvaliacaoFormSteps";
import AvaliacaoPreview from "@/components/avaliacoes/AvaliacaoPreview";
import { Avaliacao, AvaliacaoConfig } from "@/types/avaliacao";
import { Questao } from "@/types/questao";
import { mockQuestoes } from "@/data/mockQuestoes";
import { useToast } from "@/hooks/use-toast";

function gerarAvaliacao(config: AvaliacaoConfig, banco: Questao[]): Avaliacao {
  // Filter questions matching config criteria
  let pool = [...banco];

  // Filter by discipline
  if (config.disciplinaPredominante) {
    const secondary = config.disciplinasSecundarias;
    pool = pool.filter(
      (q) =>
        q.disciplinaPredominante === config.disciplinaPredominante ||
        secondary.includes(q.disciplinaPredominante)
    );
  }

  // Filter by difficulty preference (prefer matching, but include others)
  pool.sort((a, b) => {
    const aDiff = a.nivelDificuldade === config.nivelDificuldade ? 0 : 1;
    const bDiff = b.nivelDificuldade === config.nivelDificuldade ? 0 : 1;
    return aDiff - bDiff;
  });

  // Filter by tipo
  if (config.tiposQuestao.length > 0) {
    const matching = pool.filter((q) => config.tiposQuestao.includes(q.tipoQuestao));
    if (matching.length > 0) pool = matching;
  }

  // Filter by temas if specified
  if (config.temasDesejados.length > 0) {
    const matching = pool.filter((q) => config.temasDesejados.includes(q.tema));
    if (matching.length >= config.numeroQuestoes) pool = matching;
  }

  // Filter by ENADE adherence
  if (config.aderenciaENADE) {
    const enade = pool.filter((q) => q.origemQuestao === "ENADE");
    if (enade.length > 0) pool = [...enade, ...pool.filter((q) => q.origemQuestao !== "ENADE")];
  }

  // Select questions up to the number requested
  const selected = pool.slice(0, Math.min(config.numeroQuestoes, pool.length));

  // If we don't have enough, fill from full bank
  if (selected.length < config.numeroQuestoes) {
    const remaining = banco.filter((q) => !selected.find((s) => s.id === q.id));
    const extra = remaining.slice(0, config.numeroQuestoes - selected.length);
    selected.push(...extra);
  }

  const pontoPorQuestao = 10 / Math.max(1, selected.length);

  return {
    id: `AV-${Date.now().toString(36).toUpperCase()}`,
    config,
    questoes: selected,
    status: "Configurada",
    dataCriacao: new Date().toISOString().split("T")[0],
    professorResponsavel: "Prof. Maria Silva",
    gabarito: selected.map((q) => q.gabarito),
    pontuacaoPorQuestao: selected.map(() => pontoPorQuestao),
    notaTotal: 10,
  };
}

export default function CriarAvaliacao() {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const { toast } = useToast();

  const handleGenerate = useCallback(
    (config: AvaliacaoConfig) => {
      const av = gerarAvaliacao(config, mockQuestoes);
      setAvaliacao(av);
      toast({
        title: "Avaliação gerada com sucesso!",
        description: `${av.questoes.length} questões selecionadas do banco institucional.`,
      });
    },
    [toast]
  );

  const handleBack = () => setAvaliacao(null);

  const handlePublish = () => {
    if (!avaliacao) return;
    setAvaliacao({ ...avaliacao, status: "Agendada" });
    toast({
      title: "Avaliação publicada!",
      description: `A prova foi agendada para a turma ${avaliacao.config.turma}.`,
    });
  };

  const handleRemoveQuestao = (index: number) => {
    if (!avaliacao) return;
    const newQuestoes = avaliacao.questoes.filter((_, i) => i !== index);
    const pontoPorQuestao = 10 / Math.max(1, newQuestoes.length);
    setAvaliacao({
      ...avaliacao,
      questoes: newQuestoes,
      gabarito: newQuestoes.map((q) => q.gabarito),
      pontuacaoPorQuestao: newQuestoes.map(() => pontoPorQuestao),
    });
  };

  const handleShuffle = () => {
    if (!avaliacao) return;
    const shuffled = [...avaliacao.questoes].sort(() => Math.random() - 0.5);
    const pontoPorQuestao = 10 / Math.max(1, shuffled.length);
    setAvaliacao({
      ...avaliacao,
      questoes: shuffled,
      gabarito: shuffled.map((q) => q.gabarito),
      pontuacaoPorQuestao: shuffled.map(() => pontoPorQuestao),
    });
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {!avaliacao ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                Gerador de Avaliações
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure os parâmetros e gere uma prova estruturada automaticamente
              </p>
            </div>
            <AvaliacaoFormSteps onGenerate={handleGenerate} />
          </>
        ) : (
          <AvaliacaoPreview
            avaliacao={avaliacao}
            onBack={handleBack}
            onPublish={handlePublish}
            onRemoveQuestao={handleRemoveQuestao}
            onShuffleQuestoes={handleShuffle}
          />
        )}
      </motion.div>
    </AppLayout>
  );
}
