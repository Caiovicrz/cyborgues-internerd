import { Team, ModalityItem, Match, FinalPlacement, DisciplinaryIncident, OfficialNotice, UserProfile } from '../types/tournament';
import { OFFICIAL_MODALITIES } from '../utils/rules';

export const INITIAL_NOTICES: OfficialNotice[] = [
  {
    id: 'not-1',
    title: 'Publicação do Regulamento Oficial do V INTERNERD 2026',
    content: 'A Diretoria Geral da A.A.A. Eng. de Computação Cyborgues torna público o cronograma do V INTERNERD. O campeonato ocorrerá de 31/10/2026 a 06/11/2026 (sexta-feira) no Campus Paulo VI – UEMA São Luís.',
    author: 'Diretoria Geral Cyborgues',
    date: '01/09/2026',
    priority: 'alta',
    pinned: true,
  },
  {
    id: 'not-2',
    title: 'Inscrições Abertas até 28/09/2026 e Dados do PIX',
    content: 'O prazo final e improrrogável de inscrições de equipes e atletas é 28/09/2026. Taxa: R$ 5,00 por modalidade por atleta (Art. 22). Pagamento centralizado pelo capitão da equipe na chave PIX: aaa.cyborgues@gmail.com (Banco Santander - Titular: Luys Arthur Serejo Alves).',
    author: 'Coordenação Administrativa',
    date: '07/09/2026',
    priority: 'urgente',
    pinned: true,
  },
  {
    id: 'not-3',
    title: 'Sorteio Oficial dos Confrontos das Coletivas pelo Instagram',
    content: 'O sorteio oficial dos confrontos de Futsal, Voleibol, Basquete 2x2, Sinuca em Duplas, LoL e Valorant será realizado no dia 05/10/2026 com transmissão ao vivo pelo Instagram oficial da atlética: https://www.instagram.com/atleticacyborgues.',
    author: 'Coordenação de Esportes',
    date: '25/09/2026',
    priority: 'normal',
    pinned: false,
  },
];

export const INITIAL_MODALITIES: ModalityItem[] = OFFICIAL_MODALITIES.map((mod) => {
  let venue = 'Ginásio Poliesportivo UEMA';
  let dates = '31/10/2026 a 06/11/2026';
  let director = 'Prof. Eduardo Melo';
  let contact = '(98) 98822-1001';
  let icon = 'Trophy';

  if (mod.id === 'futsal') {
    venue = 'Quadra Poliesportiva Principal (Campus Paulo VI)';
    dates = '31/10/2026, 02/11/2026 e 05/11/2026';
    director = 'Lucas Vinícius (Dir. Futsal)';
    contact = '(98) 98123-4501';
    icon = 'Activity';
  } else if (mod.id === 'voleibol') {
    venue = 'Ginásio Coberto UEMA';
    dates = '01/11/2026, 03/11/2026 e 05/11/2026';
    director = 'Beatriz Mendes (Dir. Vôlei)';
    contact = '(98) 98234-5602';
    icon = 'Zap';
  } else if (mod.id === 'basquete-2x2') {
    venue = 'Meia Quadra Externa de Basquete';
    dates = '02/11/2026 e 04/11/2026';
    director = 'Rafael Costa (Dir. Basquete)';
    contact = '(98) 98345-6703';
    icon = 'Flame';
  } else if (mod.id === 'sinuca-duplas') {
    venue = 'Espaço de Jogos do Centro Acadêmico';
    dates = '03/11/2026 e 06/11/2026';
    director = 'Igor Santos (Dir. Sinuca)';
    contact = '(98) 98456-7804';
    icon = 'CircleDot';
  } else if (mod.id === 'lol' || mod.id === 'valorant') {
    venue = 'Laboratório de Alto Desempenho / Cyber Arena UEMA';
    dates = '31/10/2026 a 06/11/2026';
    director = 'Gabriel Oliveira (Dir. E-Sports)';
    contact = '(98) 98567-8905';
    icon = 'Cpu';
  } else if (mod.id === 'fifa' || mod.id === 'clash-royale' || mod.id === 'mortal-kombat-11') {
    venue = 'Sala Multimídia do DEnC (Prédio de Engenharia)';
    dates = '01/11/2026 e 04/11/2026';
    director = 'André Felipe (Dir. Games)';
    contact = '(98) 98678-9016';
    icon = 'Gamepad2';
  } else if (mod.id === 'tenis-de-mesa') {
    venue = 'Hall de Esportes e Convivência UEMA';
    dates = '02/11/2026';
    director = 'Mariana Lima (Dir. Tênis de Mesa)';
    contact = '(98) 98789-0127';
    icon = 'Disc';
  } else if (mod.id === 'xadrez' || mod.id === 'poker' || mod.id === 'coup' || mod.id === 'fdp') {
    venue = 'Sala de Reuniões Acadêmicas Cyborgues';
    dates = '01/11/2026 a 06/11/2026';
    director = 'Thiago Ramos (Dir. Tabuleiro & Cartas)';
    contact = '(98) 98890-1238';
    icon = 'Crown';
  }

  return {
    id: mod.id,
    name: mod.name,
    category: mod.category,
    icon,
    minAthletes: mod.minAthletes,
    maxAthletes: mod.maxAthletes,
    toleranceMinutes: mod.toleranceMinutes,
    points: mod.pointsDistribution,
    genderFormat: mod.genderFormat || 'misto',
    responsibleDirectorId: 'dir-' + mod.id,
    responsibleDirectorName: director,
    directorContact: contact,
    venue,
    dates,
    rulesSummary: mod.description,
    bracketsGenerated: true,
  };
});

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-byteforce',
    name: 'ByteForce Cyborgues',
    tag: 'BFC',
    captainId: 'user-capitao-1',
    captainName: 'Lucas Silva',
    captainContact: '(98) 98111-2233',
    modalities: ['futsal', 'voleibol', 'basquete-2x2', 'sinuca-duplas', 'lol', 'fifa', 'xadrez', 'coup'],
    status: 'aprovada',
    totalFee: 160.0,
    totalPaid: 160.0,
    paymentStatus: 'pago',
    inviteCode: 'BYTE2026',
    createdAt: '10/09/2026',
    members: [
      {
        athleteId: 'user-capitao-1',
        athleteName: 'Lucas Silva',
        matricula: '20231502011',
        phone: '(98) 98111-2233',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'voleibol', 'fifa'],
        fee: 15.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
        isCaptain: true,
      },
      {
        athleteId: 'ath-bf-2',
        athleteName: 'Arthur Nogueira',
        matricula: '20231502012',
        phone: '(98) 98111-2234',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'basquete-2x2'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-3',
        athleteName: 'Bruno Carvalho',
        matricula: '20231502013',
        phone: '(98) 98111-2235',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'lol'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-4',
        athleteName: 'Carlos Eduardo',
        matricula: '20231502014',
        phone: '(98) 98111-2236',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'xadrez'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-5',
        athleteName: 'Diego Ferreira',
        matricula: '20231502015',
        phone: '(98) 98111-2237',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'voleibol'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-6',
        athleteName: 'Eduarda Mendes',
        matricula: '20231502016',
        phone: '(98) 98111-2238',
        turma: 'Eng. Comp 2023.1',
        modalities: ['voleibol', 'coup'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-7',
        athleteName: 'Felipe Santos',
        matricula: '20231502017',
        phone: '(98) 98111-2239',
        turma: 'Eng. Comp 2023.1',
        modalities: ['voleibol', 'lol'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-8',
        athleteName: 'Gabriel Pires',
        matricula: '20231502018',
        phone: '(98) 98111-2240',
        turma: 'Eng. Comp 2023.1',
        modalities: ['basquete-2x2', 'sinuca-duplas'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-9',
        athleteName: 'Helena Costa',
        matricula: '20231502019',
        phone: '(98) 98111-2241',
        turma: 'Eng. Comp 2023.1',
        modalities: ['sinuca-duplas', 'xadrez'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-10',
        athleteName: 'Icaro Barbosa',
        matricula: '20231502020',
        phone: '(98) 98111-2242',
        turma: 'Eng. Comp 2023.1',
        modalities: ['lol'],
        fee: 5.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-11',
        athleteName: 'Juliana Castro',
        matricula: '20231502021',
        phone: '(98) 98111-2243',
        turma: 'Eng. Comp 2023.1',
        modalities: ['lol'],
        fee: 5.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-12',
        athleteName: 'Leonardo Rocha',
        matricula: '20231502022',
        phone: '(98) 98111-2244',
        turma: 'Eng. Comp 2023.1',
        modalities: ['lol', 'coup'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-13',
        athleteName: 'Marcos Vinicius',
        matricula: '20231502023',
        phone: '(98) 98111-2245',
        turma: 'Eng. Comp 2023.1',
        modalities: ['futsal', 'fifa'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-14',
        athleteName: 'Natália Ribeiro',
        matricula: '20231502024',
        phone: '(98) 98111-2246',
        turma: 'Eng. Comp 2023.1',
        modalities: ['voleibol', 'coup'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
      {
        athleteId: 'ath-bf-15',
        athleteName: 'Otávio Martins',
        matricula: '20231502025',
        phone: '(98) 98111-2247',
        turma: 'Eng. Comp 2023.1',
        modalities: ['xadrez', 'fifa'],
        fee: 10.0,
        paymentStatus: 'pago',
        registrationStatus: 'aprovada',
      },
    ],
  },
  {
    id: 'team-kernel',
    name: 'Kernel Panic FC',
    tag: 'KPN',
    captainId: 'user-capitao-2',
    captainName: 'Matheus Alencar',
    captainContact: '(98) 98222-3344',
    modalities: ['futsal', 'voleibol', 'valorant', 'clash-royale', 'tenis-de-mesa', 'poker', 'fdp'],
    status: 'aprovada',
    totalFee: 150.0,
    totalPaid: 150.0,
    paymentStatus: 'pago',
    inviteCode: 'KERN2026',
    createdAt: '12/09/2026',
    members: Array.from({ length: 15 }).map((_, i) => ({
      athleteId: `ath-kp-${i + 1}`,
      athleteName: i === 0 ? 'Matheus Alencar' : `Atleta Kernel ${i + 1}`,
      matricula: `202415020${(10 + i).toString()}`,
      phone: `(98) 98222-33${(40 + i).toString()}`,
      turma: 'Eng. Comp 2024.1',
      modalities: ['futsal', 'valorant'],
      fee: 10.0,
      paymentStatus: 'pago',
      registrationStatus: 'aprovada',
      isCaptain: i === 0,
    })),
  },
  {
    id: 'team-robotroll',
    name: 'RoboTroll UEMA',
    tag: 'RBT',
    captainId: 'user-capitao-3',
    captainName: 'Camila Rocha',
    captainContact: '(98) 98333-4455',
    modalities: ['futsal', 'voleibol', 'basquete-2x2', 'sinuca-duplas', 'lol', 'valorant', 'fifa', 'mortal-kombat-11'],
    status: 'aprovada',
    totalFee: 170.0,
    totalPaid: 170.0,
    paymentStatus: 'pago',
    inviteCode: 'ROBO2026',
    createdAt: '14/09/2026',
    members: Array.from({ length: 16 }).map((_, i) => ({
      athleteId: `ath-rb-${i + 1}`,
      athleteName: i === 0 ? 'Camila Rocha' : `Atleta RoboTroll ${i + 1}`,
      matricula: `202215020${(10 + i).toString()}`,
      phone: `(98) 98333-44${(50 + i).toString()}`,
      turma: 'Eng. Comp 2022.1',
      modalities: ['voleibol', 'mortal-kombat-11'],
      fee: 10.0,
      paymentStatus: 'pago',
      registrationStatus: 'aprovada',
      isCaptain: i === 0,
    })),
  },
  {
    id: 'team-nullpointer',
    name: 'NullPointer Warriors',
    tag: 'NPW',
    captainId: 'user-capitao-4',
    captainName: 'Enzo Ferreira',
    captainContact: '(98) 98444-5566',
    modalities: ['futsal', 'voleibol', 'lol', 'xadrez', 'tenis-de-mesa', 'coup'],
    status: 'aprovada',
    totalFee: 150.0,
    totalPaid: 100.0,
    paymentStatus: 'parcial',
    inviteCode: 'NULL2026',
    createdAt: '16/09/2026',
    members: Array.from({ length: 15 }).map((_, i) => ({
      athleteId: `ath-np-${i + 1}`,
      athleteName: i === 0 ? 'Enzo Ferreira' : `Atleta NullPointer ${i + 1}`,
      matricula: `202515020${(10 + i).toString()}`,
      phone: `(98) 98444-55${(60 + i).toString()}`,
      turma: 'Eng. Comp 2025.1',
      modalities: ['futsal', 'xadrez'],
      fee: 10.0,
      paymentStatus: i < 10 ? 'pago' : 'pendente',
      registrationStatus: 'aprovada',
      isCaptain: i === 0,
    })),
  },
];

export const INITIAL_MATCHES: Match[] = [
  // FUTSAL
  {
    id: 'mat-fut-1',
    modalityId: 'futsal',
    modalityName: 'Futsal',
    phase: 'Fase de Grupos',
    roundName: 'Rodada 1',
    date: '31/10/2026',
    time: '09:00',
    venue: 'Quadra Poliesportiva Principal',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-kernel',
    teamBName: 'Kernel Panic FC',
    scoreA: 4,
    scoreB: 2,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'Partida de abertura do V INTERNERD.',
    sumulaDetails: 'Gols ByteForce: Lucas Silva (2), Arthur (1), Bruno (1). Gols Kernel: Matheus (2). Cartões amarelos: 1 p/ Kernel.',
  },
  {
    id: 'mat-fut-2',
    modalityId: 'futsal',
    modalityName: 'Futsal',
    phase: 'Fase de Grupos',
    roundName: 'Rodada 1',
    date: '31/10/2026',
    time: '10:00',
    venue: 'Quadra Poliesportiva Principal',
    teamAId: 'team-robotroll',
    teamAName: 'RoboTroll UEMA',
    teamBId: 'team-nullpointer',
    teamBName: 'NullPointer Warriors',
    scoreA: 3,
    scoreB: 1,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'RoboTroll garantiu a vitória no segundo tempo.',
    sumulaDetails: 'Partida finalizada sem cartões.',
  },
  {
    id: 'mat-fut-3',
    modalityId: 'futsal',
    modalityName: 'Futsal',
    phase: 'Final',
    roundName: 'Grande Final',
    date: '05/11/2026',
    time: '17:00',
    venue: 'Quadra Poliesportiva Principal',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    scoreA: 5,
    scoreB: 3,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'Grande final de Futsal do V INTERNERD! ByteForce campeã!',
    sumulaDetails: 'ByteForce Campeã de Futsal 2026.',
  },

  // VOLEIBOL
  {
    id: 'mat-vol-1',
    modalityId: 'voleibol',
    modalityName: 'Voleibol',
    phase: 'Final',
    roundName: 'Grande Final',
    date: '05/11/2026',
    time: '16:00',
    venue: 'Ginásio Coberto UEMA',
    teamAId: 'team-kernel',
    teamAName: 'Kernel Panic FC',
    teamBId: 'team-byteforce',
    teamBName: 'ByteForce Cyborgues',
    scoreA: 2,
    scoreB: 1,
    status: 'finalizado',
    toleranceMinutes: 10,
    notes: 'Final decidida no 3º set (15x13 para o Kernel Panic FC).',
    sumulaDetails: 'Sets: 15x12, 11x15, 15x13. Árbitro: Beatriz Mendes.',
  },

  // LEAGUE OF LEGENDS
  {
    id: 'mat-lol-1',
    modalityId: 'lol',
    modalityName: 'League of Legends (LoL)',
    phase: 'Final',
    roundName: 'Grande Final',
    date: '04/11/2026',
    time: '15:00',
    venue: 'Laboratório de Alto Desempenho / Cyber Arena UEMA',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    scoreA: 2,
    scoreB: 0,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'Série MD3 dominada pela ByteForce com picks agressivos no mid e jungle.',
    sumulaDetails: 'MVP: Leonardo Rocha (ByteForce).',
  },

  // VALORANT
  {
    id: 'mat-val-1',
    modalityId: 'valorant',
    modalityName: 'Valorant',
    phase: 'Final',
    roundName: 'Grande Final',
    date: '05/11/2026',
    time: '16:30',
    venue: 'Laboratório de Alto Desempenho / Cyber Arena UEMA',
    teamAId: 'team-kernel',
    teamAName: 'Kernel Panic FC',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    scoreA: 13,
    scoreB: 9,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'Mapa Ascent disputado ponto a ponto na segunda metade.',
  },

  // FIFA (Individual)
  {
    id: 'mat-fif-1',
    modalityId: 'fifa',
    modalityName: 'FIFA',
    phase: 'Final',
    roundName: 'Disputa do Título',
    date: '04/11/2026',
    time: '14:00',
    venue: 'Sala Multimídia do DEnC',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    athleteAName: 'Lucas Silva',
    athleteBName: 'Atleta RoboTroll 3',
    scoreA: 3,
    scoreB: 1,
    status: 'finalizado',
    toleranceMinutes: 15,
    notes: 'Lucas Silva (ByteForce) garantiu o 1º lugar no FIFA.',
  },

  // JOGOS AGENDADOS / EM ANDAMENTO (06/11/2026 - Sexta-feira)
  {
    id: 'mat-bas-1',
    modalityId: 'basquete-2x2',
    modalityName: 'Basquete 2x2',
    phase: 'Final',
    roundName: 'Grande Final',
    date: '06/11/2026',
    time: '10:00',
    venue: 'Meia Quadra Externa de Basquete',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    scoreA: null,
    scoreB: null,
    status: 'agendado',
    toleranceMinutes: 15,
    notes: 'Grande final de Basquete 2x2.',
  },
  {
    id: 'mat-sin-1',
    modalityId: 'sinuca-duplas',
    modalityName: 'Sinuca em Duplas',
    phase: 'Final',
    roundName: 'Disputa de 1º Lugar',
    date: '06/11/2026',
    time: '14:00',
    venue: 'Espaço de Jogos do Centro Acadêmico',
    teamAId: 'team-byteforce',
    teamAName: 'ByteForce Cyborgues',
    teamBId: 'team-robotroll',
    teamBName: 'RoboTroll UEMA',
    scoreA: null,
    scoreB: null,
    status: 'agendado',
    toleranceMinutes: 10,
    notes: 'Tolerância estrita de 10 minutos (Art. 106). Par ou ímpar com bola branca.',
  },
];

export const INITIAL_PLACEMENTS: FinalPlacement[] = [
  // Futsal: 1º ByteForce (12), 2º RoboTroll (9), 3º Kernel (6), 4º NullPointer (3)
  { id: 'plc-1', modalityId: 'futsal', modalityName: 'Futsal', placement: 1, teamId: 'team-byteforce', teamName: 'ByteForce Cyborgues', points: 12, recordedAt: '05/11/2026' },
  { id: 'plc-2', modalityId: 'futsal', modalityName: 'Futsal', placement: 2, teamId: 'team-robotroll', teamName: 'RoboTroll UEMA', points: 9, recordedAt: '05/11/2026' },
  { id: 'plc-3', modalityId: 'futsal', modalityName: 'Futsal', placement: 3, teamId: 'team-kernel', teamName: 'Kernel Panic FC', points: 6, recordedAt: '05/11/2026' },
  { id: 'plc-4', modalityId: 'futsal', modalityName: 'Futsal', placement: 4, teamId: 'team-nullpointer', teamName: 'NullPointer Warriors', points: 3, recordedAt: '05/11/2026' },

  // Voleibol: 1º Kernel (12), 2º ByteForce (9), 3º RoboTroll (6), 4º NullPointer (3)
  { id: 'plc-5', modalityId: 'voleibol', modalityName: 'Voleibol', placement: 1, teamId: 'team-kernel', teamName: 'Kernel Panic FC', points: 12, recordedAt: '05/11/2026' },
  { id: 'plc-6', modalityId: 'voleibol', modalityName: 'Voleibol', placement: 2, teamId: 'team-byteforce', teamName: 'ByteForce Cyborgues', points: 9, recordedAt: '05/11/2026' },
  { id: 'plc-7', modalityId: 'voleibol', modalityName: 'Voleibol', placement: 3, teamId: 'team-robotroll', teamName: 'RoboTroll UEMA', points: 6, recordedAt: '05/11/2026' },
  { id: 'plc-8', modalityId: 'voleibol', modalityName: 'Voleibol', placement: 4, teamId: 'team-nullpointer', teamName: 'NullPointer Warriors', points: 3, recordedAt: '05/11/2026' },

  // LoL: 1º ByteForce (10), 2º RoboTroll (7), 3º NullPointer (5)
  { id: 'plc-9', modalityId: 'lol', modalityName: 'League of Legends (LoL)', placement: 1, teamId: 'team-byteforce', teamName: 'ByteForce Cyborgues', points: 10, recordedAt: '04/11/2026' },
  { id: 'plc-10', modalityId: 'lol', modalityName: 'League of Legends (LoL)', placement: 2, teamId: 'team-robotroll', teamName: 'RoboTroll UEMA', points: 7, recordedAt: '04/11/2026' },
  { id: 'plc-11', modalityId: 'lol', modalityName: 'League of Legends (LoL)', placement: 3, teamId: 'team-nullpointer', teamName: 'NullPointer Warriors', points: 5, recordedAt: '04/11/2026' },

  // Valorant: 1º Kernel (10), 2º RoboTroll (7)
  { id: 'plc-12', modalityId: 'valorant', modalityName: 'Valorant', placement: 1, teamId: 'team-kernel', teamName: 'Kernel Panic FC', points: 10, recordedAt: '05/11/2026' },
  { id: 'plc-13', modalityId: 'valorant', modalityName: 'Valorant', placement: 2, teamId: 'team-robotroll', teamName: 'RoboTroll UEMA', points: 7, recordedAt: '05/11/2026' },

  // FIFA (Individual: 6, 4, 2)
  { id: 'plc-14', modalityId: 'fifa', modalityName: 'FIFA', placement: 1, teamId: 'team-byteforce', teamName: 'ByteForce Cyborgues', athleteName: 'Lucas Silva', points: 6, recordedAt: '04/11/2026' },
  { id: 'plc-15', modalityId: 'fifa', modalityName: 'FIFA', placement: 2, teamId: 'team-robotroll', teamName: 'RoboTroll UEMA', athleteName: 'Atleta RoboTroll 3', points: 4, recordedAt: '04/11/2026' },
  { id: 'plc-16', modalityId: 'fifa', modalityName: 'FIFA', placement: 3, teamId: 'team-byteforce', teamName: 'ByteForce Cyborgues', athleteName: 'Marcos Vinicius', points: 2, recordedAt: '04/11/2026' },
];

export const INITIAL_INCIDENTS: DisciplinaryIncident[] = [
  {
    id: 'inc-1',
    modalityId: 'futsal',
    modalityName: 'Futsal',
    matchId: 'mat-fut-1',
    targetType: 'atleta',
    targetId: 'ath-kp-2',
    targetName: 'Atleta Kernel 2',
    teamName: 'Kernel Panic FC',
    type: 'cartao_amarelo',
    reason: 'Entrada faltosa temerária durante disputa de bola (Art. 72).',
    penalty: 'Cartão Amarelo na súmula oficial.',
    date: '31/10/2026',
    reportedBy: 'Lucas Vinícius (Dir. Futsal)',
  },
  {
    id: 'inc-2',
    modalityId: 'voleibol',
    modalityName: 'Voleibol',
    matchId: 'mat-vol-1',
    targetType: 'equipe',
    targetId: 'team-byteforce',
    targetName: 'ByteForce Cyborgues',
    teamName: 'ByteForce Cyborgues',
    type: 'advertencia',
    reason: 'Reclamação excessiva com a arbitragem fora do capitão (Art. 56 e 57).',
    penalty: 'Advertência formal da Coordenação de Arbitragem.',
    date: '05/11/2026',
    reportedBy: 'Beatriz Mendes (Dir. Vôlei)',
  },
];

export const PRESET_USERS: UserProfile[] = [
  {
    uid: 'user-admin-uema',
    name: 'Coordenação Geral Cyborgues',
    email: 'ka.iovictor337@gmail.com',
    role: 'admin',
    matricula: '20211502999',
    phone: '(98) 98888-0001',
    turma: 'Diretoria Geral / UEMA',
    registrationStatus: 'aprovada',
    paymentStatus: 'pago',
  },
  {
    uid: 'user-capitao-1',
    name: 'Lucas Silva (Capitão ByteForce)',
    email: 'lucas.silva@aluno.uema.br',
    role: 'capitao',
    matricula: '20231502011',
    phone: '(98) 98111-2233',
    turma: 'Eng. Comp 2023.1',
    teamId: 'team-byteforce',
    teamName: 'ByteForce Cyborgues',
    registeredModalities: ['futsal', 'voleibol', 'fifa'],
    feeTotal: 15.0,
    registrationStatus: 'aprovada',
    paymentStatus: 'pago',
  },
  {
    uid: 'user-diretor-futsal',
    name: 'Lucas Vinícius (Diretor Futsal & Vôlei)',
    email: 'diretor.futsal@uema.br',
    role: 'diretor',
    matricula: '20221502088',
    phone: '(98) 98123-4501',
    turma: 'Coordenação de Esportes',
    assignedModalities: ['futsal', 'voleibol'],
    registrationStatus: 'aprovada',
    paymentStatus: 'pago',
  },
  {
    uid: 'user-atleta-exemplo',
    name: 'Guilherme Mendes (Atleta)',
    email: 'guilherme.mendes@aluno.uema.br',
    role: 'atleta',
    matricula: '20241502045',
    phone: '(98) 98765-4321',
    turma: 'Eng. Comp 2024.2',
    teamId: 'team-byteforce',
    teamName: 'ByteForce Cyborgues',
    registeredModalities: ['futsal', 'basquete-2x2', 'fifa'],
    feeTotal: 15.0,
    registrationStatus: 'pendente',
    paymentStatus: 'pendente',
    proofDocumentUrl: 'comprovante_matricula_guilherme_2026.pdf',
    proofFileName: 'comprovante_matricula_guilherme_2026.pdf',
  },
];
