import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Users,
  Shield,
  UserPlus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Share2,
  Copy,
  Plus,
  Check,
  Award,
  Lock,
  KeyRound,
  X,
  Upload,
} from 'lucide-react';
import { validateTeamRequirements, isAthleteTransferAllowed, PIX_PAYMENT_INFO, calculateAthleteFee } from '../utils/rules';
import { ChangePasswordModal } from './ChangePasswordModal';

export const CaptainModule: React.FC = () => {
  const {
    currentUser,
    teams,
    modalities,
    createTeam,
    captainRegisterAthlete,
    approveTeamMember,
    removeTeamMember,
    updateAthletePayment,
  } = useTournament();

  const [createTeamForm, setCreateTeamForm] = useState({
    name: '',
    tag: '',
    chosenModalities: ['futsal', 'voleibol', 'basquete-2x2', 'sinuca-duplas', 'lol', 'fifa'],
  });

  const [activeTab, setActiveTab] = useState<'elenco' | 'modalidades' | 'financeiro'>('elenco');
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modais
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddAthleteModalOpen, setIsAddAthleteModalOpen] = useState(false);
  const [athleteSuccessMsg, setAthleteSuccessMsg] = useState<string | null>(null);

  // Formulário de Inscrição de Atleta pelo Capitão
  const [newAthleteForm, setNewAthleteForm] = useState({
    name: '',
    matricula: '',
    phone: '',
    turma: 'Eng. Comp 2024.1',
    proofFileName: 'comprovante_matricula_uema.pdf',
    selectedModalities: ['futsal'] as string[],
  });

  // Encontrar a equipe deste capitão
  const myTeam = teams.find((t) => t.captainId === currentUser?.uid || t.id === currentUser?.teamId);

  // Contagem de atletas por modalidade para validação
  const modalityRosters: Record<string, number> = {};
  if (myTeam) {
    myTeam.members.forEach((m) => {
      m.modalities.forEach((modId) => {
        modalityRosters[modId] = (modalityRosters[modId] || 0) + 1;
      });
    });
  }

  const validation = myTeam
    ? validateTeamRequirements(myTeam.members.length, myTeam.modalities.length, modalityRosters)
    : null;

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = createTeam(createTeamForm.name, createTeamForm.tag, createTeamForm.chosenModalities);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao registrar equipe.');
    }
  };

  const handleRegisterAthleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setAthleteSuccessMsg(null);

    if (!myTeam) return;

    if (!newAthleteForm.name.trim() || !newAthleteForm.matricula.trim()) {
      setErrorMsg('Informe o nome completo e a matrícula do atleta.');
      return;
    }

    if (newAthleteForm.selectedModalities.length === 0) {
      setErrorMsg('Selecione pelo menos uma modalidade para o atleta competir.');
      return;
    }

    const res = captainRegisterAthlete(myTeam.id, {
      name: newAthleteForm.name,
      matricula: newAthleteForm.matricula,
      phone: newAthleteForm.phone,
      turma: newAthleteForm.turma,
      modalities: newAthleteForm.selectedModalities,
      proofFileName: newAthleteForm.proofFileName,
    });

    if (res.success) {
      setAthleteSuccessMsg(`Atleta ${newAthleteForm.name} cadastrado com sucesso no elenco!`);
      setNewAthleteForm({
        name: '',
        matricula: '',
        phone: '',
        turma: 'Eng. Comp 2024.1',
        proofFileName: 'comprovante_matricula_uema.pdf',
        selectedModalities: ['futsal'],
      });
      setTimeout(() => {
        setIsAddAthleteModalOpen(false);
        setAthleteSuccessMsg(null);
      }, 1400);
    } else {
      setErrorMsg(res.error || 'Erro ao inscrever atleta.');
    }
  };

  const copyInvite = () => {
    if (!myTeam) return;
    navigator.clipboard.writeText(myTeam.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredMembers = myTeam?.members.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.athleteName.toLowerCase().includes(q) ||
      m.matricula.toLowerCase().includes(q) ||
      m.turma.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Module Banner */}
      <div className="rounded-3xl bg-neutral-900 border border-blue-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-cyber font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Módulo B • Painel do Capitão & Gestão de Equipe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            {myTeam ? `EQUIPE: ${myTeam.name}` : 'REGISTRO DE NOVA EQUIPE'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            {myTeam
              ? `Gerencie e inscreva os atletas da sua equipe, confirme convocações por modalidade e controle a arrecadação das taxas de inscrição.`
              : `Cada pessoa só pode ser capitão e representante de UMA única equipe durante o V INTERNERD (Art. 17 §2º).`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Botão de Alterar Senha (usuário imutável) */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-cyber font-semibold transition cursor-pointer"
            title="Alterar Minha Senha"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Alterar Senha</span>
          </button>

          {myTeam && (
            <div className="flex flex-col items-end gap-2 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs">
              <div className="text-neutral-400 font-cyber">Código da Equipe:</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-amber-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-700">
                  {myTeam.inviteCode}
                </span>
                <button
                  onClick={copyInvite}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-lg transition cursor-pointer"
                  title="Copiar Código"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Se não possui equipe, exibir formulário de criação de equipe */}
      {!myTeam ? (
        <div className="max-w-2xl mx-auto bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-heading text-white">CRIAR NOVA EQUIPE (Art. 17 e 18)</h2>
          </div>

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Nome da Equipe *
              </label>
              <input
                type="text"
                required
                value={createTeamForm.name}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, name: e.target.value })}
                placeholder="Ex: ByteForce Cyborgues, Kernel Panic FC..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                TAG ou Sigla (3 a 5 caracteres)
              </label>
              <input
                type="text"
                maxLength={5}
                value={createTeamForm.tag}
                onChange={(e) => setCreateTeamForm({ ...createTeamForm, tag: e.target.value.toUpperCase() })}
                placeholder="Ex: BFC, KPN, RBT..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Modalidades que a Equipe Pretende Disputar (Mínimo de 6 - Art. 19 §2º)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {modalities.map((m) => {
                  const isChecked = createTeamForm.chosenModalities.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? 'bg-amber-400/15 border-amber-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span className="truncate mr-1">{m.name}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? createTeamForm.chosenModalities.filter((id) => id !== m.id)
                            : [...createTeamForm.chosenModalities, m.id];
                          setCreateTeamForm({ ...createTeamForm, chosenModalities: updated });
                        }}
                        className="rounded border-neutral-700 text-amber-400"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer font-cyber uppercase tracking-wider text-sm shadow-md mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar e Tornar-me Capitão</span>
            </button>
          </form>
        </div>
      ) : (
        /* Se já possui equipe, exibir painel completo */
        <div className="space-y-6">
          {/* Validation Alert Cards (Art. 19 e Art. 21) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Athletes Count Rule */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                validation?.athleteCount && validation.athleteCount >= 15
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              <Users className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs font-cyber uppercase">
                  Mínimo de 15 Atletas (Art. 19)
                </div>
                <div className="text-xl font-black font-mono mt-0.5">
                  {myTeam.members.length} / 15
                </div>
                <p className="text-[11px] mt-1 opacity-90">
                  {myTeam.members.length >= 15
                    ? 'Requisito atingido com sucesso!'
                    : `Faltam ${15 - myTeam.members.length} atleta(s) para regularizar.`}
                </p>
              </div>
            </div>

            {/* Modalities Count Rule */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                validation?.modalityCount && validation.modalityCount >= 6
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              <Award className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs font-cyber uppercase">
                  Mínimo de 6 Modalidades (Art. 19 §2º)
                </div>
                <div className="text-xl font-black font-mono mt-0.5">
                  {myTeam.modalities.length} / 6
                </div>
                <p className="text-[11px] mt-1 opacity-90">
                  {myTeam.modalities.length >= 6
                    ? 'Requisito cumprido!'
                    : `Inscreva a equipe em pelo menos mais ${6 - myTeam.modalities.length} modalidade(s).`}
                </p>
              </div>
            </div>

            {/* Financial Status Summary */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs font-cyber uppercase text-neutral-300">
                  Total Financeiro da Equipe
                </div>
                <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                  R$ {myTeam.totalFee.toFixed(2)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Pago: R$ {myTeam.totalPaid.toFixed(2)} • Pendente: R${' '}
                  {(myTeam.totalFee - myTeam.totalPaid).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Warnings if any */}
          {validation && (!validation.isValid || validation.warnings.length > 0) && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1.5">
              <div className="font-bold font-cyber uppercase flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Avisos de Conformidade do Regulamento:</span>
              </div>
              {validation.errors.map((err, i) => (
                <div key={i} className="text-red-300 font-medium">
                  &bull; {err}
                </div>
              ))}
              {validation.warnings.map((warn, i) => (
                <div key={i} className="text-amber-300">
                  &bull; {warn}
                </div>
              ))}
            </div>
          )}

          {/* Tabs: Elenco, Modalidades e Financeiro */}
          <div className="flex border-b border-neutral-800 gap-2 font-cyber text-xs">
            <button
              onClick={() => setActiveTab('elenco')}
              className={`px-4 py-2.5 font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'elenco'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Elenco de Atletas ({myTeam.members.length})
            </button>
            <button
              onClick={() => setActiveTab('modalidades')}
              className={`px-4 py-2.5 font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'modalidades'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Inscrições por Modalidade
            </button>
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`px-4 py-2.5 font-bold transition border-b-2 cursor-pointer ${
                activeTab === 'financeiro'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Controle Financeiro da Equipe
            </button>
          </div>

          {/* Tab 1: Elenco */}
          {activeTab === 'elenco' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar atletas por nome, matrícula..."
                  className="bg-neutral-900 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 w-full max-w-sm focus:border-amber-400 focus:outline-none"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 font-cyber">
                    Total: <strong>{myTeam.members.length}</strong> atletas
                  </span>
                  <button
                    onClick={() => setIsAddAthleteModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer font-cyber shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Inscrever Novo Atleta</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto bg-neutral-900/70 border border-neutral-800 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Atleta</th>
                      <th className="p-3">Matrícula</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Turma</th>
                      <th className="p-3">Modalidades</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Taxa</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredMembers.map((m) => (
                      <tr key={m.athleteId} className="hover:bg-neutral-800/30">
                        <td className="p-3 font-medium text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{m.athleteName}</span>
                            {m.isCaptain && (
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-cyber">
                                Capitão
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-neutral-300">{m.matricula}</td>
                        <td className="p-3 font-mono text-neutral-400">{m.phone || '-'}</td>
                        <td className="p-3 text-neutral-300">{m.turma}</td>
                        <td className="p-3 text-neutral-400 max-w-[180px] truncate">
                          {m.modalities.join(', ')}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-cyber ${
                              m.registrationStatus === 'aprovada'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {m.registrationStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-amber-400">
                          R$ {m.fee.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {m.registrationStatus === 'pendente' && (
                              <button
                                onClick={() => approveTeamMember(myTeam.id, m.athleteId)}
                                className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black p-1.5 rounded-lg transition"
                                title="Aprovar Atleta"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!m.isCaptain && (
                              <button
                                onClick={() => removeTeamMember(myTeam.id, m.athleteId)}
                                className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-neutral-800 transition"
                                title="Remover Atleta da Equipe"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Inscrições por Modalidade */}
          {activeTab === 'modalidades' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modalities.map((mod) => {
                const count = modalityRosters[mod.id] || 0;
                const athletesInMod = myTeam.members.filter((m) => m.modalities.includes(mod.id));
                const isOverLimit = count > mod.maxAthletes;
                const isUnderLimit = count < mod.minAthletes;

                return (
                  <div
                    key={mod.id}
                    className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm font-cyber">{mod.name}</h4>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono">
                          Mín: {mod.minAthletes} | Máx: {mod.maxAthletes}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isOverLimit
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isUnderLimit
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {count} inscritos
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400">
                      {athletesInMod.length === 0 ? (
                        <p className="italic text-neutral-600">Nenhum atleta inscrito nesta modalidade.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {athletesInMod.map((ath) => (
                            <span
                              key={ath.athleteId}
                              className="bg-neutral-950 px-2 py-0.5 rounded text-[11px] text-neutral-300 border border-neutral-800"
                            >
                              {ath.athleteName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Financeiro da Equipe */}
          {activeTab === 'financeiro' && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    PAGAMENTOS CENTRALIZADOS (Art. 23)
                  </h3>
                  <p className="text-xs text-neutral-400 font-cyber">
                    O capitão reúne os valores devidos e envia o montante total via PIX para a organização.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400 font-cyber">Total Arrecadado:</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    R$ {myTeam.totalPaid.toFixed(2)} / R$ {myTeam.totalFee.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Atleta</th>
                      <th className="p-2.5">Matrícula</th>
                      <th className="p-2.5">Modalidades</th>
                      <th className="p-2.5 text-center">Valor Devido</th>
                      <th className="p-2.5 text-center">Status Pagamento</th>
                      <th className="p-2.5 text-right">Ação do Capitão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {myTeam.members.map((m) => (
                      <tr key={m.athleteId} className="hover:bg-neutral-800/30">
                        <td className="p-2.5 font-sans font-medium text-white">{m.athleteName}</td>
                        <td className="p-2.5 text-neutral-400">{m.matricula}</td>
                        <td className="p-2.5 font-sans text-neutral-400">{m.modalities.length} modalidade(s)</td>
                        <td className="p-2.5 text-center font-bold text-amber-400">
                          R$ {m.fee.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-cyber ${
                              m.paymentStatus === 'pago'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {m.paymentStatus === 'pago' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-sans">
                          <button
                            onClick={() =>
                              updateAthletePayment(
                                m.athleteId,
                                m.paymentStatus === 'pago' ? 'pendente' : 'pago'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-cyber transition cursor-pointer ${
                              m.paymentStatus === 'pago'
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                            }`}
                          >
                            {m.paymentStatus === 'pago' ? 'Marcar Pendente' : 'Marcar como Pago'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Inscrever Novo Atleta pelo Capitão */}
      {isAddAthleteModalOpen && myTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-amber-500/40 p-6 sm:p-7 shadow-2xl glow-gold text-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddAthleteModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-neutral-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white">INSCREVER ATLETA NO ELENCO</h3>
                <p className="text-xs text-neutral-400">Equipe: <strong className="text-amber-300">{myTeam.name}</strong></p>
              </div>
            </div>

            {athleteSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{athleteSuccessMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterAthleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome Completo do Atleta *</label>
                <input
                  type="text"
                  required
                  value={newAthleteForm.name}
                  onChange={(e) => setNewAthleteForm({ ...newAthleteForm, name: e.target.value })}
                  placeholder="Nome do atleta"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Matrícula UEMA *</label>
                  <input
                    type="text"
                    required
                    value={newAthleteForm.matricula}
                    onChange={(e) => setNewAthleteForm({ ...newAthleteForm, matricula: e.target.value })}
                    placeholder="Ex: 20241502088"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-neutral-500">Validação contra duplicidade</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newAthleteForm.phone}
                    onChange={(e) => setNewAthleteForm({ ...newAthleteForm, phone: e.target.value })}
                    placeholder="(98) 9XXXX-XXXX"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Turma / Período *</label>
                  <input
                    type="text"
                    required
                    value={newAthleteForm.turma}
                    onChange={(e) => setNewAthleteForm({ ...newAthleteForm, turma: e.target.value })}
                    placeholder="Ex: Eng. Comp 2024.1"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Comprovante de Matrícula</label>
                  <input
                    type="text"
                    value={newAthleteForm.proofFileName}
                    onChange={(e) => setNewAthleteForm({ ...newAthleteForm, proofFileName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modalidades Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-amber-400 uppercase font-cyber">
                    Modalidades que Competirá *
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    Taxa: R$ {calculateAthleteFee(newAthleteForm.selectedModalities.length).toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  {modalities.map((mod) => {
                    const isChecked = newAthleteForm.selectedModalities.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? 'bg-amber-400/15 border-amber-400/50 text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <span className="truncate mr-1 text-[11px]">{mod.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updated = isChecked
                              ? newAthleteForm.selectedModalities.filter((id) => id !== mod.id)
                              : [...newAthleteForm.selectedModalities, mod.id];
                            setNewAthleteForm({ ...newAthleteForm, selectedModalities: updated });
                          }}
                          className="rounded border-neutral-700 text-amber-400 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md mt-2 font-cyber uppercase tracking-wider"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Inscrição no Elenco</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Alteração de Senha do Capitão (usuário imutável) */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
