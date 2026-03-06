import { Questao, NivelDificuldade, TipoQuestao } from "./questao";

export type TipoAvaliacao = "AV1" | "AV2" | "AV3" | "Simulado" | "Quiz" | "Diagnóstica" | "Recuperação";
export type ModoAplicacao = "Presencial" | "Digital" | "Híbrido";
export type EstiloProva = "Tradicional" | "Interdisciplinar" | "Caso Prático" | "Mista";
export type StatusAvaliacao = "Rascunho" | "Configurada" | "Agendada" | "Em Aplicação" | "Encerrada" | "Corrigida";

export interface AvaliacaoConfig {
  tipoAvaliacao: TipoAvaliacao;
  titulo: string;
  descricao: string;
  numeroQuestoes: number;
  tiposQuestao: TipoQuestao[];
  disciplinaPredominante: string;
  disciplinasSecundarias: string[];
  grauInterdisciplinaridade: "Baixo" | "Médio" | "Alto";
  nivelDificuldade: NivelDificuldade;
  perfilTurma: string;
  temasDesejados: string[];
  estiloProva: EstiloProva;
  aderenciaENADE: boolean;
  repertorioContemporaneo: boolean;
  dataAplicacao: string;
  tempoProva: number; // minutes
  modoAplicacao: ModoAplicacao;
  turma: string;
}

export interface Avaliacao {
  id: string;
  config: AvaliacaoConfig;
  questoes: Questao[];
  status: StatusAvaliacao;
  dataCriacao: string;
  professorResponsavel: string;
  gabarito: number[];
  pontuacaoPorQuestao: number[];
  notaTotal: number;
}

export const TURMAS = [
  "DIR-1A", "DIR-1B",
  "DIR-2A", "DIR-2B",
  "DIR-3A", "DIR-3B",
  "DIR-4A", "DIR-4B",
  "DIR-5A", "DIR-5B",
  "DIR-6A", "DIR-6B",
  "DIR-7A", "DIR-7B",
  "DIR-8A", "DIR-8B",
  "DIR-9A", "DIR-9B",
  "DIR-10A", "DIR-10B",
];

export const PERFIS_TURMA = [
  "1º Semestre", "2º Semestre", "3º Semestre", "4º Semestre",
  "5º Semestre", "6º Semestre", "7º Semestre", "8º Semestre",
  "9º Semestre", "10º Semestre",
];
