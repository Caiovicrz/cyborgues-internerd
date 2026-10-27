/**
 * Regras e cálculos oficiais do V INTERNERD - 2026
 * Associação Atlética Acadêmica de Engenharia de Computação Cyborgues (UEMA)
 */

export interface ModalityRuleConfig {
  id: string;
  name: string;
  category: 'coletiva' | 'individual';
  minAthletes: number;
  maxAthletes: number;
  toleranceMinutes: number; // Tolerância de atraso (Art. 30 e 61)
  pointsDistribution: {
    first: number;
    second: number;
    third: number;
    fourth?: number;
  };
  genderFormat?: 'misto' | 'feminino_e_masculino';
  maxScoringAthletesPerTeam?: number; // Para individuais, máx 2 melhores resultados contam (Art. 26 §4º)
  description: string;
}

export const OFFICIAL_REGISTRATION_WINDOW = {
  start: new Date('2026-09-07T00:00:00-03:00'),
  end: new Date('2026-09-28T23:59:59-03:00'), // Inscrições até 28/09/2026
  drawDate: new Date('2026-10-05T19:00:00-03:00'), // Sorteio 05/10/2026 no Instagram
  eventStart: new Date('2026-10-31T00:00:00-03:00'), // Início 31/10/2026
  eventEnd: new Date('2026-11-06T23:59:59-03:00'), // Encerramento sexta-feira 06/11/2026
  scheduleChangeDeadline: new Date('2026-11-02T23:59:59-03:00'),
  instagramUrl: 'https://www.instagram.com/atleticacyborgues',
};

export const PIX_PAYMENT_INFO = {
  key: 'aaa.cyborgues@gmail.com',
  bank: 'Banco Santander',
  holder: 'Luys Arthur Serejo Alves',
  pricePerModality: 5.00, // R$ 5,00 por modalidade por atleta (Art. 22)
};

export const OFFICIAL_MODALITIES: ModalityRuleConfig[] = [
  // COLETIVAS (6 modalidades)
  {
    id: 'futsal',
    name: 'Futsal',
    category: 'coletiva',
    minAthletes: 5,
    maxAthletes: 12,
    toleranceMinutes: 15, // Art. 30 (15 min)
    pointsDistribution: { first: 12, second: 9, third: 6, fourth: 3 },
    genderFormat: 'misto',
    description: 'Partidas de 16 min (2x8min com 3min intervalo). Goleiro com uniforme diferenciado (Art. 62-82).',
  },
  {
    id: 'voleibol',
    name: 'Voleibol',
    category: 'coletiva',
    minAthletes: 4,
    maxAthletes: 10,
    toleranceMinutes: 10, // Art. 61 tolerância de 10 min
    pointsDistribution: { first: 12, second: 9, third: 6, fourth: 3 },
    genderFormat: 'misto',
    description: 'Fase inicial em 1 set de 15 pts; semis e final em melhor de 3 sets de 15 pts. Tolerância 10 min (Art. 44-61).',
  },
  {
    id: 'basquete-2x2',
    name: 'Basquete 2x2',
    category: 'coletiva',
    minAthletes: 2,
    maxAthletes: 4, // 2 titulares e até 2 reservas (Art. 84)
    toleranceMinutes: 15,
    pointsDistribution: { first: 8, second: 6, third: 4, fourth: 2 },
    genderFormat: 'misto',
    description: 'Meia quadra, 10 min ou até 21 pontos. Cesta de 2 valendo 1, além da linha valendo 2 (Art. 83-95).',
  },
  {
    id: 'sinuca-duplas',
    name: 'Sinuca em Duplas',
    category: 'coletiva',
    minAthletes: 2,
    maxAthletes: 2, // Por duplas (Art. 96)
    toleranceMinutes: 10, // Art. 106 tolerância de 10 min
    pointsDistribution: { first: 8, second: 6, third: 4, fourth: 2 },
    genderFormat: 'misto',
    description: 'Par ou ímpar (1 branca + 7 pares + 7 ímpares, bola 1 retirada). Tolerância 10 min (Art. 96-106).',
  },
  {
    id: 'lol',
    name: 'League of Legends (LoL)',
    category: 'coletiva',
    minAthletes: 5,
    maxAthletes: 7, // 5 a 7 atletas (Art. 156)
    toleranceMinutes: 15,
    pointsDistribution: { first: 10, second: 7, third: 5, fourth: 3 },
    genderFormat: 'misto',
    description: 'Summoner\'s Rift 5x5 Tournament Draft. 5 a 7 atletas por equipe (Art. 155-162).',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'coletiva',
    minAthletes: 5,
    maxAthletes: 7, // 5 a 7 atletas (Art. 164)
    toleranceMinutes: 15,
    pointsDistribution: { first: 10, second: 7, third: 5, fourth: 3 },
    genderFormat: 'misto',
    description: 'Partidas 5x5 em mapas oficiais competitivos. 5 a 7 atletas por equipe (Art. 163-170).',
  },

  // INDIVIDUAIS (8 modalidades)
  {
    id: 'fifa',
    name: 'FIFA',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2, // Art. 26 §4º
    genderFormat: 'misto',
    description: 'Disputas 1x1 em console/PC, duração e regras padrão da EA Sports (Art. 171-178).',
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: 'Batalhas amigáveis de torneio nível 11 padrão (Art. 179-186).',
  },
  {
    id: 'tenis-de-mesa',
    name: 'Tênis de Mesa',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'feminino_e_masculino', // Art. 9º §4º
    description: 'Disputado nos naipes feminino e masculino conforme regulamento específico (Art. 9º §4º).',
  },
  {
    id: 'xadrez',
    name: 'Xadrez',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 10, // 10 min de reflexão (Art. 110)
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: 'Tempo de reflexão de 10 min por jogador em sistema eliminatório (Art. 107-116).',
  },
  {
    id: 'fdp',
    name: 'FDP',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: 'Jogo de cartas tradicional da computação UEMA, 5 vidas iniciais por jogador (Art. 117-124).',
  },
  {
    id: 'poker',
    name: 'Poker Texas Hold\'em',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: '15 rodadas de Texas Hold\'em recreativo, classificação por mesas vencidas e fichas (Art. 140-154).',
  },
  {
    id: 'mortal-kombat-11',
    name: 'Mortal Kombat 11',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: 'Confrontos 1x1 melhor de 3 rounds em chave eliminatória (Art. 187-195).',
  },
  {
    id: 'coup',
    name: 'Coup',
    category: 'individual',
    minAthletes: 1,
    maxAthletes: 8,
    toleranceMinutes: 15,
    pointsDistribution: { first: 6, second: 4, third: 2 },
    maxScoringAthletesPerTeam: 2,
    genderFormat: 'misto',
    description: '5 mesas/rodadas de blefe e dedução. Cada jogador joga no mín. 2 mesas (Art. 125-139).',
  },
];

/**
 * Calcula taxa de inscrição por atleta (Art. 22: R$ 5,00 por modalidade)
 */
export function calculateAthleteFee(modalitiesCount: number): number {
  if (modalitiesCount < 0) return 0;
  return modalitiesCount * PIX_PAYMENT_INFO.pricePerModality;
}

/**
 * Validação dos requisitos de uma Equipe (Art. 19)
 */
export interface TeamValidationResult {
  isValid: boolean;
  athleteCount: number;
  modalityCount: number;
  errors: string[];
  warnings: string[];
}

export function validateTeamRequirements(
  athletesCount: number,
  modalitiesCount: number,
  modalityRosters?: Record<string, number>
): TeamValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Mínimo de 15 atletas (Art. 19)
  if (athletesCount < 15) {
    errors.push(`A equipe possui ${athletesCount} atleta(s). O regulamento exige no mínimo 15 atletas (Art. 19).`);
  }

  // Mínimo de 6 modalidades (Art. 19 §2º)
  if (modalitiesCount < 6) {
    errors.push(`A equipe inscreveu ${modalitiesCount} modalidade(s). O regulamento exige no mínimo 6 modalidades (Art. 19 §2º).`);
  }

  // Verificação de limites por modalidade
  if (modalityRosters) {
    for (const [modalityId, count] of Object.entries(modalityRosters)) {
      const config = OFFICIAL_MODALITIES.find((m) => m.id === modalityId);
      if (config) {
        if (count < config.minAthletes) {
          warnings.push(`${config.name}: ${count} atleta(s) inscritos (mínimo necessário: ${config.minAthletes}).`);
        } else if (count > config.maxAthletes) {
          errors.push(`${config.name}: ${count} atletas excede o limite máximo permitido de ${config.maxAthletes} (Art. 19).`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    athleteCount: athletesCount,
    modalityCount: modalitiesCount,
    errors,
    warnings,
  };
}

/**
 * Verifica se a transferência de atleta é permitida com base na data (Art. 21)
 */
export function isAthleteTransferAllowed(currentDate: Date = new Date(), isAdminException: boolean = false): boolean {
  if (isAdminException) return true;
  return currentDate <= OFFICIAL_REGISTRATION_WINDOW.end;
}

/**
 * Estrutura para cálculo e desempate da Classificação Geral (Art. 28)
 */
export interface TeamStandingData {
  teamId: string;
  teamName: string;
  totalPoints: number;
  firstPlacesCount: number; // Critério I
  secondPlacesCount: number; // Critério II
  thirdPlacesCount: number; // Critério III
  collectiveFirstPlacesCount: number; // Critério IV: mais 1ºs lugares em coletivas
  pointsInHighValueModalities: number; // Critério V: pontos em modalidades de maior valor (ex: Futsal/Vôlei/LoL/Valorant)
  needsManualResolution?: boolean; // Critério VI: persistindo empate
  tiedWithTeamIds?: string[];
}

export interface ModalPlacementItem {
  modalityId: string;
  teamId: string;
  athleteId?: string;
  placement: 1 | 2 | 3 | 4;
}

/**
 * Calcula os pontos de cada equipe e desempata segundo o Artigo 28
 * Art. 26 §4º: Nas modalidades individuais, no máximo 2 melhores resultados de uma equipe contam.
 */
export function calculateOverallStandings(
  teams: { id: string; name: string }[],
  placements: ModalPlacementItem[]
): TeamStandingData[] {
  // Mapa de modalidades para lookup rápido
  const modMap = new Map(OFFICIAL_MODALITIES.map((m) => [m.id, m]));

  // Agrupar colocações por equipe e por modalidade
  const teamStats = new Map<string, {
    teamName: string;
    totalPoints: number;
    firsts: number;
    seconds: number;
    thirds: number;
    collectiveFirsts: number;
    highValuePoints: number;
    modalityPlacements: Map<string, number[]>; // modalityId -> array de pontos obtidos
  }>();

  // Inicializar equipes
  for (const team of teams) {
    teamStats.set(team.id, {
      teamName: team.name,
      totalPoints: 0,
      firsts: 0,
      seconds: 0,
      thirds: 0,
      collectiveFirsts: 0,
      highValuePoints: 0,
      modalityPlacements: new Map(),
    });
  }

  // Processar colocações
  for (const item of placements) {
    const stat = teamStats.get(item.teamId);
    if (!stat) continue;

    const mod = modMap.get(item.modalityId);
    if (!mod) continue;

    // Determinar pontos da colocação
    let pts = 0;
    if (item.placement === 1) pts = mod.pointsDistribution.first;
    else if (item.placement === 2) pts = mod.pointsDistribution.second;
    else if (item.placement === 3) pts = mod.pointsDistribution.third;
    else if (item.placement === 4 && mod.pointsDistribution.fourth) pts = mod.pointsDistribution.fourth;

    // Estatísticas para desempate
    if (item.placement === 1) {
      stat.firsts++;
      if (mod.category === 'coletiva') {
        stat.collectiveFirsts++;
      }
    } else if (item.placement === 2) {
      stat.seconds++;
    } else if (item.placement === 3) {
      stat.thirds++;
    }

    // Modalidades de maior valor (12 e 10 pontos: Futsal, Vôlei, LoL, Valorant)
    if (mod.pointsDistribution.first >= 10) {
      stat.highValuePoints += pts;
    }

    // Guardar para aplicar o filtro de Art. 26 §4º
    if (!stat.modalityPlacements.has(item.modalityId)) {
      stat.modalityPlacements.set(item.modalityId, []);
    }
    stat.modalityPlacements.get(item.modalityId)!.push(pts);
  }

  // Calcular total de pontos respeitando o Art. 26 §4º (máximo 2 melhores individuais por equipe)
  const result: TeamStandingData[] = [];

  for (const [teamId, stat] of teamStats.entries()) {
    let finalPoints = 0;

    for (const [modId, ptsArray] of stat.modalityPlacements.entries()) {
      const mod = modMap.get(modId);
      if (mod?.category === 'individual') {
        // Ordenar decrescente e pegar até 2 melhores
        ptsArray.sort((a, b) => b - a);
        const top2 = ptsArray.slice(0, 2);
        finalPoints += top2.reduce((acc, curr) => acc + curr, 0);
      } else {
        // Coletivas somam normalmente
        finalPoints += ptsArray.reduce((acc, curr) => acc + curr, 0);
      }
    }

    stat.totalPoints = finalPoints;

    result.push({
      teamId,
      teamName: stat.teamName,
      totalPoints: finalPoints,
      firstPlacesCount: stat.firsts,
      secondPlacesCount: stat.seconds,
      thirdPlacesCount: stat.thirds,
      collectiveFirstPlacesCount: stat.collectiveFirsts,
      pointsInHighValueModalities: stat.highValuePoints,
    });
  }

  // Ordenar segundo o Artigo 28
  result.sort((a, b) => {
    // 1. Total de pontos
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // 2. Art. 28 I: Maior número de primeiros lugares
    if (b.firstPlacesCount !== a.firstPlacesCount) {
      return b.firstPlacesCount - a.firstPlacesCount;
    }
    // 3. Art. 28 II: Maior número de segundos lugares
    if (b.secondPlacesCount !== a.secondPlacesCount) {
      return b.secondPlacesCount - a.secondPlacesCount;
    }
    // 4. Art. 28 III: Maior número de terceiros lugares
    if (b.thirdPlacesCount !== a.thirdPlacesCount) {
      return b.thirdPlacesCount - a.thirdPlacesCount;
    }
    // 5. Art. 28 IV: Maior número de primeiros lugares em modalidades coletivas
    if (b.collectiveFirstPlacesCount !== a.collectiveFirstPlacesCount) {
      return b.collectiveFirstPlacesCount - a.collectiveFirstPlacesCount;
    }
    // 6. Art. 28 V: Maior pontuação em modalidades de maior valor
    if (b.pointsInHighValueModalities !== a.pointsInHighValueModalities) {
      return b.pointsInHighValueModalities - a.pointsInHighValueModalities;
    }

    // Persistindo empate -> requer decisão manual (Art. 28 VI)
    return 0;
  });

  // Marcar empates que necessitam de resolução manual
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const tiedWith: string[] = [];

    for (let j = 0; j < result.length; j++) {
      if (i === j) continue;
      const other = result[j];
      if (
        current.totalPoints === other.totalPoints &&
        current.firstPlacesCount === other.firstPlacesCount &&
        current.secondPlacesCount === other.secondPlacesCount &&
        current.thirdPlacesCount === other.thirdPlacesCount &&
        current.collectiveFirstPlacesCount === other.collectiveFirstPlacesCount &&
        current.pointsInHighValueModalities === other.pointsInHighValueModalities
      ) {
        tiedWith.push(other.teamId);
      }
    }

    if (tiedWith.length > 0) {
      current.needsManualResolution = true;
      current.tiedWithTeamIds = tiedWith;
    }
  }

  return result;
}
