import { Team, ModalityItem, Match, FinalPlacement, DisciplinaryIncident, OfficialNotice, UserProfile } from '../types/tournament';
import { OFFICIAL_MODALITIES } from '../utils/rules';

export const INITIAL_NOTICES: OfficialNotice[] = [
  {
    id: 'not-1',
    title: 'Publicação do Regulamento Oficial do V INTERNERD 2026',
    content: 'A Diretoria Geral da A.A.A. Eng. de Computação Cyborgues torna público o cronograma oficial do V INTERNERD. O campeonato ocorrerá de 31/10/2026 a 06/11/2026 (sexta-feira) no Campus Paulo VI – UEMA São Luís.',
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
    content: 'O sorteio oficial dos confrontos de Futsal, Voleibol, Basquete 2x2, Sinuca em Duplas, LoL e Valorant será realizado no dia 05/11/2026 com transmissão ao vivo pelo Instagram oficial da atlética: https://www.instagram.com/atleticacyborgues.',
    author: 'Coordenação de Esportes',
    date: '25/09/2026',
    priority: 'normal',
    pinned: false,
  },
];

export const INITIAL_MODALITIES: ModalityItem[] = OFFICIAL_MODALITIES.map((mod) => {
  let venue = 'Campus Paulo VI – UEMA';
  let dates = '31/10/2026 a 06/11/2026';
  let director = 'A designar pela Diretoria';
  let contact = '(98) 98888-0001';
  let icon = 'Trophy';

  if (mod.id === 'futsal') {
    venue = 'Quadra Poliesportiva Principal (Campus Paulo VI)';
    dates = '31/10/2026, 02/11/2026 e 05/11/2026';
    director = 'Coordenação de Futsal';
    icon = 'Activity';
  } else if (mod.id === 'voleibol') {
    venue = 'Ginásio Coberto UEMA';
    dates = '01/11/2026, 03/11/2026 e 05/11/2026';
    director = 'Coordenação de Vôlei';
    icon = 'Zap';
  } else if (mod.id === 'basquete-2x2') {
    venue = 'Meia Quadra Externa de Basquete';
    dates = '02/11/2026 e 04/11/2026';
    director = 'Coordenação de Basquete';
    icon = 'Flame';
  } else if (mod.id === 'sinuca-duplas') {
    venue = 'Espaço de Jogos do Centro Acadêmico';
    dates = '03/11/2026 e 06/11/2026';
    director = 'Coordenação de Sinuca';
    icon = 'CircleDot';
  } else if (mod.id === 'lol' || mod.id === 'valorant') {
    venue = 'Laboratório de Alto Desempenho / Cyber Arena UEMA';
    dates = '31/10/2026 a 06/11/2026';
    director = 'Coordenação de E-Sports';
    icon = 'Cpu';
  } else if (mod.id === 'fifa' || mod.id === 'clash-royale' || mod.id === 'mortal-kombat-11') {
    venue = 'Sala Multimídia do DEnC (Prédio de Engenharia)';
    dates = '01/11/2026 e 04/11/2026';
    director = 'Coordenação de Games';
    icon = 'Gamepad2';
  } else if (mod.id === 'tenis-de-mesa') {
    venue = 'Hall de Esportes e Convivência UEMA';
    dates = '02/11/2026';
    director = 'Coordenação de Tênis de Mesa';
    icon = 'Disc';
  } else if (mod.id === 'xadrez' || mod.id === 'poker' || mod.id === 'coup' || mod.id === 'fdp') {
    venue = 'Sala de Reuniões Acadêmicas Cyborgues';
    dates = '01/11/2026 a 06/11/2026';
    director = 'Coordenação de Tabuleiro & Cartas';
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
    bracketsGenerated: false,
  };
});

// Equipes Reais: Inicia vazio para cadastro real pelos capitães e diretoria
export const INITIAL_TEAMS: Team[] = [];

// Jogos Reais: Inicia vazio para geração real de confrontos e sorteio
export const INITIAL_MATCHES: Match[] = [];

// Classificações Finais Reais: Inicia vazio para registro oficial
export const INITIAL_PLACEMENTS: FinalPlacement[] = [];

// Ocorrências Disciplinares Reais: Inicia vazio
export const INITIAL_INCIDENTS: DisciplinaryIncident[] = [];

// Usuários Oficiais Pré-Configurados: Apenas os dois Diretores Gerais Oficiais
export const PRESET_USERS: UserProfile[] = [
  {
    uid: 'user-admin-caiocruz',
    username: 'Caiocruz',
    password: '@Cyborgues2026',
    name: 'Caio Cruz',
    email: 'caiocruz@cyborgues.uema.br',
    role: 'admin',
    matricula: '20211502001',
    phone: '(98) 98888-0001',
    turma: 'Diretoria Geral Cyborgues',
    registrationStatus: 'aprovada',
    paymentStatus: 'pago',
  },
  {
    uid: 'user-admin-luisarthur',
    username: 'Luisarthur',
    password: '@Cyborgues2026',
    name: 'Luys Arthur Serejo Alves',
    email: 'aaa.cyborgues@gmail.com',
    role: 'admin',
    matricula: '20211502002',
    phone: '(98) 98888-0002',
    turma: 'Diretoria Geral Cyborgues / Titular PIX',
    registrationStatus: 'aprovada',
    paymentStatus: 'pago',
  },
];
