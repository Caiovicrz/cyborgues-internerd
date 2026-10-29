import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Flame,
  Plus,
  Edit2,
  Trash2,
  Award,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle,
  X,
  Clock,
  Calendar,
  KeyRound,
} from 'lucide-react';
import { Match, MatchPhase, FinalPlacement, DisciplinaryIncident } from '../types/tournament';
import { downloadCSV, printMatchSumula } from '../utils/exportHelpers';
import { ChangePasswordModal } from './ChangePasswordModal';

export const DirectorModule: React.FC = () => {
  const {
    currentUser,
    modalities,
    matches,
    teams,
    placements,
    incidents,
    saveMatch,
    deleteMatch,
    savePlacement,
    removePlacement,
    saveIncident,
  } = useTournament();

  // Filtrar modalidades sob a responsabilidade deste diretor
  // Se for admin, pode gerenciar todas
  const isAdmin = currentUser?.role === 'admin';
  const myModalities = modalities.filter(
    (m) =>
      isAdmin ||
      m.responsibleDirectorId === currentUser?.uid ||
      currentUser?.assignedModalities?.includes(m.id)
  );

  const [selectedModId, setSelectedModId] = useState<string>(myModalities[0]?.id || modalities[0]?.id || 'futsal');
  const [activeTab, setActiveTab] = useState<'jogos' | 'classificacao' | 'disciplina' | 'inscritos'>('jogos');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Match Modal Form State
  const [editingMatch, setEditingMatch] = useState<Partial<Match> | null>(null);
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  // Placement Form State
  const [placementForm, setPlacementForm] = useState<{
    placement: 1 | 2 | 3 | 4;
    teamId: string;
    athleteName: string;
  }>({
    placement: 1,
    teamId: '',
    athleteName: '',
  });

  // Incident Form State
  const [incidentForm, setIncidentForm] = useState<{
    targetType: 'atleta' | 'equipe';
    targetName: string;
    teamName: string;
    type: 'advertencia' | 'cartao_amarelo' | 'cartao_vermelho' | 'suspensao' | 'desclassificacao';
    reason: string;
    penalty: string;
  }>({
    targetType: 'atleta',
    targetName: '',
    teamName: '',
    type: 'cartao_amarelo',
    reason: '',
    penalty: '',
  });

  const currentModality = modalities.find((m) => m.id === selectedModId);

  // Jogos desta modalidade
  const currentMatches = matches.filter((m) => m.modalityId === selectedModId);

  // Colocações desta modalidade
  const currentPlacements = placements
    .filter((p) => p.modalityId === selectedModId)
    .sort((a, b) => a.placement - b.placement);

  // Atletas e equipes inscritos nesta modalidade
  const enrolledTeams = teams.filter((t) => t.modalities.includes(selectedModId));

  const handleOpenNewMatch = () => {
    if (!currentModality) return;
    setEditingMatch({
      modalityId: currentModality.id,
      modalityName: currentModality.name,
      phase: 'Fase de Grupos',
      roundName: 'Rodada Oficial',
      date: '2026-10-10',
      time: '14:00',
      venue: currentModality.venue,
      teamAId: enrolledTeams[0]?.id || '',
      teamAName: enrolledTeams[0]?.name || 'Equipe A',
      teamBId: enrolledTeams[1]?.id || '',
      teamBName: enrolledTeams[1]?.name || 'Equipe B',
      athleteAName: '',
      athleteBName: '',
      scoreA: 0,
      scoreB: 0,
      status: 'agendado',
      isWO: false,
      woWinner: 'A',
      toleranceMinutes: currentModality.toleranceMinutes,
      notes: '',
      sumulaDetails: '',
    });
    setMatchModalOpen(true);
  };

  const handleSaveMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    saveMatch(editingMatch);
    setMatchModalOpen(false);
  };

  const handleSavePlacementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentModality || !placementForm.teamId) return;

    const team = teams.find((t) => t.id === placementForm.teamId);
    if (!team) return;

    // Determinar pontos baseado no regulamento Art. 26
    let points = 0;
    if (placementForm.placement === 1) points = currentModality.points.first;
    else if (placementForm.placement === 2) points = currentModality.points.second;
    else if (placementForm.placement === 3) points = currentModality.points.third;
    else if (placementForm.placement === 4 && currentModality.points.fourth) {
      points = currentModality.points.fourth;
    }

    savePlacement({
      modalityId: currentModality.id,
      modalityName: currentModality.name,
      placement: placementForm.placement,
      teamId: team.id,
      teamName: team.name,
      athleteName: placementForm.athleteName || undefined,
      points,
    });

    setPlacementForm({ placement: 1, teamId: '', athleteName: '' });
  };

  const handleSaveIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentModality || !incidentForm.targetName) return;

    saveIncident({
      modalityId: currentModality.id,
      modalityName: currentModality.name,
      targetType: incidentForm.targetType,
      targetId: 'tgt-' + Date.now(),
      targetName: incidentForm.targetName,
      teamName: incidentForm.teamName || 'Equipe participante',
      type: incidentForm.type,
      reason: incidentForm.reason,
      penalty: incidentForm.penalty || 'Registrado na súmula',
      date: new Date().toISOString().split('T')[0],
      reportedBy: `${currentUser?.name} (${currentModality.name})`,
    });

    setIncidentForm({
      targetType: 'atleta',
      targetName: '',
      teamName: '',
      type: 'cartao_amarelo',
      reason: '',
      penalty: '',
    });
  };

  const exportRosterCSV = () => {
    if (!currentModality) return;
    const rows: (string | number)[][] = [
      ['RELATÓRIO OFICIAL DE INSCRITOS - V INTERNERD 2026'],
      ['Modalidade:', currentModality.name, 'Categoria:', currentModality.category],
      ['Diretor Responsável:', currentModality.responsibleDirectorName, 'Contato:', currentModality.directorContact],
      ['Local dos Jogos:', currentModality.venue],
      [],
      ['Equipe', 'Nome do Atleta', 'Matrícula', 'WhatsApp', 'Turma', 'Status Inscrição', 'Pagamento'],
    ];

    enrolledTeams.forEach((team) => {
      team.members
        .filter((m) => m.modalities.includes(currentModality.id))
        .forEach((m) => {
          rows.push([
            team.name,
            m.athleteName,
            m.matricula,
            m.phone,
            m.turma,
            m.registrationStatus,
            m.paymentStatus,
          ]);
        });
    });

    downloadCSV(`inscritos_${currentModality.id}_vinternerd.csv`, rows);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Module Banner */}
      <div className="rounded-3xl bg-neutral-900 border border-emerald-500/30 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left w-full md:w-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-cyber font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>Módulo C • Área do Diretor de Modalidade</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-heading text-white">
            GESTÃO TÉCNICA DE MODALIDADE
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Lançamento de jogos, placares, W.O., súmulas oficiais, colocações finais e ocorrências disciplinares.
          </p>
        </div>

        {/* Modality Selector & Password */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-cyber font-semibold transition cursor-pointer shrink-0"
            title="Alterar Minha Senha"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Alterar Senha</span>
          </button>

          <div className="bg-neutral-950 p-3 sm:p-4 rounded-2xl border border-neutral-800 space-y-1.5 w-full sm:w-auto">
            <label className="text-[11px] font-cyber text-neutral-400 block uppercase font-bold">
              Modalidade em Gestão:
            </label>
            <select
              value={selectedModId}
              onChange={(e) => setSelectedModId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
            >
              {myModalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category.toUpperCase()})
                </option>
              ))}
            </select>
            {currentModality && (
              <div className="text-[10px] text-neutral-500 font-mono">
                Tolerância de W.O.: <strong>{currentModality.toleranceMinutes} minutos</strong> (Art. 30 e 61)
              </div>
            )}
          </div>
        </div>
      </div>

      {currentModality && (
        <div className="space-y-6 w-full max-w-full">
          {/* Tabs */}
          <div className="flex border-b border-neutral-800 gap-2 font-cyber text-xs overflow-x-auto no-scrollbar pb-1 w-full max-w-full">
            <button
              onClick={() => setActiveTab('jogos')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'jogos'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Jogos & Súmulas ({currentMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('classificacao')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'classificacao'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Lançamento do Pódio
            </button>
            <button
              onClick={() => setActiveTab('disciplina')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'disciplina'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Ocorrências Disciplinares
            </button>
            <button
              onClick={() => setActiveTab('inscritos')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'inscritos'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Inscritos & Exportação
            </button>
          </div>

          {/* Tab 1: Jogos e Súmulas */}
          {activeTab === 'jogos' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base font-heading">
                    PARTIDAS DE {currentModality.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Cadastre novos confrontos ou edite os resultados e súmula.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewMatch}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl text-xs font-cyber flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm w-full sm:w-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Confronto</span>
                </button>
              </div>

              {currentMatches.length === 0 ? (
                <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                  <p className="text-xs text-neutral-500 font-cyber">
                    Nenhum jogo cadastrado nesta modalidade ainda.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMatches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-cyber font-bold text-amber-400">
                          {m.phase} - {m.roundName || 'Jogo'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingMatch(m);
                              setMatchModalOpen(true);
                            }}
                            className="p-1 text-neutral-400 hover:text-amber-300 rounded"
                            title="Editar Partida e Súmula"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printMatchSumula(m)}
                            className="p-1 text-neutral-400 hover:text-white rounded"
                            title="Imprimir Súmula"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMatch(m.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between">
                        <div className="truncate text-xs text-white font-bold">{m.teamAName}</div>
                        <div className="px-3 text-center">
                          <div className="text-lg font-mono font-black text-amber-400">
                            {m.scoreA !== null ? m.scoreA : '-'} : {m.scoreB !== null ? m.scoreB : '-'}
                          </div>
                          {m.isWO && (
                            <span className="text-[10px] text-red-400 font-bold uppercase font-cyber">
                              W.O. ({m.woWinner})
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-white font-bold text-right">{m.teamBName}</div>
                      </div>

                      <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-800">
                        <span>{m.date} às {m.time} • {m.venue}</span>
                        <span
                          className={`font-cyber uppercase font-bold text-[10px] ${
                            m.status === 'finalizado' ? 'text-emerald-400' : 'text-amber-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Lançamento do Pódio Final */}
          {activeTab === 'classificacao' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h3 className="font-bold font-heading text-white text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>LANÇAR CLASSIFICAÇÃO FINAL DE {currentModality.name.toUpperCase()}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-cyber">
                    Pontuação automática conforme o Art. 26 do regulamento:{' '}
                    1º ({currentModality.points.first} pts) | 2º ({currentModality.points.second} pts) | 3º ({currentModality.points.third} pts)
                    {currentModality.points.fourth ? ` | 4º (${currentModality.points.fourth} pts)` : ''}.
                  </p>
                </div>

                <form onSubmit={handleSavePlacementSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Colocação
                    </label>
                    <select
                      value={placementForm.placement}
                      onChange={(e) =>
                        setPlacementForm({
                          ...placementForm,
                          placement: Number(e.target.value) as 1 | 2 | 3 | 4,
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                    >
                      <option value={1}>1º Lugar (Campeão)</option>
                      <option value={2}>2º Lugar (Vice-Campeão)</option>
                      <option value={3}>3º Lugar (Bronze)</option>
                      {currentModality.category === 'coletiva' && (
                        <option value={4}>4º Lugar</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Equipe Vencedora *
                    </label>
                    <select
                      required
                      value={placementForm.teamId}
                      onChange={(e) => setPlacementForm({ ...placementForm, teamId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="">Selecione a equipe</option>
                      {enrolledTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nome do Atleta (Se Individual)
                    </label>
                    <input
                      type="text"
                      value={placementForm.athleteName}
                      onChange={(e) => setFormDataPlacement(e.target.value)}
                      placeholder="Ex: Lucas Silva"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-300 text-black font-bold py-2 px-4 rounded-xl text-xs font-cyber transition cursor-pointer"
                  >
                    Salvar Colocação
                  </button>
                </form>
              </div>

              {/* Placements List */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-cyber">
                  Pódio Homologado nesta Modalidade:
                </h4>
                {currentPlacements.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Nenhum resultado registrado ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {currentPlacements.map((plc) => (
                      <div
                        key={plc.id}
                        className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="font-mono text-amber-400">{plc.placement}º Lugar</span>
                          </div>
                          <div className="text-neutral-300">{plc.teamName}</div>
                          {plc.athleteName && <div className="text-[10px] text-neutral-500">{plc.athleteName}</div>}
                          <div className="font-mono text-[11px] text-emerald-400 font-bold mt-1">
                            +{plc.points} pontos atribuídos
                          </div>
                        </div>
                        <button
                          onClick={() => removePlacement(plc.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Ocorrências Disciplinares */}
          {activeTab === 'disciplina' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h3 className="font-bold font-heading text-white text-base flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>REGISTRAR INFRAÇÃO / OCORRÊNCIA DISCIPLINAR (Art. 32 e 33)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-cyber">
                    Aplique advertências, cartões e penalidades com registro oficial para a Coordenação Geral.
                  </p>
                </div>

                <form onSubmit={handleSaveIncidentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Tipo de Penalidade *
                      </label>
                      <select
                        value={incidentForm.type}
                        onChange={(e: any) =>
                          setIncidentForm({ ...incidentForm, type: e.target.value })
                        }
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-red-300 font-bold focus:border-amber-400 focus:outline-none uppercase font-cyber"
                      >
                        <option value="advertencia">Advertência Formal</option>
                        <option value="cartao_amarelo">Cartão Amarelo</option>
                        <option value="cartao_vermelho">Cartão Vermelho (Expulsão)</option>
                        <option value="suspensao">Suspensão de Jogos</option>
                        <option value="desclassificacao">Desclassificação</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Infrator (Nome do Atleta ou Equipe) *
                      </label>
                      <input
                        type="text"
                        required
                        value={incidentForm.targetName}
                        onChange={(e) => setIncidentForm({ ...incidentForm, targetName: e.target.value })}
                        placeholder="Ex: João da Silva ou Equipe X"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Equipe Representada
                      </label>
                      <select
                        value={incidentForm.teamName}
                        onChange={(e) => setIncidentForm({ ...incidentForm, teamName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="">Selecione...</option>
                        {enrolledTeams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Motivo / Artigo Infringido *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={incidentForm.reason}
                      onChange={(e) => setIncidentForm({ ...incidentForm, reason: e.target.value })}
                      placeholder="Descreva a conduta, artigo do regulamento e circunstâncias..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-400 text-black font-bold py-2 px-5 rounded-xl text-xs font-cyber transition cursor-pointer"
                  >
                    Publicar Penalidade na Súmula
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 4: Inscritos & Exportação */}
          {activeTab === 'inscritos' && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    LISTA DE ATLETAS E EQUIPES INSCRITAS
                  </h3>
                  <p className="text-xs text-neutral-400 font-cyber">
                    Relação completa de participantes em {currentModality.name}.
                  </p>
                </div>
                <button
                  onClick={exportRosterCSV}
                  className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 font-bold px-4 py-2 rounded-xl text-xs font-cyber flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Exportar Lista (CSV)</span>
                </button>
              </div>

              <div className="space-y-4">
                {enrolledTeams.map((t) => {
                  const athletes = t.members.filter((m) => m.modalities.includes(currentModality.id));
                  return (
                    <div key={t.id} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white font-cyber">{t.name}</span>
                        <span className="text-xs font-mono text-amber-400">{athletes.length} atleta(s)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {athletes.map((a) => (
                          <span
                            key={a.athleteId}
                            className="bg-neutral-900 px-2.5 py-1 rounded-lg text-xs text-neutral-300 border border-neutral-800 flex items-center gap-1.5"
                          >
                            <span>{a.athleteName}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">({a.matricula})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Match Modal */}
      {matchModalOpen && editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMatchModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-heading mb-4">
              {editingMatch.id?.startsWith('mat-') ? 'EDITAR PARTIDA E SÚMULA' : 'CADASTRAR CONFRONTO'}
            </h3>

            <form onSubmit={handleSaveMatchSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Fase *</label>
                  <select
                    value={editingMatch.phase}
                    onChange={(e) => setEditingMatch({ ...editingMatch, phase: e.target.value as MatchPhase })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="Fase de Grupos">Fase de Grupos</option>
                    <option value="Quartas de Final">Quartas de Final</option>
                    <option value="Semifinal">Semifinal</option>
                    <option value="Final">Grande Final</option>
                    <option value="Disputa de 3º">Disputa de 3º</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Status *</label>
                  <select
                    value={editingMatch.status}
                    onChange={(e: any) => setEditingMatch({ ...editingMatch, status: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-cyber"
                  >
                    <option value="agendado">Agendado</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Data *</label>
                  <input
                    type="date"
                    value={editingMatch.date}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Horário *</label>
                  <input
                    type="time"
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Local do Jogo</label>
                <input
                  type="text"
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                  placeholder="Local na UEMA"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Equipes e Placares */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">Equipe A</label>
                  <input
                    type="text"
                    value={editingMatch.teamAName}
                    onChange={(e) => setEditingMatch({ ...editingMatch, teamAName: e.target.value })}
                    placeholder="Nome Equipe A"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-1.5 px-2 text-xs text-white mb-2"
                  />
                  <label className="block text-[10px] text-neutral-400">Placar A</label>
                  <input
                    type="number"
                    value={editingMatch.scoreA ?? 0}
                    onChange={(e) => setEditingMatch({ ...editingMatch, scoreA: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-1.5 px-2 text-sm font-mono font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">Equipe B</label>
                  <input
                    type="text"
                    value={editingMatch.teamBName}
                    onChange={(e) => setEditingMatch({ ...editingMatch, teamBName: e.target.value })}
                    placeholder="Nome Equipe B"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-1.5 px-2 text-xs text-white mb-2"
                  />
                  <label className="block text-[10px] text-neutral-400">Placar B</label>
                  <input
                    type="number"
                    value={editingMatch.scoreB ?? 0}
                    onChange={(e) => setEditingMatch({ ...editingMatch, scoreB: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-1.5 px-2 text-sm font-mono font-bold text-white"
                  />
                </div>
              </div>

              {/* W.O. Checkbox and Tolerância (Art. 30 e 61) */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-200">
                  <input
                    type="checkbox"
                    checked={editingMatch.isWO || false}
                    onChange={(e) => setEditingMatch({ ...editingMatch, isWO: e.target.checked })}
                    className="rounded border-neutral-700 text-red-500 focus:ring-0"
                  />
                  <span className="font-bold text-red-400 uppercase font-cyber">Partida decidida por W.O.</span>
                </label>

                {editingMatch.isWO && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-neutral-400">Vencedor declarado:</span>
                    <select
                      value={editingMatch.woWinner || 'A'}
                      onChange={(e: any) => setEditingMatch({ ...editingMatch, woWinner: e.target.value })}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg py-1 px-2 text-xs text-white"
                    >
                      <option value="A">Equipe A ({editingMatch.teamAName})</option>
                      <option value="B">Equipe B ({editingMatch.teamBName})</option>
                    </select>
                  </div>
                )}
                <div className="text-[10px] text-neutral-500 font-cyber">
                  Tolerância regulamentar: {editingMatch.toleranceMinutes} min (Art. 30 e 61).
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Súmula / Detalhes de Pontos e Ocorrências
                </label>
                <textarea
                  rows={3}
                  value={editingMatch.sumulaDetails}
                  onChange={(e) => setEditingMatch({ ...editingMatch, sumulaDetails: e.target.value })}
                  placeholder="Gols, sets parciais, escalações, cartões aplicados..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setMatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2 rounded-xl text-xs font-cyber transition cursor-pointer"
                >
                  Salvar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Alterar Senha */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );

  function setFormDataPlacement(athleteName: string) {
    setPlacementForm((prev) => ({ ...prev, athleteName }));
  }
};
