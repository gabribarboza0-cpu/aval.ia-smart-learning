import { supabase } from "@/integrations/supabase/client";
import type { Questao, AderenciaDisciplina } from "@/types/questao";

// Map DB row to Questao type used by components
export function dbToQuestao(row: any): Questao {
  return {
    id: row.id,
    enunciado: row.enunciado,
    alternativas: (row.alternativas as string[]) || [],
    gabarito: row.gabarito,
    justificativa: row.justificativa,
    disciplinaPredominante: row.disciplina_predominante,
    disciplinasSecundarias: (row.disciplinas_secundarias as AderenciaDisciplina[]) || [],
    nivelDificuldade: row.nivel_dificuldade,
    tipoQuestao: row.tipo_questao,
    competencias: (row.competencias as string[]) || [],
    tema: row.tema,
    subtema: row.subtema,
    repertorioContemporaneo: row.repertorio_contemporaneo,
    nivelInterdisciplinaridade: row.nivel_interdisciplinaridade,
    perfilTurma: row.perfil_turma,
    origemQuestao: row.origem_questao,
    professorResponsavel: row.professor_id || "",
    dataCriacao: row.created_at?.split("T")[0] || "",
    statusValidacao: row.status_validacao,
    historicoUso: row.historico_uso,
    taxaAcerto: Number(row.taxa_acerto),
    taxaErro: Number(row.taxa_erro),
    indiceDificuldadeObservado: Number(row.indice_dificuldade_observado),
    poderDiscriminacao: Number(row.poder_discriminacao),
  };
}

// Map Questao to DB insert/update payload
export function questaoToDb(q: Omit<Questao, "id" | "dataCriacao">, professorId?: string | null) {
  return {
    enunciado: q.enunciado,
    alternativas: q.alternativas as any,
    gabarito: q.gabarito,
    justificativa: q.justificativa,
    disciplina_predominante: q.disciplinaPredominante,
    disciplinas_secundarias: q.disciplinasSecundarias as any,
    nivel_dificuldade: q.nivelDificuldade as any,
    tipo_questao: q.tipoQuestao as any,
    competencias: q.competencias as any,
    tema: q.tema,
    subtema: q.subtema,
    repertorio_contemporaneo: q.repertorioContemporaneo,
    nivel_interdisciplinaridade: q.nivelInterdisciplinaridade,
    perfil_turma: q.perfilTurma,
    origem_questao: q.origemQuestao,
    professor_id: professorId || null,
    status_validacao: q.statusValidacao as any,
    historico_uso: q.historicoUso,
    taxa_acerto: q.taxaAcerto,
    taxa_erro: q.taxaErro,
    indice_dificuldade_observado: q.indiceDificuldadeObservado,
    poder_discriminacao: q.poderDiscriminacao,
  };
}

export async function fetchQuestoes(): Promise<Questao[]> {
  const { data, error } = await supabase
    .from("questoes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(dbToQuestao);
}

export async function upsertQuestao(
  questao: Omit<Questao, "id" | "dataCriacao">,
  id?: string,
  professorId?: string | null
): Promise<Questao> {
  const payload = questaoToDb(questao, professorId);
  if (id) {
    const { data, error } = await supabase
      .from("questoes")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return dbToQuestao(data);
  } else {
    const { data, error } = await supabase
      .from("questoes")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return dbToQuestao(data);
  }
}

export async function deleteQuestao(id: string) {
  const { error } = await supabase.from("questoes").delete().eq("id", id);
  if (error) throw error;
}
