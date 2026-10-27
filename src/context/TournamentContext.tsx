import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Team,
  ModalityItem,
  Match,
  FinalPlacement,
  DisciplinaryIncident,
  OfficialNotice,
  UserRole,
} from '../types/tournament';
import {
  INITIAL_MODALITIES,
  INITIAL_TEAMS,
  INITIAL_MATCHES,
  INITIAL_PLACEMENTS,
  INITIAL_INCIDENTS,
  INITIAL_NOTICES,
  PRESET_USERS,
} from '../data/mockTournamentData';
import {
  calculateAthleteFee,
  calculateOverallStandings,
  TeamStandingData,
  validateTeamRequirements,
  isAthleteTransferAllowed,
} from '../utils/rules';

interface TournamentContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  loginAs: (role: UserRole | string) => void;
  loginWithCredentials: (usernameOrEmail: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  changePassword: (newPassword: string) => { success: boolean; error?: string };
  logout: () => void;
  users: UserProfile[];
  
  teams: Team[];
  modalities: ModalityItem[];
  matches: Match[];
  placements: FinalPlacement[];
  incidents: DisciplinaryIncident[];
  notices: OfficialNotice[];
  standings: TeamStandingData[];

  // Atleta
  registerAthlete: (data: Partial<UserProfile>, inviteCodeOrTeamId?: string) => { success: boolean; error?: string };
  updateAthleteProfile: (data: Partial<UserProfile>) => { success: boolean; error?: string };

  // Capitão
  createTeam: (name: string, tag: string, modalities: string[]) => { success: boolean; error?: string; teamId?: string };
  captainRegisterAthlete: (teamId: string, athleteData: {
    name: string;
    matricula: string;
    phone: string;
    turma: string;
    modalities: string[];
    proofFileName?: string;
  }) => { success: boolean; error?: string };
  approveTeamMember: (teamId: string, athleteId: string) => void;
  removeTeamMember: (teamId: string, athleteId: string) => void;

  // Diretor
  saveMatch: (match: Partial<Match>) => void;
  deleteMatch: (matchId: string) => void;
  savePlacement: (placement: Omit<FinalPlacement, 'id' | 'recordedAt'>) => void;
  removePlacement: (placementId: string) => void;
  saveIncident: (incident: Omit<DisciplinaryIncident, 'id'>) => void;

  // Diretoria Geral
  adminCreateUser: (userData: {
    name: string;
    username: string;
    password?: string;
    email: string;
    role: UserRole;
    assignedModalities?: string[];
    teamId?: string;
    teamName?: string;
    phone?: string;
    matricula?: string;
  }) => { success: boolean; error?: string };
  adminResetUserPassword: (uid: string, newPassword: string) => { success: boolean; error?: string };
  updateTeamStatus: (teamId: string, status: 'aprovada' | 'recusada' | 'pendente') => void;
  updateTeamPayment: (teamId: string, status: 'pago' | 'pendente' | 'parcial') => void;
  updateAthletePayment: (athleteId: string, status: 'pago' | 'pendente') => void;
  updateModalityConfig: (modalityId: string, updates: Partial<ModalityItem>) => void;
  assignModalityDirector: (modalityId: string, directorId: string, directorName: string, directorContact: string) => void;
  drawCollectiveMatches: (modalityId: string) => void;
  saveNotice: (notice: Omit<OfficialNotice, 'id' | 'date'> & { id?: string }) => void;
  deleteNotice: (noticeId: string) => void;
  importAllData: (payload: {
    teams?: Team[];
    modalities?: ModalityItem[];
    matches?: Match[];
    placements?: FinalPlacement[];
    notices?: OfficialNotice[];
    users?: UserProfile[];
  }) => { success: boolean; message: string };
  clearDemoData: () => void;
  resetToDefaultData: () => void;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

const STORAGE_KEY_PREFIX = 'vinternerd_prod_2026_';

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização com LocalStorage ou Fallback (Inicia deslogado/modo público por padrão)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : PRESET_USERS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [modalities, setModalities] = useState<ModalityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'modalities');
    return saved ? JSON.parse(saved) : INITIAL_MODALITIES;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [placements, setPlacements] = useState<FinalPlacement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'placements');
    return saved ? JSON.parse(saved) : INITIAL_PLACEMENTS;
  });

  const [incidents, setIncidents] = useState<DisciplinaryIncident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [notices, setNotices] = useState<OfficialNotice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Salvar no LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'modalities', JSON.stringify(modalities));
  }, [modalities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'placements', JSON.stringify(placements));
  }, [placements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notices', JSON.stringify(notices));
  }, [notices]);

  // Recalcular classificação geral sempre que equipes ou colocações mudarem
  const standings = React.useMemo(() => {
    const teamsList = teams.map((t) => ({ id: t.id, name: t.name }));
    const placementsList = placements.map((p) => ({
      modalityId: p.modalityId,
      teamId: p.teamId,
      athleteId: p.athleteId,
      placement: p.placement,
    }));
    return calculateOverallStandings(teamsList, placementsList);
  }, [teams, placements]);

  // Login rápido de teste
  const loginAs = (roleOrUid: UserRole | string) => {
    if (roleOrUid === 'visitante') {
      setCurrentUser(null);
      return;
    }
    const found = users.find((u) => u.role === roleOrUid || u.uid === roleOrUid || u.username?.toLowerCase() === roleOrUid.toLowerCase());
    if (found) {
      setCurrentUser(found);
    } else {
      const preset = PRESET_USERS.find((u) => u.role === roleOrUid || u.username?.toLowerCase() === roleOrUid.toLowerCase());
      if (preset) setCurrentUser(preset);
    }
  };

  const loginWithCredentials = async (usernameOrEmail: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const query = usernameOrEmail.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === query) ||
        (u.email && u.email.toLowerCase() === query)
    );

    if (!found) {
      return { success: false, error: 'Usuário ou e-mail não encontrado no sistema.' };
    }

    const expectedPassword = found.password || '@Cyborgues2026';
    if (password && password !== expectedPassword) {
      return { success: false, error: 'Senha incorreta. Verifique seus dados.' };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const changePassword = (newPassword: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Nenhum usuário conectado.' };
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A senha deve ter no mínimo 6 dígitos.' };
    }

    // Regra: O nome de usuário (username) é estritamente imutável
    const updatedUser: UserProfile = {
      ...currentUser,
      password: newPassword,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));
    return { success: true };
  };

  const adminCreateUser = (userData: {
    name: string;
    username: string;
    password?: string;
    email: string;
    role: UserRole;
    assignedModalities?: string[];
    teamId?: string;
    teamName?: string;
    phone?: string;
    matricula?: string;
  }): { success: boolean; error?: string } => {
    const cleanUsername = userData.username.trim().replace(/\s+/g, '');
    if (!cleanUsername) {
      return { success: false, error: 'Nome de usuário obrigatório.' };
    }

    const exists = users.find((u) => u.username?.toLowerCase() === cleanUsername.toLowerCase());
    if (exists) {
      return { success: false, error: `O usuário "${cleanUsername}" já existe.` };
    }

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      username: cleanUsername,
      password: userData.password || '@Cyborgues2026',
      name: userData.name,
      email: userData.email || `${cleanUsername.toLowerCase()}@cyborgues.uema.br`,
      role: userData.role,
      phone: userData.phone || '',
      matricula: userData.matricula || '',
      turma: userData.role === 'diretor' ? 'Coordenação de Modalidade' : 'Representante de Equipe',
      assignedModalities: userData.assignedModalities || [],
      teamId: userData.teamId,
      teamName: userData.teamName,
      registrationStatus: 'aprovada',
      paymentStatus: 'pago',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  const adminResetUserPassword = (uid: string, newPassword: string): { success: boolean; error?: string } => {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, password: newPassword } : u)));
    if (currentUser?.uid === uid) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : null));
    }
    return { success: true };
  };

  const captainRegisterAthlete = (
    teamId: string,
    athleteData: {
      name: string;
      matricula: string;
      phone: string;
      turma: string;
      modalities: string[];
      proofFileName?: string;
    }
  ): { success: boolean; error?: string } => {
    const matriculaClean = athleteData.matricula.trim();
    // Validação de duplicidade no torneio
    const existingInUsers = users.find((u) => u.matricula === matriculaClean);
    const existingInTeams = teams.some((t) => t.members.some((m) => m.matricula === matriculaClean));

    if (existingInUsers || existingInTeams) {
      return {
        success: false,
        error: `A matrícula ${matriculaClean} já está cadastrada no campeonato. Cada estudante só pode pertencer a uma equipe (Art. 13 e 24).`,
      };
    }

    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return { success: false, error: 'Equipe não encontrada.' };

    const fee = calculateAthleteFee(athleteData.modalities.length);
    const newMemberId = 'ath-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);

    const newMember = {
      athleteId: newMemberId,
      athleteName: athleteData.name.trim(),
      matricula: matriculaClean,
      phone: athleteData.phone.trim(),
      turma: athleteData.turma.trim(),
      modalities: athleteData.modalities,
      fee,
      paymentStatus: 'pendente' as const,
      registrationStatus: 'aprovada' as const,
      isCaptain: false,
    };

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = [...t.members, newMember];
          const totalFee = updatedMembers.reduce((sum, m) => sum + m.fee, 0);
          const totalPaid = updatedMembers
            .filter((m) => m.paymentStatus === 'pago')
            .reduce((sum, m) => sum + m.fee, 0);

          return {
            ...t,
            members: updatedMembers,
            totalFee,
            totalPaid,
            paymentStatus: totalPaid >= totalFee && totalFee > 0 ? 'pago' : totalPaid > 0 ? 'parcial' : 'pendente',
          };
        }
        return t;
      })
    );

    const athleteUser: UserProfile = {
      uid: newMemberId,
      username: matriculaClean,
      name: athleteData.name.trim(),
      email: `${matriculaClean}@aluno.uema.br`,
      role: 'atleta',
      matricula: matriculaClean,
      phone: athleteData.phone.trim(),
      turma: athleteData.turma.trim(),
      proofFileName: athleteData.proofFileName || 'comprovante_matricula_uema.pdf',
      proofDocumentUrl: athleteData.proofFileName || 'comprovante_matricula_uema.pdf',
      teamId: targetTeam.id,
      teamName: targetTeam.name,
      registeredModalities: athleteData.modalities,
      feeTotal: fee,
      paymentStatus: 'pendente',
      registrationStatus: 'aprovada',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, athleteUser]);
    return { success: true };
  };

  const loginWithGoogle = async () => {
    const adminEmail = 'caiocruz@cyborgues.uema.br';
    const emailPrompt = prompt('Digite o e-mail Google para autenticação:', adminEmail);
    if (!emailPrompt) return;

    const existing = users.find((u) => u.email.toLowerCase() === emailPrompt.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return;
    }

    const isAdmin = emailPrompt.toLowerCase().includes('caiocruz') || emailPrompt.toLowerCase().includes('luisarthur');
    const newUser: UserProfile = {
      uid: 'user-google-' + Date.now(),
      username: emailPrompt.split('@')[0],
      password: '@Cyborgues2026',
      name: emailPrompt.split('@')[0].toUpperCase(),
      email: emailPrompt,
      role: isAdmin ? 'admin' : 'atleta',
      registrationStatus: 'aprovada',
      paymentStatus: 'pendente',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const loginWithEmail = async (email: string, password?: string) => {
    return loginWithCredentials(email, password);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // MÓDULO A: Registro de Atleta
  const registerAthlete = (
    data: Partial<UserProfile>,
    inviteCodeOrTeamId?: string
  ): { success: boolean; error?: string } => {
    if (!data.name || !data.matricula || !data.email) {
      return { success: false, error: 'Preencha todos os campos obrigatórios (Nome, Matrícula e E-mail).' };
    }

    // Validação de duplicidade de matrícula (Art. 24)
    const matriculaClean = data.matricula.trim();
    const existingMatricula = users.find(
      (u) => u.matricula === matriculaClean && u.uid !== data.uid
    );
    if (existingMatricula) {
      return {
        success: false,
        error: `A matrícula ${matriculaClean} já está cadastrada no sistema (${existingMatricula.name} - Equipe ${existingMatricula.teamName || 'N/A'}). Cada aluno só pode pertencer a uma equipe (Art. 13 e 24).`,
      };
    }

    // Encontrar equipe por ID ou código de convite
    let targetTeam: Team | undefined;
    if (inviteCodeOrTeamId) {
      targetTeam = teams.find(
        (t) => t.id === inviteCodeOrTeamId || t.inviteCode.toUpperCase() === inviteCodeOrTeamId.trim().toUpperCase()
      );
      if (!targetTeam) {
        return { success: false, error: 'Código de equipe ou convite não encontrado.' };
      }
    }

    const uid = data.uid || currentUser?.uid || 'ath-' + Date.now();
    const modalitiesCount = data.registeredModalities?.length || 0;
    const feeTotal = calculateAthleteFee(modalitiesCount);

    const updatedProfile: UserProfile = {
      uid,
      name: data.name,
      email: data.email,
      role: data.role || 'atleta',
      matricula: matriculaClean,
      phone: data.phone || '',
      turma: data.turma || '',
      photoUrl: data.photoUrl,
      proofDocumentUrl: data.proofDocumentUrl,
      proofFileName: data.proofFileName,
      teamId: targetTeam?.id || data.teamId,
      teamName: targetTeam?.name || data.teamName,
      registeredModalities: data.registeredModalities || [],
      feeTotal,
      paymentStatus: data.paymentStatus || 'pendente',
      registrationStatus: 'pendente',
      createdAt: new Date().toISOString(),
    };

    // Atualizar lista de usuários
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.uid === uid);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedProfile };
        return copy;
      }
      return [...prev, updatedProfile];
    });

    // Se vinculou a uma equipe, adicionar ao elenco da equipe
    if (targetTeam) {
      const teamId = targetTeam.id;
      setTeams((prev) =>
        prev.map((t) => {
          if (t.id === teamId) {
            const memberIdx = t.members.findIndex((m) => m.athleteId === uid);
            const memberData = {
              athleteId: uid,
              athleteName: updatedProfile.name,
              matricula: matriculaClean,
              phone: updatedProfile.phone || '',
              turma: updatedProfile.turma || '',
              photoUrl: updatedProfile.photoUrl,
              modalities: updatedProfile.registeredModalities || [],
              fee: feeTotal,
              paymentStatus: updatedProfile.paymentStatus || 'pendente',
              registrationStatus: 'pendente' as const,
              isCaptain: false,
            };

            const updatedMembers =
              memberIdx >= 0
                ? t.members.map((m, i) => (i === memberIdx ? memberData : m))
                : [...t.members, memberData];

            const totalFee = updatedMembers.reduce((sum, m) => sum + m.fee, 0);
            const totalPaid = updatedMembers
              .filter((m) => m.paymentStatus === 'pago')
              .reduce((sum, m) => sum + m.fee, 0);

            return {
              ...t,
              members: updatedMembers,
              totalFee,
              totalPaid,
              paymentStatus: totalPaid >= totalFee && totalFee > 0 ? 'pago' : totalPaid > 0 ? 'parcial' : 'pendente',
            };
          }
          return t;
        })
      );
    }

    setCurrentUser(updatedProfile);
    return { success: true };
  };

  const updateAthleteProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return { success: false, error: 'Usuário não autenticado.' };
    return registerAthlete({ ...currentUser, ...data }, currentUser.teamId);
  };

  // MÓDULO B: Registro de Capitão e Equipe
  const createTeam = (
    name: string,
    tag: string,
    chosenModalities: string[]
  ): { success: boolean; error?: string; teamId?: string } => {
    if (!currentUser) return { success: false, error: 'Faça login para registrar uma equipe.' };

    // Cada pessoa só pode ser capitão de uma equipe (Art. 17 §2º)
    const alreadyCaptain = teams.find((t) => t.captainId === currentUser.uid);
    if (alreadyCaptain) {
      return {
        success: false,
        error: `Você já é o capitão e representante da equipe "${alreadyCaptain.name}". O regulamento proíbe representar mais de uma equipe (Art. 17 §2º).`,
      };
    }

    if (name.trim().length < 3) {
      return { success: false, error: 'O nome da equipe deve ter no mínimo 3 caracteres.' };
    }

    const teamId = 'team-' + Date.now();
    const inviteCode = (tag || name.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, '') + '26';

    const captainMember = {
      athleteId: currentUser.uid,
      athleteName: currentUser.name,
      matricula: currentUser.matricula || '2023000000',
      phone: currentUser.phone || '',
      turma: currentUser.turma || '',
      photoUrl: currentUser.photoUrl,
      modalities: currentUser.registeredModalities || chosenModalities.slice(0, 3),
      fee: calculateAthleteFee((currentUser.registeredModalities || chosenModalities.slice(0, 3)).length),
      paymentStatus: currentUser.paymentStatus || 'pendente',
      registrationStatus: 'aprovada' as const,
      isCaptain: true,
    };

    const newTeam: Team = {
      id: teamId,
      name: name.trim(),
      tag: (tag || 'CYB').toUpperCase(),
      captainId: currentUser.uid,
      captainName: currentUser.name,
      captainContact: currentUser.phone || currentUser.email,
      modalities: chosenModalities,
      members: [captainMember],
      status: 'pendente',
      totalFee: captainMember.fee,
      totalPaid: captainMember.paymentStatus === 'pago' ? captainMember.fee : 0,
      paymentStatus: 'pendente',
      inviteCode,
      createdAt: new Date().toISOString(),
    };

    setTeams((prev) => [...prev, newTeam]);

    // Atualizar perfil do capitão
    const updatedUser: UserProfile = {
      ...currentUser,
      role: 'capitao',
      teamId,
      teamName: newTeam.name,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));

    return { success: true, teamId };
  };

  const approveTeamMember = (teamId: string, athleteId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = t.members.map((m) =>
            m.athleteId === athleteId ? { ...m, registrationStatus: 'aprovada' as const } : m
          );
          return { ...t, members: updatedMembers };
        }
        return t;
      })
    );

    setUsers((prev) =>
      prev.map((u) => (u.uid === athleteId ? { ...u, registrationStatus: 'aprovada' } : u))
    );
  };

  const removeTeamMember = (teamId: string, athleteId: string) => {
    // Verificar Art. 21 (bloqueio pós 28/09/2026 salvo se admin)
    const isAdmin = currentUser?.role === 'admin';
    if (!isAthleteTransferAllowed(new Date(), isAdmin)) {
      alert(
        'Atenção: O prazo de inscrições encerrou em 28/09/2026. Conforme o Art. 21 do Regulamento, alterações e transferências só podem ser autorizadas pela Coordenação Geral.'
      );
      if (!isAdmin) return;
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = t.members.filter((m) => m.athleteId !== athleteId);
          const totalFee = updatedMembers.reduce((sum, m) => sum + m.fee, 0);
          const totalPaid = updatedMembers
            .filter((m) => m.paymentStatus === 'pago')
            .reduce((sum, m) => sum + m.fee, 0);

          return {
            ...t,
            members: updatedMembers,
            totalFee,
            totalPaid,
            paymentStatus: totalPaid >= totalFee && totalFee > 0 ? 'pago' : totalPaid > 0 ? 'parcial' : 'pendente',
          };
        }
        return t;
      })
    );

    setUsers((prev) =>
      prev.map((u) => (u.uid === athleteId ? { ...u, teamId: undefined, teamName: undefined, registrationStatus: 'pendente' } : u))
    );
  };

  // MÓDULO C: Área do Diretor de Modalidade
  const saveMatch = (matchData: Partial<Match>) => {
    const id = matchData.id || 'mat-' + Date.now();
    const fullMatch: Match = {
      id,
      modalityId: matchData.modalityId || 'futsal',
      modalityName: matchData.modalityName || 'Futsal',
      phase: matchData.phase || 'Fase de Grupos',
      roundName: matchData.roundName || 'Partida',
      date: matchData.date || '2026-10-10',
      time: matchData.time || '14:00',
      venue: matchData.venue || 'Ginásio UEMA',
      teamAId: matchData.teamAId || '',
      teamAName: matchData.teamAName || 'Equipe A',
      teamBId: matchData.teamBId || '',
      teamBName: matchData.teamBName || 'Equipe B',
      athleteAName: matchData.athleteAName,
      athleteBName: matchData.athleteBName,
      scoreA: matchData.scoreA !== undefined ? matchData.scoreA : null,
      scoreB: matchData.scoreB !== undefined ? matchData.scoreB : null,
      status: matchData.status || 'agendado',
      isWO: matchData.isWO || false,
      woWinner: matchData.woWinner,
      toleranceMinutes: matchData.toleranceMinutes || 15,
      notes: matchData.notes || '',
      sumulaDetails: matchData.sumulaDetails || '',
    };

    setMatches((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullMatch;
        return copy;
      }
      return [...prev, fullMatch];
    });
  };

  const deleteMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const savePlacement = (placement: Omit<FinalPlacement, 'id' | 'recordedAt'>) => {
    const newPlacement: FinalPlacement = {
      ...placement,
      id: 'plc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      recordedAt: new Date().toISOString(),
    };

    // Substituir ou adicionar colocação para a mesma posição na modalidade
    setPlacements((prev) => {
      // Remove se já existia essa mesma posição na modalidade para não duplicar 1º lugar na mesma modalidade coletiva
      const filtered = prev.filter(
        (p) => !(p.modalityId === placement.modalityId && p.placement === placement.placement && p.teamId === placement.teamId)
      );
      return [...filtered, newPlacement];
    });
  };

  const removePlacement = (placementId: string) => {
    setPlacements((prev) => prev.filter((p) => p.id !== placementId));
  };

  const saveIncident = (incident: Omit<DisciplinaryIncident, 'id'>) => {
    const newIncident: DisciplinaryIncident = {
      ...incident,
      id: 'inc-' + Date.now(),
    };
    setIncidents((prev) => [newIncident, ...prev]);
  };

  // MÓDULO D: Diretoria Geral
  const updateTeamStatus = (teamId: string, status: 'aprovada' | 'recusada' | 'pendente') => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, status } : t)));
  };

  const updateTeamPayment = (teamId: string, status: 'pago' | 'pendente' | 'parcial') => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const totalFee = t.totalFee;
          const totalPaid = status === 'pago' ? totalFee : status === 'pendente' ? 0 : Math.round(totalFee / 2);
          const updatedMembers = t.members.map((m) => ({
            ...m,
            paymentStatus: status === 'pago' ? ('pago' as const) : status === 'pendente' ? ('pendente' as const) : m.paymentStatus,
          }));
          return {
            ...t,
            paymentStatus: status,
            totalPaid,
            members: updatedMembers,
          };
        }
        return t;
      })
    );
  };

  const updateAthletePayment = (athleteId: string, status: 'pago' | 'pendente') => {
    setUsers((prev) => prev.map((u) => (u.uid === athleteId ? { ...u, paymentStatus: status } : u)));
    setTeams((prev) =>
      prev.map((t) => {
        const hasMember = t.members.some((m) => m.athleteId === athleteId);
        if (hasMember) {
          const updatedMembers = t.members.map((m) => (m.athleteId === athleteId ? { ...m, paymentStatus: status } : m));
          const totalPaid = updatedMembers
            .filter((m) => m.paymentStatus === 'pago')
            .reduce((sum, m) => sum + m.fee, 0);
          return {
            ...t,
            members: updatedMembers,
            totalPaid,
            paymentStatus: totalPaid >= t.totalFee && t.totalFee > 0 ? 'pago' : totalPaid > 0 ? 'parcial' : 'pendente',
          };
        }
        return t;
      })
    );
  };

  const updateModalityConfig = (modalityId: string, updates: Partial<ModalityItem>) => {
    setModalities((prev) => prev.map((m) => (m.id === modalityId ? { ...m, ...updates } : m)));
  };

  const assignModalityDirector = (
    modalityId: string,
    directorId: string,
    directorName: string,
    directorContact: string
  ) => {
    setModalities((prev) =>
      prev.map((m) =>
        m.id === modalityId
          ? {
              ...m,
              responsibleDirectorId: directorId,
              responsibleDirectorName: directorName,
              directorContact,
            }
          : m
      )
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.uid === directorId) {
          const currentMods = u.assignedModalities || [];
          return {
            ...u,
            role: 'diretor',
            assignedModalities: currentMods.includes(modalityId) ? currentMods : [...currentMods, modalityId],
          };
        }
        return u;
      })
    );
  };

  // Sorteio das Coletivas (Art. 9º §5º)
  const drawCollectiveMatches = (modalityId: string) => {
    const mod = modalities.find((m) => m.id === modalityId);
    if (!mod) return;

    // Encontrar equipes inscritas nessa modalidade
    const eligibleTeams = teams.filter((t) => t.modalities.includes(modalityId) && t.status === 'aprovada');

    if (eligibleTeams.length < 2) {
      alert('São necessárias pelo menos 2 equipes aprovadas nesta modalidade para gerar o chaveamento/sorteio.');
      return;
    }

    // Embaralhar equipes (Fisher-Yates)
    const shuffled = [...eligibleTeams].sort(() => Math.random() - 0.5);

    const generatedMatches: Match[] = [];
    const baseDate = '31/10/2026';

    if (shuffled.length <= 4) {
      // Semifinais e Final
      const semi1: Match = {
        id: `mat-${modalityId}-semi1`,
        modalityId,
        modalityName: mod.name,
        phase: 'Semifinal',
        roundName: 'Semifinal 1 (Sorteio)',
        date: baseDate,
        time: '14:00',
        venue: mod.venue,
        teamAId: shuffled[0].id,
        teamAName: shuffled[0].name,
        teamBId: shuffled[1].id,
        teamBName: shuffled[1].name,
        scoreA: null,
        scoreB: null,
        status: 'agendado',
        toleranceMinutes: mod.toleranceMinutes,
        notes: `Confronto definido por sorteio oficial em 05/10/2026 pelo Instagram @atleticacyborgues (Art. 9º §5º).`,
      };

      const semi2: Match = {
        id: `mat-${modalityId}-semi2`,
        modalityId,
        modalityName: mod.name,
        phase: 'Semifinal',
        roundName: 'Semifinal 2 (Sorteio)',
        date: baseDate,
        time: '15:30',
        venue: mod.venue,
        teamAId: shuffled[2] ? shuffled[2].id : 'tbd',
        teamAName: shuffled[2] ? shuffled[2].name : 'Aguardando',
        teamBId: shuffled[3] ? shuffled[3].id : 'tbd',
        teamBName: shuffled[3] ? shuffled[3].name : 'Aguardando',
        scoreA: null,
        scoreB: null,
        status: 'agendado',
        toleranceMinutes: mod.toleranceMinutes,
        notes: `Confronto definido por sorteio oficial em 05/10/2026 pelo Instagram @atleticacyborgues (Art. 9º §5º).`,
      };

      const finalMatch: Match = {
        id: `mat-${modalityId}-final`,
        modalityId,
        modalityName: mod.name,
        phase: 'Final',
        roundName: 'Grande Final',
        date: '06/11/2026',
        time: '17:00',
        venue: mod.venue,
        teamAId: 'winner-semi1',
        teamAName: 'Vencedor Semi 1',
        teamBId: 'winner-semi2',
        teamBName: 'Vencedor Semi 2',
        scoreA: null,
        scoreB: null,
        status: 'agendado',
        toleranceMinutes: mod.toleranceMinutes,
        notes: `Grande decisão do título.`,
      };

      generatedMatches.push(semi1, semi2, finalMatch);
    } else {
      // Todos contra todos ou quartas
      for (let i = 0; i < shuffled.length; i += 2) {
        if (shuffled[i + 1]) {
          generatedMatches.push({
            id: `mat-${modalityId}-rnd-${i}`,
            modalityId,
            modalityName: mod.name,
            phase: 'Fase de Grupos',
            roundName: `Chave Sorteada - Jogo ${Math.floor(i / 2) + 1}`,
            date: baseDate,
            time: `${14 + Math.floor(i / 2)}:00`,
            venue: mod.venue,
            teamAId: shuffled[i].id,
            teamAName: shuffled[i].name,
            teamBId: shuffled[i + 1].id,
            teamBName: shuffled[i + 1].name,
            scoreA: null,
            scoreB: null,
            status: 'agendado',
            toleranceMinutes: mod.toleranceMinutes,
            notes: `Confronto sorteado oficialmente em 05/11/2026 pelo Instagram @atleticacyborgues.`,
          });
        }
      }
    }

    setMatches((prev) => [...prev.filter((m) => m.modalityId !== modalityId), ...generatedMatches]);
    setModalities((prev) => prev.map((m) => (m.id === modalityId ? { ...m, bracketsGenerated: true } : m)));
  };

  const saveNotice = (noticeData: Omit<OfficialNotice, 'id' | 'date'> & { id?: string }) => {
    const id = noticeData.id || 'not-' + Date.now();
    const notice: OfficialNotice = {
      ...noticeData,
      id,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setNotices((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = notice;
        return copy;
      }
      return [notice, ...prev];
    });
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };

  const importAllData = (payload: {
    teams?: Team[];
    modalities?: ModalityItem[];
    matches?: Match[];
    placements?: FinalPlacement[];
    notices?: OfficialNotice[];
    users?: UserProfile[];
  }): { success: boolean; message: string } => {
    try {
      if (payload.teams && Array.isArray(payload.teams)) {
        setTeams(payload.teams);
      }
      if (payload.modalities && Array.isArray(payload.modalities)) {
        setModalities(payload.modalities);
      }
      if (payload.matches && Array.isArray(payload.matches)) {
        setMatches(payload.matches);
      }
      if (payload.placements && Array.isArray(payload.placements)) {
        setPlacements(payload.placements);
      }
      if (payload.notices && Array.isArray(payload.notices)) {
        setNotices(payload.notices);
      }
      if (payload.users && Array.isArray(payload.users)) {
        setUsers(payload.users);
      }
      return { success: true, message: 'Dados reais importados com sucesso!' };
    } catch (err: any) {
      return { success: false, message: 'Erro ao processar arquivo JSON: ' + (err?.message || err) };
    }
  };

  const clearDemoData = () => {
    setTeams([]);
    setMatches([]);
    setPlacements([]);
    setIncidents([]);
    // Mantém o usuário admin atual
    const adminUser = users.find((u) => u.role === 'admin') || PRESET_USERS[0];
    setUsers([adminUser]);
    setCurrentUser(adminUser);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(PRESET_USERS);
    setCurrentUser(PRESET_USERS[0]);
    setTeams(INITIAL_TEAMS);
    setModalities(INITIAL_MODALITIES);
    setMatches(INITIAL_MATCHES);
    setPlacements(INITIAL_PLACEMENTS);
    setIncidents(INITIAL_INCIDENTS);
    setNotices(INITIAL_NOTICES);
  };

  return (
    <TournamentContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAs,
        loginWithCredentials,
        loginWithEmail,
        loginWithGoogle,
        changePassword,
        logout,
        users,
        teams,
        modalities,
        matches,
        placements,
        incidents,
        notices,
        standings,
        registerAthlete,
        updateAthleteProfile,
        createTeam,
        captainRegisterAthlete,
        approveTeamMember,
        removeTeamMember,
        saveMatch,
        deleteMatch,
        savePlacement,
        removePlacement,
        saveIncident,
        adminCreateUser,
        adminResetUserPassword,
        updateTeamStatus,
        updateTeamPayment,
        updateAthletePayment,
        updateModalityConfig,
        assignModalityDirector,
        drawCollectiveMatches,
        saveNotice,
        deleteNotice,
        importAllData,
        clearDemoData,
        resetToDefaultData,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament deve ser usado dentro de um TournamentProvider');
  }
  return context;
};
