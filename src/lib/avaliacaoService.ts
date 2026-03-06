import { supabase } from "@/integrations/supabase/client";
import type { Avaliacao, AvaliacaoConfig } from "@/types/avaliacao";
import type { Questao } from "@/types/questao";
import { dbToQuestao } from "./questaoService";

export async function saveAvaliacao(
  config: AvaliacaoConfig,
  questoes: Questao[],
  professorId?: string | null
): Promise<string> {
  const payload = {
    titulo: config.titulo,
    descricao: config.descricao,
    tipo_avaliacao: config.tipoAvaliacao as any,
    numero_questoes: config.numeroQuestoes,
    disciplina_predominante: config.disciplinaPredominante,
    disciplinas_secundarias: config.disciplinasSecundarias as any,
    grau_interdisciplinaridade: config.grauInterdisciplinaridade,
    nivel_dificuldade: config.nivelDificuldade as any,
    perfil_turma: config.perfilTurma,
    temas_desejados: config.temasDesejados as any,
    estilo_prova: config.estiloProva as any,
    aderencia_enade: config.aderenciaENADE,
    repertorio_contemporaneo: config.repertorioContemporaneo,
    data_aplicacao: config.dataAplicacao || null,
    tempo_prova: config.tempoProva,
    modo_aplicacao: config.modoAplicacao as any,
    turma_codigo: config.turma,
    questao_ids: questoes.map((q) => q.id) as any,
    status: "Configurada" as any,
    professor_id: professorId || null,
    gabarito: questoes.map((q) => q.gabarito) as any,
    pontuacao_por_questao: questoes.map(() => 10 / Math.max(1, questoes.length)) as any,
    nota_total: 10,
  };

  const { data, error } = await supabase
    .from("avaliacoes")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateAvaliacaoStatus(id: string, status: string) {
  const { error } = await supabase
    .from("avaliacoes")
    .update({ status: status as any })
    .eq("id", id);
  if (error) throw error;
}

export async function updateAvaliacaoQuestoes(id: string, questaoIds: string[], gabarito: number[]) {
  const pontoPorQuestao = 10 / Math.max(1, questaoIds.length);
  const { error } = await supabase
    .from("avaliacoes")
    .update({
      questao_ids: questaoIds as any,
      gabarito: gabarito as any,
      pontuacao_por_questao: questaoIds.map(() => pontoPorQuestao) as any,
      numero_questoes: questaoIds.length,
    })
    .eq("id", id);
  if (error) throw error;
}
