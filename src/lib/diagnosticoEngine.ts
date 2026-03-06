import { Questao } from "@/types/questao";

// Types for diagnostic engine output
export interface DesempenhoDisciplina {
  disciplina: string;
  acertos: number;
  erros: number;
  pesoTotal: number;
  percentual: number;
}

export interface DesempenhoTema {
  tema: string;
  disciplina: string;
  acertos: number;
  total: number;
  percentual: number;
}

export interface DesempenhoCompetencia {
  competencia: string;
  acertos: number;
  total: number;
  percentual: number;
}

export interface DesempenhoDificuldade {
  nivel: string;
  acertos: number;
  total: number;
  percentual: number;
}

export interface PadraoErro {
  disciplina: string;
  tema: string;
  frequencia: number;
  questoes: string[];
}

export interface DiagnosticoCompleto {
  notaBruta: number;
  taxaAcerto: number;
  totalQuestoes: number;
  acertos: number;
  erros: number;
  desempenhoPorDisciplina: DesempenhoDisciplina[];
  desempenhoPorTema: DesempenhoTema[];
  desempenhoPorCompetencia: DesempenhoCompetencia[];
  desempenhoPorDificuldade: DesempenhoDificuldade[];
  pontosFortes: string[];
  areasDeficitarias: string[];
  padroesErro: PadraoErro[];
  mapaCompetencias: Record<string, number>;
  prioridadeEstudo: string[];
}

/**
 * Motor de Diagnóstico Acadêmico
 * 
 * Redistribui erros proporcionalmente entre disciplinas com base
 * nos pesos percentuais de cada questão.
 */
export function calcularDiagnostico(
  questoes: Questao[],
  respostas: (number | null)[]
): DiagnosticoCompleto {
  const acertosTotal = respostas.filter((r, i) => r === questoes[i]?.gabarito).length;
  const errosTotal = questoes.length - acertosTotal;

  // --- Desempenho por Disciplina (redistribuição proporcional) ---
  const disciplinaMap: Record<string, { acertos: number; erros: number; pesoTotal: number }> = {};

  questoes.forEach((q, i) => {
    const acertou = respostas[i] === q.gabarito;
    
    // Disciplina predominante gets remaining percentage
    const secTotal = q.disciplinasSecundarias.reduce((s, d) => s + d.percentual, 0);
    const primPerc = (100 - secTotal) / 100;

    // Initialize
    if (!disciplinaMap[q.disciplinaPredominante]) {
      disciplinaMap[q.disciplinaPredominante] = { acertos: 0, erros: 0, pesoTotal: 0 };
    }
    disciplinaMap[q.disciplinaPredominante].pesoTotal += primPerc;
    if (acertou) disciplinaMap[q.disciplinaPredominante].acertos += primPerc;
    else disciplinaMap[q.disciplinaPredominante].erros += primPerc;

    // Secondary disciplines
    q.disciplinasSecundarias.forEach((ds) => {
      const peso = ds.percentual / 100;
      if (!disciplinaMap[ds.disciplina]) {
        disciplinaMap[ds.disciplina] = { acertos: 0, erros: 0, pesoTotal: 0 };
      }
      disciplinaMap[ds.disciplina].pesoTotal += peso;
      if (acertou) disciplinaMap[ds.disciplina].acertos += peso;
      else disciplinaMap[ds.disciplina].erros += peso;
    });
  });

  const desempenhoPorDisciplina: DesempenhoDisciplina[] = Object.entries(disciplinaMap)
    .map(([disciplina, d]) => ({
      disciplina,
      acertos: d.acertos,
      erros: d.erros,
      pesoTotal: d.pesoTotal,
      percentual: d.pesoTotal > 0 ? Math.round((d.acertos / d.pesoTotal) * 100) : 0,
    }))
    .sort((a, b) => b.pesoTotal - a.pesoTotal);

  // --- Desempenho por Tema ---
  const temaMap: Record<string, { disciplina: string; acertos: number; total: number }> = {};
  questoes.forEach((q, i) => {
    const key = `${q.disciplinaPredominante}::${q.tema}`;
    if (!temaMap[key]) temaMap[key] = { disciplina: q.disciplinaPredominante, acertos: 0, total: 0 };
    temaMap[key].total += 1;
    if (respostas[i] === q.gabarito) temaMap[key].acertos += 1;
  });

  const desempenhoPorTema: DesempenhoTema[] = Object.entries(temaMap)
    .map(([key, d]) => ({
      tema: key.split("::")[1],
      disciplina: d.disciplina,
      acertos: d.acertos,
      total: d.total,
      percentual: Math.round((d.acertos / d.total) * 100),
    }))
    .sort((a, b) => a.percentual - b.percentual);

  // --- Desempenho por Competência ---
  const compMap: Record<string, { acertos: number; total: number }> = {};
  questoes.forEach((q, i) => {
    q.competencias.forEach((c) => {
      if (!compMap[c]) compMap[c] = { acertos: 0, total: 0 };
      compMap[c].total += 1;
      if (respostas[i] === q.gabarito) compMap[c].acertos += 1;
    });
  });

  const desempenhoPorCompetencia: DesempenhoCompetencia[] = Object.entries(compMap)
    .map(([competencia, d]) => ({
      competencia,
      acertos: d.acertos,
      total: d.total,
      percentual: Math.round((d.acertos / d.total) * 100),
    }))
    .sort((a, b) => a.percentual - b.percentual);

  // --- Desempenho por Dificuldade ---
  const difMap: Record<string, { acertos: number; total: number }> = {};
  questoes.forEach((q, i) => {
    if (!difMap[q.nivelDificuldade]) difMap[q.nivelDificuldade] = { acertos: 0, total: 0 };
    difMap[q.nivelDificuldade].total += 1;
    if (respostas[i] === q.gabarito) difMap[q.nivelDificuldade].acertos += 1;
  });

  const ordem = ["Fácil", "Médio", "Difícil", "Muito Difícil"];
  const desempenhoPorDificuldade: DesempenhoDificuldade[] = Object.entries(difMap)
    .map(([nivel, d]) => ({
      nivel,
      acertos: d.acertos,
      total: d.total,
      percentual: Math.round((d.acertos / d.total) * 100),
    }))
    .sort((a, b) => ordem.indexOf(a.nivel) - ordem.indexOf(b.nivel));

  // --- Pontos fortes e fracos ---
  const pontosFortes = desempenhoPorDisciplina
    .filter((d) => d.percentual >= 70)
    .map((d) => d.disciplina);

  const areasDeficitarias = desempenhoPorDisciplina
    .filter((d) => d.percentual < 60)
    .map((d) => d.disciplina);

  // --- Padrões de erro ---
  const padroesErro: PadraoErro[] = [];
  const erroTemaMap: Record<string, { disciplina: string; tema: string; questoes: string[] }> = {};
  questoes.forEach((q, i) => {
    if (respostas[i] !== q.gabarito) {
      const key = `${q.disciplinaPredominante}::${q.tema}`;
      if (!erroTemaMap[key]) erroTemaMap[key] = { disciplina: q.disciplinaPredominante, tema: q.tema, questoes: [] };
      erroTemaMap[key].questoes.push(q.id);
    }
  });
  Object.values(erroTemaMap)
    .filter((e) => e.questoes.length >= 1)
    .sort((a, b) => b.questoes.length - a.questoes.length)
    .forEach((e) => {
      padroesErro.push({ disciplina: e.disciplina, tema: e.tema, frequencia: e.questoes.length, questoes: e.questoes });
    });

  // --- Mapa de competências ---
  const mapaCompetencias: Record<string, number> = {};
  desempenhoPorCompetencia.forEach((c) => { mapaCompetencias[c.competencia] = c.percentual; });

  // --- Prioridade de estudo ---
  const prioridadeEstudo = [
    ...areasDeficitarias,
    ...desempenhoPorTema.filter((t) => t.percentual < 50).map((t) => `${t.disciplina} — ${t.tema}`),
  ].slice(0, 6);

  return {
    notaBruta: (acertosTotal / questoes.length) * 10,
    taxaAcerto: Math.round((acertosTotal / questoes.length) * 100),
    totalQuestoes: questoes.length,
    acertos: acertosTotal,
    erros: errosTotal,
    desempenhoPorDisciplina,
    desempenhoPorTema,
    desempenhoPorCompetencia,
    desempenhoPorDificuldade,
    pontosFortes,
    areasDeficitarias,
    padroesErro,
    mapaCompetencias,
    prioridadeEstudo,
  };
}

// Mock data: simulated student responses to generate a diagnostic
export function gerarDiagnosticoMock(questoes: Questao[]): DiagnosticoCompleto {
  // Simulate answers: ~60% correct rate with pattern
  const respostas: (number | null)[] = questoes.map((q, i) => {
    // Simulate some correct, some wrong
    if (i % 3 === 0) return q.gabarito; // correct
    if (i % 5 === 0) return q.gabarito; // correct
    if (i % 4 === 1) return (q.gabarito + 1) % q.alternativas.length; // wrong
    return q.gabarito; // correct
  });

  return calcularDiagnostico(questoes, respostas);
}
