export type NivelDificuldade = "Fácil" | "Médio" | "Difícil" | "Muito Difícil";
export type TipoQuestao = "Múltipla Escolha" | "Verdadeiro/Falso" | "Dissertativa" | "Caso Prático";
export type StatusValidacao = "Rascunho" | "Em Revisão" | "Validada" | "Arquivada";

export interface AderenciaDisciplina {
  disciplina: string;
  percentual: number;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: string[];
  gabarito: number; // index of correct alternative
  justificativa: string;
  disciplinaPredominante: string;
  disciplinasSecundarias: AderenciaDisciplina[];
  nivelDificuldade: NivelDificuldade;
  tipoQuestao: TipoQuestao;
  competencias: string[];
  tema: string;
  subtema: string;
  repertorioContemporaneo: string;
  nivelInterdisciplinaridade: "Baixo" | "Médio" | "Alto";
  perfilTurma: string;
  origemQuestao: string;
  professorResponsavel: string;
  dataCriacao: string;
  statusValidacao: StatusValidacao;
  historicoUso: number;
  taxaAcerto: number;
  taxaErro: number;
  indiceDificuldadeObservado: number;
  poderDiscriminacao: number;
}

export const DISCIPLINAS = [
  "Direito Constitucional",
  "Direito Civil",
  "Direito Penal",
  "Direito Administrativo",
  "Direito Trabalhista",
  "Direito Processual Civil",
  "Direito Processual Penal",
  "Direitos Humanos",
  "Direito Empresarial",
  "Direito Tributário",
  "Direito Ambiental",
  "Direito Internacional",
  "Filosofia do Direito",
  "Sociologia Jurídica",
];

export const COMPETENCIAS = [
  "Argumentação Jurídica",
  "Análise Crítica",
  "Interpretação Normativa",
  "Resolução de Problemas",
  "Raciocínio Lógico",
  "Interdisciplinaridade",
  "Pensamento Sistêmico",
  "Aplicação Prática",
];

export const TEMAS_POR_DISCIPLINA: Record<string, string[]> = {
  "Direito Constitucional": ["Direitos Fundamentais", "Organização do Estado", "Controle de Constitucionalidade", "Competências Legislativas", "Poder Judiciário"],
  "Direito Civil": ["Obrigações", "Contratos", "Responsabilidade Civil", "Direitos Reais", "Família e Sucessões"],
  "Direito Penal": ["Teoria do Crime", "Penas", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Legislação Penal Especial"],
  "Direito Administrativo": ["Atos Administrativos", "Licitações", "Servidores Públicos", "Responsabilidade do Estado", "Princípio da Legalidade"],
  "Direito Trabalhista": ["Contrato de Trabalho", "Jornada", "Rescisão", "Direitos Coletivos", "Terceirização"],
  "Direito Processual Civil": ["Processo de Conhecimento", "Recursos", "Execução", "Tutela Provisória", "Procedimentos Especiais"],
  "Direito Processual Penal": ["Inquérito Policial", "Ação Penal", "Provas", "Prisão", "Recursos"],
  "Direitos Humanos": ["Tratados Internacionais", "Dignidade Humana", "Igualdade", "Liberdade", "Proteção de Minorias"],
  "Direito Empresarial": ["Sociedades", "Títulos de Crédito", "Falência", "Recuperação Judicial", "Propriedade Intelectual"],
  "Direito Tributário": ["Princípios Tributários", "Impostos", "Obrigação Tributária", "Crédito Tributário", "Processo Tributário"],
  "Direito Ambiental": ["Licenciamento", "Responsabilidade Ambiental", "Áreas Protegidas", "Recursos Hídricos", "Política Nacional"],
  "Direito Internacional": ["Direito dos Tratados", "Organizações Internacionais", "Direito Internacional Privado", "Cooperação Internacional", "Jurisdição Internacional"],
  "Filosofia do Direito": ["Jusnaturalismo", "Positivismo Jurídico", "Pós-Positivismo", "Hermenêutica", "Teoria da Justiça"],
  "Sociologia Jurídica": ["Função Social do Direito", "Acesso à Justiça", "Pluralismo Jurídico", "Movimentos Sociais", "Direito e Sociedade"],
};
