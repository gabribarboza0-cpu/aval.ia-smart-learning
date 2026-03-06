import { Questao } from "./questao";

export type ModoProva = "Síncrona" | "Assíncrona" | "Simulado" | "Quiz" | "Diagnóstica";
export type StatusProvaAluno = "Disponível" | "Em Andamento" | "Enviada" | "Corrigida" | "Expirada";

export interface ProvaDisponivel {
  id: string;
  titulo: string;
  disciplina: string;
  professor: string;
  turma: string;
  modo: ModoProva;
  totalQuestoes: number;
  tempoMinutos: number;
  dataInicio: string;
  dataFim: string;
  tentativasPermitidas: number;
  tentativasRealizadas: number;
  status: StatusProvaAluno;
  notaObtida?: number;
  gabaritoPosProva: boolean;
  questoes: Questao[];
}

export interface RespostaAluno {
  questaoId: string;
  alternativaSelecionada: number | null;
  marcadaParaRevisao: boolean;
  tempoGasto: number; // seconds
}

export interface TentativaProva {
  provaId: string;
  respostas: RespostaAluno[];
  questaoAtual: number;
  tempoRestante: number; // seconds
  iniciada: string;
  finalizada?: string;
  nota?: number;
}
