// ===== Mock data for Coordenação Dashboard =====

export interface TurmaDesempenho {
  turma: string;
  semestre: string;
  alunos: number;
  media: number;
  aprovacao: number;
  enade: number;
  disciplinas: { nome: string; media: number }[];
}

export interface AlunoRisco {
  id: string;
  nome: string;
  turma: string;
  media: number;
  frequencia: number;
  areasCriticas: string[];
  tendencia: "caindo" | "estavel" | "subindo";
  avaliacoesRealizadas: number;
  avaliacoesPendentes: number;
}

export interface DocenteIndicador {
  nome: string;
  disciplina: string;
  turmas: string[];
  mediaQuestoes: number;
  questoesCriadas: number;
  taxaAprovacao: number;
  aderenciaEnade: number;
}

export interface EnadeEixo {
  eixo: string;
  curso: number;
  meta: number;
  nacional: number;
  gap: number;
}

export interface IndicadorInstitucional {
  periodo: string;
  mediaGeral: number;
  taxaAprovacao: number;
  taxaEvasao: number;
  aderenciaEnade: number;
  alunosRisco: number;
}

export const turmasDesempenho: TurmaDesempenho[] = [
  {
    turma: "DIR-1A", semestre: "2026.1", alunos: 35, media: 7.5, aprovacao: 91, enade: 74,
    disciplinas: [
      { nome: "D. Constitucional", media: 7.8 },
      { nome: "Teoria do Direito", media: 7.2 },
      { nome: "D. Civil I", media: 7.5 },
    ],
  },
  {
    turma: "DIR-1B", semestre: "2026.1", alunos: 32, media: 6.8, aprovacao: 84, enade: 68,
    disciplinas: [
      { nome: "D. Constitucional", media: 6.5 },
      { nome: "Teoria do Direito", media: 7.0 },
      { nome: "D. Civil I", media: 6.9 },
    ],
  },
  {
    turma: "DIR-3A", semestre: "2026.1", alunos: 30, media: 7.2, aprovacao: 88, enade: 72,
    disciplinas: [
      { nome: "D. Penal II", media: 7.0 },
      { nome: "D. Administrativo", media: 7.5 },
      { nome: "D. Processual Civil", media: 7.1 },
    ],
  },
  {
    turma: "DIR-3B", semestre: "2026.1", alunos: 28, media: 6.1, aprovacao: 75, enade: 60,
    disciplinas: [
      { nome: "D. Penal II", media: 5.8 },
      { nome: "D. Administrativo", media: 6.2 },
      { nome: "D. Processual Civil", media: 6.3 },
    ],
  },
  {
    turma: "DIR-5A", semestre: "2026.1", alunos: 33, media: 7.8, aprovacao: 94, enade: 78,
    disciplinas: [
      { nome: "D. Trabalhista", media: 7.9 },
      { nome: "D. Tributário", media: 7.5 },
      { nome: "D. Empresarial", media: 8.0 },
    ],
  },
  {
    turma: "DIR-5B", semestre: "2026.1", alunos: 31, media: 7.0, aprovacao: 87, enade: 70,
    disciplinas: [
      { nome: "D. Trabalhista", media: 7.2 },
      { nome: "D. Tributário", media: 6.5 },
      { nome: "D. Empresarial", media: 7.3 },
    ],
  },
  {
    turma: "DIR-7A", semestre: "2026.1", alunos: 29, media: 7.6, aprovacao: 93, enade: 76,
    disciplinas: [
      { nome: "Prática Jurídica", media: 8.0 },
      { nome: "D. Internacional", media: 7.2 },
      { nome: "D. Ambiental", media: 7.6 },
    ],
  },
  {
    turma: "DIR-9A", semestre: "2026.1", alunos: 26, media: 8.1, aprovacao: 96, enade: 82,
    disciplinas: [
      { nome: "TCC", media: 8.5 },
      { nome: "Estágio Supervisionado", media: 8.0 },
      { nome: "D. Digital", media: 7.8 },
    ],
  },
];

export const alunosEmRisco: AlunoRisco[] = [
  { id: "a1", nome: "Pedro Almeida", turma: "DIR-3B", media: 4.2, frequencia: 68, areasCriticas: ["D. Administrativo", "D. Processual Civil"], tendencia: "caindo", avaliacoesRealizadas: 3, avaliacoesPendentes: 2 },
  { id: "a2", nome: "Juliana Costa", turma: "DIR-1B", media: 4.8, frequencia: 72, areasCriticas: ["D. Constitucional", "D. Humanos"], tendencia: "estavel", avaliacoesRealizadas: 4, avaliacoesPendentes: 1 },
  { id: "a3", nome: "Ricardo Lima", turma: "DIR-3B", media: 5.0, frequencia: 78, areasCriticas: ["D. Penal", "D. Processual"], tendencia: "subindo", avaliacoesRealizadas: 5, avaliacoesPendentes: 0 },
  { id: "a4", nome: "Camila Rocha", turma: "DIR-5B", media: 5.1, frequencia: 80, areasCriticas: ["D. Trabalhista"], tendencia: "estavel", avaliacoesRealizadas: 4, avaliacoesPendentes: 1 },
  { id: "a5", nome: "Fernando Dias", turma: "DIR-1B", media: 4.5, frequencia: 65, areasCriticas: ["D. Civil I", "Teoria do Direito"], tendencia: "caindo", avaliacoesRealizadas: 2, avaliacoesPendentes: 3 },
  { id: "a6", nome: "Mariana Souza", turma: "DIR-3B", media: 5.3, frequencia: 75, areasCriticas: ["D. Administrativo"], tendencia: "subindo", avaliacoesRealizadas: 5, avaliacoesPendentes: 0 },
  { id: "a7", nome: "Lucas Ferreira", turma: "DIR-5B", media: 4.9, frequencia: 70, areasCriticas: ["D. Tributário", "D. Empresarial"], tendencia: "caindo", avaliacoesRealizadas: 3, avaliacoesPendentes: 2 },
  { id: "a8", nome: "Ana Beatriz", turma: "DIR-1A", media: 5.4, frequencia: 82, areasCriticas: ["D. Constitucional"], tendencia: "subindo", avaliacoesRealizadas: 4, avaliacoesPendentes: 1 },
];

export const docentesIndicadores: DocenteIndicador[] = [
  { nome: "Prof. Maria Silva", disciplina: "D. Constitucional", turmas: ["DIR-1A", "DIR-1B"], mediaQuestoes: 7.2, questoesCriadas: 45, taxaAprovacao: 88, aderenciaEnade: 78 },
  { nome: "Prof. João Santos", disciplina: "D. Civil", turmas: ["DIR-1A", "DIR-1B"], mediaQuestoes: 6.8, questoesCriadas: 38, taxaAprovacao: 82, aderenciaEnade: 72 },
  { nome: "Prof. Ana Costa", disciplina: "D. Administrativo", turmas: ["DIR-3A", "DIR-3B"], mediaQuestoes: 7.0, questoesCriadas: 52, taxaAprovacao: 80, aderenciaEnade: 75 },
  { nome: "Prof. Carlos Lima", disciplina: "D. Penal", turmas: ["DIR-3A", "DIR-3B"], mediaQuestoes: 6.5, questoesCriadas: 30, taxaAprovacao: 78, aderenciaEnade: 68 },
  { nome: "Prof. Beatriz Nunes", disciplina: "D. Trabalhista", turmas: ["DIR-5A", "DIR-5B"], mediaQuestoes: 7.5, questoesCriadas: 41, taxaAprovacao: 90, aderenciaEnade: 80 },
  { nome: "Prof. Roberto Mendes", disciplina: "D. Tributário", turmas: ["DIR-5A", "DIR-5B"], mediaQuestoes: 6.9, questoesCriadas: 35, taxaAprovacao: 85, aderenciaEnade: 74 },
];

export const enadeEixos: EnadeEixo[] = [
  { eixo: "Formação Geral", curso: 72, meta: 80, nacional: 65, gap: -8 },
  { eixo: "Competência Específica", curso: 68, meta: 75, nacional: 60, gap: -7 },
  { eixo: "Interdisciplinaridade", curso: 58, meta: 70, nacional: 52, gap: -12 },
  { eixo: "Prática Jurídica", curso: 75, meta: 80, nacional: 62, gap: -5 },
  { eixo: "Argumentação", curso: 70, meta: 78, nacional: 58, gap: -8 },
  { eixo: "Legislação Atualizada", curso: 65, meta: 72, nacional: 55, gap: -7 },
  { eixo: "Ética Profissional", curso: 78, meta: 82, nacional: 68, gap: -4 },
  { eixo: "Resolução de Problemas", curso: 62, meta: 75, nacional: 54, gap: -13 },
];

export const historicoInstitucional: IndicadorInstitucional[] = [
  { periodo: "2023.1", mediaGeral: 6.0, taxaAprovacao: 78, taxaEvasao: 8.2, aderenciaEnade: 58, alunosRisco: 42 },
  { periodo: "2023.2", mediaGeral: 6.2, taxaAprovacao: 80, taxaEvasao: 7.5, aderenciaEnade: 62, alunosRisco: 38 },
  { periodo: "2024.1", mediaGeral: 6.5, taxaAprovacao: 82, taxaEvasao: 6.8, aderenciaEnade: 65, alunosRisco: 32 },
  { periodo: "2024.2", mediaGeral: 6.8, taxaAprovacao: 84, taxaEvasao: 6.2, aderenciaEnade: 68, alunosRisco: 28 },
  { periodo: "2025.1", mediaGeral: 7.0, taxaAprovacao: 86, taxaEvasao: 5.5, aderenciaEnade: 70, alunosRisco: 22 },
  { periodo: "2025.2", mediaGeral: 7.1, taxaAprovacao: 87, taxaEvasao: 5.1, aderenciaEnade: 72, alunosRisco: 18 },
  { periodo: "2026.1", mediaGeral: 7.3, taxaAprovacao: 88, taxaEvasao: 4.8, aderenciaEnade: 74, alunosRisco: 15 },
];

export const disciplinasConsolidadas = [
  { disciplina: "D. Constitucional", media: 7.1, questoes: 45, aderencia: 78, tendencia: +0.3 },
  { disciplina: "D. Civil", media: 7.0, questoes: 38, aderencia: 72, tendencia: +0.2 },
  { disciplina: "D. Administrativo", media: 6.8, questoes: 52, aderencia: 75, tendencia: -0.1 },
  { disciplina: "D. Penal", media: 6.4, questoes: 30, aderencia: 68, tendencia: +0.4 },
  { disciplina: "D. Trabalhista", media: 7.5, questoes: 41, aderencia: 80, tendencia: +0.1 },
  { disciplina: "D. Tributário", media: 6.9, questoes: 35, aderencia: 74, tendencia: +0.5 },
  { disciplina: "D. Processual Civil", media: 6.7, questoes: 28, aderencia: 70, tendencia: -0.2 },
  { disciplina: "D. Empresarial", media: 7.3, questoes: 22, aderencia: 76, tendencia: +0.3 },
];
