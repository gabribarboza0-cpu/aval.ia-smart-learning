import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AvaliacaoFormSteps from "@/components/avaliacoes/AvaliacaoFormSteps";
import AvaliacaoPreview from "@/components/avaliacoes/AvaliacaoPreview";
import { Avaliacao, AvaliacaoConfig } from "@/types/avaliacao";
import { Questao } from "@/types/questao";
import { fetchQuestoes } from "@/lib/questaoService";
import { saveAvaliacao, updateAvaliacaoStatus, updateAvaliacaoQuestoes } from "@/lib/avaliacaoService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

function gerarAvaliacao(config: AvaliacaoConfig, banco: Questao[], professorId?: string): Avaliacao {
  let pool = [...banco];

  if (config.disciplinaPredominante) {
    const secondary = config.disciplinasSecundarias;
    pool = pool.filter(
      (q) =>
        q.disciplinaPredominante === config.disciplinaPredominante ||
        secondary.includes(q.disciplinaPredominante)
    );
  }

  pool.sort((a, b) => {
    const aDiff = a.nivelDificuldade === config.nivelDificuldade ? 0 : 1;
    const bDiff = b.nivelDificuldade === config.nivelDificuldade ? 0 : 1;
    return aDiff - bDiff;
  });

  if (config.tiposQuestao.length > 0) {
    const matching = pool.filter((q) => config.tiposQuestao.includes(q.tipoQuestao));
    if (matching.length > 0) pool = matching;
  }

  if (config.temasDesejados.length > 0) {
    const matching = pool.filter((q) => config.temasDesejados.includes(q.tema));
    if (matching.length >= config.numeroQuestoes) pool = matching;
  }

  if (config.aderenciaENADE) {
    const enade = pool.filter((q) => q.origemQuestao === "ENADE");
    if (enade.length > 0) pool = [...enade, ...pool.filter((q) => q.origemQuestao !== "ENADE")];
  }

  const selected = pool.slice(0, Math.min(config.numeroQuestoes, pool.length));

  if (selected.length < config.numeroQuestoes) {
    const remaining = banco.filter((q) => !selected.find((s) => s.id === q.id));
    const extra = remaining.slice(0, config.numeroQuestoes - selected.length);
    selected.push(...extra);
  }

  const pontoPorQuestao = 10 / Math.max(1, selected.length);

  return {
    id: `temp-${Date.now()}`,
    config,
    questoes: selected,
    status: "Configurada",
    dataCriacao: new Date().toISOString().split("T")[0],
    professorResponsavel: professorId || "",
    gabarito: selected.map((q) => q.gabarito),
    pontuacaoPorQuestao: selected.map(() => pontoPorQuestao),
    notaTotal: 10,
  };
}

export default function CriarAvaliacao() {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [banco, setBanco] = useState<Questao[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestoes().then(setBanco).catch(console.error);
  }, []);

  const handleGenerate = useCallback(
    async (config: AvaliacaoConfig) => {
      if (banco.length === 0) {
        toast({ title: "Banco vazio", description: "Cadastre questões antes de gerar uma avaliação.", variant: "destructive" });
        return;
      }
      const av = gerarAvaliacao(config, banco, user?.id);
      
      try {
        const id = await saveAvaliacao(config, av.questoes, user?.id);
        setSavedId(id);
        setAvaliacao({ ...av, id });
        toast({
          title: "Avaliação gerada e salva!",
          description: `${av.questoes.length} questões selecionadas do banco institucional.`,
        });
      } catch (error: any) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        setAvaliacao(av);
      }
    },
    [banco, toast, user]
  );

  const handleBack = () => { setAvaliacao(null); setSavedId(null); };

  const handlePublish = async () => {
    if (!avaliacao) return;
    try {
      if (savedId) {
        await updateAvaliacaoStatus(savedId, "Agendada");
      }
      setAvaliacao({ ...avaliacao, status: "Agendada" });
      toast({
        title: "Avaliação publicada!",
        description: `A prova foi agendada para a turma ${avaliacao.config.turma}.`,
      });
    } catch (error: any) {
      toast({ title: "Erro ao publicar", description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveQuestao = async (index: number) => {
    if (!avaliacao) return;
    const newQuestoes = avaliacao.questoes.filter((_, i) => i !== index);
    const pontoPorQuestao = 10 / Math.max(1, newQuestoes.length);
    const updated = {
      ...avaliacao,
      questoes: newQuestoes,
      gabarito: newQuestoes.map((q) => q.gabarito),
      pontuacaoPorQuestao: newQuestoes.map(() => pontoPorQuestao),
    };
    setAvaliacao(updated);
    if (savedId) {
      await updateAvaliacaoQuestoes(savedId, newQuestoes.map((q) => q.id), newQuestoes.map((q) => q.gabarito));
    }
  };

  const handleShuffle = async () => {
    if (!avaliacao) return;
    const shuffled = [...avaliacao.questoes].sort(() => Math.random() - 0.5);
    const pontoPorQuestao = 10 / Math.max(1, shuffled.length);
    const updated = {
      ...avaliacao,
      questoes: shuffled,
      gabarito: shuffled.map((q) => q.gabarito),
      pontuacaoPorQuestao: shuffled.map(() => pontoPorQuestao),
    };
    setAvaliacao(updated);
    if (savedId) {
      await updateAvaliacaoQuestoes(savedId, shuffled.map((q) => q.id), shuffled.map((q) => q.gabarito));
    }
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
                {banco.length > 0 && <span className="ml-1">({banco.length} questões no banco)</span>}
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
