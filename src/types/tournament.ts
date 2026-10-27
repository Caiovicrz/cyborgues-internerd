/**
 * Definições de Tipos para o V INTERNERD - Cyborgues (UEMA)
 */

export type UserRole = 'visitante' | 'atleta' | 'capitao' | 'diretor' | 'admin';

export interface UserProfile {
  uid: string;
  username: string; // Login único e imutável
  password?: string; // Senha criptografada/armazenada
  name: string;
  email: string;
  role: UserRole;
  matricula?: string;
  phone?: string;
  turma?: string;
  photoUrl?: string;
  proofDocumentUrl?: string;
  proofFileName?: string;
  teamId?: string;
  teamName?: string;
  registeredModalities?: string[]; // IDs das modalidades
  feeTotal?: number;
  paymentStatus?: 'pendente' | 'pago';
  registrationStatus?: 'pendente' | 'aprovada' | 'recusada';
  assignedModalities?: string[]; // Para diretores de modalidade
  createdAt?: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  captainId: string;
  captainName: string;
  captainContact: string;
  modalities: string[];
  members: TeamMemberRoster[];
  status: 'pendente' | 'aprovada' | 'recusada';
  totalFee: number;
  totalPaid: number;
  paymentStatus: 'pendente' | 'parcial' | 'pago';
  inviteCode: string;
  createdAt: string;
}

export interface TeamMemberRoster {
  athleteId: string;
  athleteName: string;
  matricula: string;
  phone: string;
  turma: string;
  photoUrl?: string;
  modalities: string[];
  fee: number;
  paymentStatus: 'pendente' | 'pago';
  registrationStatus: 'pendente' | 'aprovada' | 'recusada';
  isCaptain?: boolean;
}

export interface ModalityItem {
  id: string;
  name: string;
  category: 'coletiva' | 'individual';
  icon: string;
  minAthletes: number;
  maxAthletes: number;
  toleranceMinutes: number;
  points: {
    first: number;
    second: number;
    third: number;
    fourth?: number;
  };
  genderFormat: 'misto' | 'feminino_e_masculino';
  responsibleDirectorId?: string;
  responsibleDirectorName: string;
  directorContact: string;
  venue: string;
  dates: string;
  rulesSummary: string;
  bracketsGenerated?: boolean;
}

export type MatchPhase =
  | 'Fase de Grupos'
  | 'Quartas de Final'
  | 'Semifinal'
  | 'Final'
  | 'Disputa de 3º'
  | 'Fase Preliminar'
  | 'Mesa 1'
  | 'Mesa 2'
  | 'Mesa 3'
  | 'Mesa 4'
  | 'Mesa Final';

export interface Match {
  id: string;
  modalityId: string;
  modalityName: string;
  phase: MatchPhase;
  roundName?: string;
  date: string;
  time: string;
  venue: string;
  teamAId: string;
  teamAName: string;
  teamBId: string;
  teamBName: string;
  athleteAName?: string;
  athleteBName?: string;
  scoreA: number | null;
  scoreB: number | null;
  status: 'agendado' | 'em_andamento' | 'finalizado' | 'cancelado';
  isWO?: boolean;
  woWinner?: 'A' | 'B';
  toleranceMinutes: number;
  notes?: string;
  sumulaDetails?: string;
}

export interface FinalPlacement {
  id: string;
  modalityId: string;
  modalityName: string;
  placement: 1 | 2 | 3 | 4;
  teamId: string;
  teamName: string;
  athleteId?: string;
  athleteName?: string;
  points: number;
  recordedAt: string;
}

export interface DisciplinaryIncident {
  id: string;
  modalityId: string;
  modalityName: string;
  matchId?: string;
  targetType: 'atleta' | 'equipe';
  targetId: string;
  targetName: string;
  teamName: string;
  type: 'advertencia' | 'cartao_amarelo' | 'cartao_vermelho' | 'suspensao' | 'desclassificacao';
  reason: string;
  penalty: string;
  date: string;
  reportedBy: string;
}

export interface OfficialNotice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'normal' | 'alta' | 'urgente';
  pinned?: boolean;
}
