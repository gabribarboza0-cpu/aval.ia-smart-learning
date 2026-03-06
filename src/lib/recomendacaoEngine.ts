import { DiagnosticoCompleto } from "./diagnosticoEngine";

export interface TrilhaEstudo {
  id: string;
  disciplina: string;
  tema: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  progresso: number;
  totalEtapas: number;
  etapaConcluida: number;
  conteudos: ConteudoSugerido[];
  quizDisponivel: boolean;
  prioridade: "alta" | "media" | "baixa";
}

export interface ConteudoSugerido {
  id: string;
  titulo: string;
  tipo: "leitura" | "video" | "exercicio" | "jurisprudencia" | "resumo";
  duracao: string;
  concluido: boolean;
  url?: string;
}

export interface QuizReforco {
  id: string;
  titulo: string;
  disciplina: string;
  tema: string;
  totalQuestoes: number;
  tentativas: number;
  melhorNota: number | null;
  disponivel: boolean;
}

export interface RecomendacaoCompleta {
  trilhas: TrilhaEstudo[];
  quizzes: QuizReforco[];
  metasSemana: MetaSemanal[];
  resumoGeral: {
    trilhasAtivas: number;
    conteudosPendentes: number;
    quizzesDisponiveis: number;
    horasEstimadas: number;
  };
}

export interface MetaSemanal {
  id: string;
  descricao: string;
  tipo: "estudo" | "quiz" | "revisao";
  concluida: boolean;
  disciplina: string;
}

const CONTEUDO_TEMPLATES: Record<string, Omit<ConteudoSugerido, "id" | "concluido">[]> = {
  "Direito Constitucional": [
    { titulo: "Resumo: Princípios Fundamentais da CF/88", tipo: "resumo", duracao: "15 min" },
    { titulo: "Videoaula: Controle de Constitucionalidade", tipo: "video", duracao: "45 min" },
    { titulo: "Leitura: Art. 1º ao 17 da CF/88", tipo: "leitura", duracao: "30 min" },
    { titulo: "Jurisprudência: ADI 6341 — Competência na Pandemia", tipo: "jurisprudencia", duracao: "20 min" },
    { titulo: "Exercícios Práticos: Direitos Fundamentais", tipo: "exercicio", duracao: "25 min" },
  ],
  "Direito Civil": [
    { titulo: "Resumo: Responsabilidade Civil Objetiva e Subjetiva", tipo: "resumo", duracao: "20 min" },
    { titulo: "Videoaula: Teoria do Risco da Atividade", tipo: "video", duracao: "40 min" },
    { titulo: "Leitura: Art. 927 do Código Civil", tipo: "leitura", duracao: "15 min" },
    { titulo: "Jurisprudência: Responsabilidade de Plataformas Digitais", tipo: "jurisprudencia", duracao: "25 min" },
    { titulo: "Exercícios: Danos Morais e Materiais", tipo: "exercicio", duracao: "30 min" },
  ],
  "Direito Administrativo": [
    { titulo: "Resumo: Atos Administrativos e seus Atributos", tipo: "resumo", duracao: "20 min" },
    { titulo: "Videoaula: Licitações e Contratos — Lei 14.133", tipo: "video", duracao: "50 min" },
    { titulo: "Leitura: Princípios da Administração Pública", tipo: "leitura", duracao: "25 min" },
    { titulo: "Jurisprudência: Autoexecutoriedade e Limites", tipo: "jurisprudencia", duracao: "15 min" },
    { titulo: "Exercícios: Poder de Polícia", tipo: "exercicio", duracao: "20 min" },
  ],
  "Direito Penal": [
    { titulo: "Resumo: Teoria do Crime — Elementos", tipo: "resumo", duracao: "25 min" },
    { titulo: "Videoaula: Princípio da Insignificância", tipo: "video", duracao: "35 min" },
    { titulo: "Leitura: Tipicidade Material e Formal", tipo: "leitura", duracao: "20 min" },
    { titulo: "Jurisprudência: HC 123.734/MG — STF", tipo: "jurisprudencia", duracao: "15 min" },
    { titulo: "Exercícios: Excludentes de Ilicitude", tipo: "exercicio", duracao: "30 min" },
  ],
  "Direito Tributário": [
    { titulo: "Resumo: Princípios Tributários Constitucionais", tipo: "resumo", duracao: "20 min" },
    { titulo: "Videoaula: Anterioridade e Noventena", tipo: "video", duracao: "40 min" },
    { titulo: "Leitura: Reforma Tributária — EC 132/2023", tipo: "leitura", duracao: "30 min" },
    { titulo: "Jurisprudência: IBS e CBS — Novos Tributos", tipo: "jurisprudencia", duracao: "20 min" },
    { titulo: "Exercícios: Imunidades e Isenções", tipo: "exercicio", duracao: "25 min" },
  ],
};

const DEFAULT_CONTEUDO: Omit<ConteudoSugerido, "id" | "concluido">[] = [
  { titulo: "Resumo: Conceitos Fundamentais", tipo: "resumo", duracao: "20 min" },
  { titulo: "Videoaula: Visão Geral do Tema", tipo: "video", duracao: "40 min" },
  { titulo: "Leitura: Legislação Aplicável", tipo: "leitura", duracao: "25 min" },
  { titulo: "Exercícios Práticos", tipo: "exercicio", duracao: "30 min" },
];

export function gerarRecomendacoes(diagnostico: DiagnosticoCompleto): RecomendacaoCompleta {
  const trilhas: TrilhaEstudo[] = [];
  const quizzes: QuizReforco[] = [];
  const metas: MetaSemanal[] = [];

  // Generate trails from areas with < 75% performance
  const disciplinasParaReforco = diagnostico.desempenhoPorDisciplina
    .filter((d) => d.percentual < 75)
    .sort((a, b) => a.percentual - b.percentual);

  disciplinasParaReforco.forEach((disc, idx) => {
    const temasRelacionados = diagnostico.desempenhoPorTema
      .filter((t) => t.disciplina === disc.disciplina && t.percentual < 80);

    const prioridade: TrilhaEstudo["prioridade"] =
      disc.percentual < 40 ? "alta" : disc.percentual < 60 ? "media" : "baixa";

    const nivel: TrilhaEstudo["nivel"] =
      disc.percentual < 40 ? "iniciante" : disc.percentual < 65 ? "intermediario" : "avancado";

    const templates = CONTEUDO_TEMPLATES[disc.disciplina] || DEFAULT_CONTEUDO;
    const conteudos: ConteudoSugerido[] = templates.map((t, ci) => ({
      ...t,
      id: `cont-${idx}-${ci}`,
      concluido: Math.random() > 0.7,
    }));

    // Main trail per discipline
    trilhas.push({
      id: `trilha-${idx}`,
      disciplina: disc.disciplina,
      tema: temasRelacionados[0]?.tema || "Revisão Geral",
      nivel,
      progresso: Math.round(conteudos.filter((c) => c.concluido).length / conteudos.length * 100),
      totalEtapas: conteudos.length,
      etapaConcluida: conteudos.filter((c) => c.concluido).length,
      conteudos,
      quizDisponivel: true,
      prioridade,
    });

    // Quiz per discipline
    quizzes.push({
      id: `quiz-${idx}`,
      titulo: `Quiz: ${disc.disciplina}`,
      disciplina: disc.disciplina,
      tema: temasRelacionados[0]?.tema || "Geral",
      totalQuestoes: 5 + Math.floor(Math.random() * 6),
      tentativas: Math.floor(Math.random() * 3),
      melhorNota: Math.random() > 0.5 ? Math.round(40 + Math.random() * 50) : null,
      disponivel: true,
    });

    // Weekly goal
    metas.push({
      id: `meta-${idx}`,
      descricao: `Completar trilha de ${disc.disciplina}`,
      tipo: "estudo",
      concluida: false,
      disciplina: disc.disciplina,
    });
  });

  // Add themed quizzes from error patterns
  diagnostico.padroesErro.slice(0, 4).forEach((pe, idx) => {
    if (!quizzes.find((q) => q.tema === pe.tema)) {
      quizzes.push({
        id: `quiz-pe-${idx}`,
        titulo: `Reforço: ${pe.tema}`,
        disciplina: pe.disciplina,
        tema: pe.tema,
        totalQuestoes: pe.frequencia * 3,
        tentativas: 0,
        melhorNota: null,
        disponivel: true,
      });
    }
  });

  // Add review metas
  metas.push(
    { id: "meta-quiz", descricao: "Realizar ao menos 2 quizzes de reforço", tipo: "quiz", concluida: false, disciplina: "" },
    { id: "meta-revisao", descricao: "Revisar jurisprudências recomendadas", tipo: "revisao", concluida: Math.random() > 0.6, disciplina: "" }
  );

  const conteudosPendentes = trilhas.reduce(
    (acc, t) => acc + t.conteudos.filter((c) => !c.concluido).length, 0
  );

  return {
    trilhas,
    quizzes,
    metasSemana: metas,
    resumoGeral: {
      trilhasAtivas: trilhas.length,
      conteudosPendentes,
      quizzesDisponiveis: quizzes.length,
      horasEstimadas: Math.round(conteudosPendentes * 0.4),
    },
  };
}
