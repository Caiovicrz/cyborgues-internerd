import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Shield,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  Shuffle,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  Megaphone,
  KeyRound,
  Lock,
  UserPlus,
  Crown,
} from 'lucide-react';
import { downloadCSV } from '../utils/exportHelpers';
import { ChangePasswordModal } from './ChangePasswordModal';

export const AdminModule: React.FC = () => {
  const {
    teams,
    users,
    modalities,
    matches,
    placements,
    standings,
    notices,
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
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'overview' | 'equipes' | 'modalidades' | 'sorteio' | 'pagamentos' | 'usuarios' | 'comunicados' | 'dados_reais'>('overview');
  const [selectedModalityForDraw, setSelectedModalityForDraw] = useState<string>('futsal');
  const [isDrawing, setIsDrawing] = useState(false);
  const [realDataJsonInput, setRealDataJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Formulário para criação de Novo Diretor de Modalidade
  const [newDirectorForm, setNewDirectorForm] = useState({
    name: '',
    username: '',
    password: '@Cyborgues2026',
    modalityId: 'futsal',
    phone: '',
  });

  // Formulário para criação de Novo Capitão de Equipe
  const [newCaptainForm, setNewCaptainForm] = useState({
    name: '',
    username: '',
    password: '@Cyborgues2026',
    teamName: '',
    matricula: '',
    phone: '',
  });

  const [userActionMsg, setUserActionMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New notice form
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'alta' | 'urgente',
    pinned: false,
  });

  // Financial aggregates
  const totalExpectedRevenue = teams.reduce((acc, t) => acc + t.totalFee, 0);
  const totalPaidRevenue = teams.reduce((acc, t) => acc + t.totalPaid, 0);
  const totalPendingRevenue = totalExpectedRevenue - totalPaidRevenue;
  const totalAthletes = teams.reduce((acc, t) => acc + t.members.length, 0);

  // Trigger collective draw
  const handleDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      drawCollectiveMatches(selectedModalityForDraw);
      setIsDrawing(false);
      alert(`Sorteio e chaveamento de confrontos de ${selectedModalityForDraw.toUpperCase()} gerados com sucesso conforme o Art. 9º §5º!`);
    }, 800);
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title) return;
    saveNotice({
      title: noticeForm.title,
      content: noticeForm.content,
      priority: noticeForm.priority,
      author: 'Diretoria Geral Cyborgues',
      pinned: noticeForm.pinned,
    });
    setNoticeForm({ title: '', content: '', priority: 'normal', pinned: false });
  };

  // Full CSV Export of Everything
  const exportAllDataCSV = () => {
    const rows: (string | number)[][] = [
      ['RELATÓRIO GERAL COMPLETO - V INTERNERD 2026 - CYBORGUES UEMA'],
      ['Data de Geração:', new Date().toLocaleString('pt-BR')],
      ['Total de Equipes:', teams.length, 'Total de Atletas:', totalAthletes],
      ['Arrecadação Esperada:', `R$ ${totalExpectedRevenue.toFixed(2)}`, 'Arrecadação Confirmada:', `R$ ${totalPaidRevenue.toFixed(2)}`],
      [],
      ['=== CLASSIFICAÇÃO GERAL OFICIAL ==='],
      ['Posição', 'Equipe', 'Pontos Totais', '1ºs Lugares', '2ºs Lugares', '3ºs Lugares', '1ºs em Coletivas', 'Pontos Maior Valor', 'Empate Manual'],
    ];

    standings.forEach((s, idx) => {
      rows.push([
        `${idx + 1}º`,
        s.teamName,
        s.totalPoints,
        s.firstPlacesCount,
        s.secondPlacesCount,
        s.thirdPlacesCount,
        s.collectiveFirstPlacesCount,
        s.pointsInHighValueModalities,
        s.needsManualResolution ? 'SIM (Requer Art. 28 VI)' : 'NÃO',
      ]);
    });

    rows.push([]);
    rows.push(['=== RELAÇÃO DE EQUIPES E INTEGRANTES ===']);
    rows.push(['Equipe', 'TAG', 'Capitão', 'Contato', 'Status Equipe', 'Qtd Atletas', 'Total Devido', 'Total Pago', 'Status Financeiro']);

    teams.forEach((t) => {
      rows.push([
        t.name,
        t.tag,
        t.captainName,
        t.captainContact,
        t.status,
        t.members.length,
        `R$ ${t.totalFee.toFixed(2)}`,
        `R$ ${t.totalPaid.toFixed(2)}`,
        t.paymentStatus,
      ]);
    });

    rows.push([]);
    rows.push(['=== DETALHAMENTO DE ATLETAS ===']);
    rows.push(['Equipe', 'Nome do Atleta', 'Matrícula', 'WhatsApp', 'Turma', 'Modalidades', 'Taxa Devida', 'Status Pagamento']);

    teams.forEach((t) => {
      t.members.forEach((m) => {
        rows.push([
          t.name,
          m.athleteName,
          m.matricula,
          m.phone,
          m.turma,
          m.modalities.join(' | '),
          `R$ ${m.fee.toFixed(2)}`,
          m.paymentStatus,
        ]);
      });
    });

    downloadCSV('relatorio_completo_vinternerd_2026.csv', rows);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl bg-neutral-900 border border-amber-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-cyber font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Módulo D • Painel de Controle da Diretoria Geral</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            ADMINISTRAÇÃO GERAL – V INTERNERD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Acesso irrestrito: aprovação de equipes, sorteio das coletivas, designação de coordenadores das 14 modalidades e relatórios financeiros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-cyber font-semibold transition cursor-pointer"
            title="Alterar Minha Senha"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Alterar Senha</span>
          </button>

          <button
            onClick={exportAllDataCSV}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl text-xs font-cyber flex items-center gap-2 transition cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Tudo (CSV)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Deseja restaurar todos os dados oficiais do campeonato para a configuração inicial padrão?')) {
                resetToDefaultData();
              }
            }}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-2.5 rounded-xl text-xs font-cyber flex items-center gap-1.5 transition border border-neutral-700"
            title="Resetar Dados para o Padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Top Aggregates Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-cyber mb-1">
            <span>Equipes Registradas</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{teams.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">
            {teams.filter((t) => t.status === 'aprovada').length} Aprovadas
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-cyber mb-1">
            <span>Total de Atletas</span>
            <UserCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{totalAthletes}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Média {(totalAthletes / (teams.length || 1)).toFixed(0)} por equipe</div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-cyber mb-1">
            <span>Arrecadação Recebida</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            R$ {totalPaidRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">via Chave PIX Santander</div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-cyber mb-1">
            <span>Pendente de Pagamento</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            R$ {totalPendingRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Esperado: R$ {totalExpectedRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-neutral-800 gap-2 font-cyber text-xs overflow-x-auto no-scrollbar pb-1 w-full max-w-full">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Visão Geral & Desempates
        </button>
        <button
          onClick={() => setActiveTab('equipes')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'equipes'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Aprovação de Equipes ({teams.length})
        </button>
        <button
          onClick={() => setActiveTab('modalidades')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'modalidades'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          As 14 Modalidades & Diretores
        </button>
        <button
          onClick={() => setActiveTab('sorteio')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'sorteio'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Sorteio das Coletivas (Art. 9º §5º)
        </button>
        <button
          onClick={() => setActiveTab('pagamentos')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'pagamentos'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Controle Geral de Pagamentos
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'usuarios'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span>Acessos & Usuários ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('comunicados')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'comunicados'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Publicar Comunicados
        </button>
        <button
          onClick={() => setActiveTab('dados_reais')}
          className={`px-3.5 py-2.5 font-bold transition border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'dados_reais'
              ? 'border-amber-400 text-amber-300 bg-amber-400/10'
              : 'border-transparent text-amber-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Importar Dados Reais (JSON)</span>
        </button>
      </div>

      {/* Tab 1: Overview & Desempates */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold font-heading text-white text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>SITUAÇÃO DA CLASSIFICAÇÃO GERAL & DESEMPATE (Art. 28)</span>
            </h3>
            <p className="text-xs text-neutral-400">
              O sistema processa automaticamente os critérios I a IV (mais 1ºs, 2ºs, 3ºs e 1ºs coletivos).
              Empates persistentes nos critérios V e VI são sinalizados abaixo para decisão da Coordenação Geral.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px]">
                  <tr>
                    <th className="p-2.5">Posição</th>
                    <th className="p-2.5">Equipe</th>
                    <th className="p-2.5 text-center text-amber-400">Pontos Totais</th>
                    <th className="p-2.5 text-center">1ºs</th>
                    <th className="p-2.5 text-center">2ºs</th>
                    <th className="p-2.5 text-center">3ºs</th>
                    <th className="p-2.5 text-center">1ºs Coletivas</th>
                    <th className="p-2.5 text-center">Pts Maior Valor</th>
                    <th className="p-2.5 text-right">Análise do Desempate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {standings.map((s, idx) => (
                    <tr key={s.teamId} className="hover:bg-neutral-800/30">
                      <td className="p-2.5 font-bold">{idx + 1}º</td>
                      <td className="p-2.5 font-sans font-bold text-white">{s.teamName}</td>
                      <td className="p-2.5 text-center font-black text-amber-400">{s.totalPoints}</td>
                      <td className="p-2.5 text-center text-amber-300">{s.firstPlacesCount}</td>
                      <td className="p-2.5 text-center text-neutral-300">{s.secondPlacesCount}</td>
                      <td className="p-2.5 text-center text-amber-600">{s.thirdPlacesCount}</td>
                      <td className="p-2.5 text-center text-blue-400">{s.collectiveFirstPlacesCount}</td>
                      <td className="p-2.5 text-center text-neutral-400">{s.pointsInHighValueModalities}</td>
                      <td className="p-2.5 text-right font-sans">
                        {s.needsManualResolution ? (
                          <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/30">
                            Empate Pendente de Decisão (Art. 28 VI)
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400">Critérios I-IV Definidos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Aprovação de Equipes */}
      {activeTab === 'equipes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white">{team.name}</h4>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {team.tag}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Capitão: <strong className="text-neutral-200">{team.captainName}</strong> • {team.captainContact}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold font-cyber uppercase ${
                      team.status === 'aprovada'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : team.status === 'recusada'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-400">Atletas</div>
                    <div className="font-mono font-bold text-white">{team.members.length} / 15</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">Modalidades</div>
                    <div className="font-mono font-bold text-white">{team.modalities.length} / 6</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">Financeiro</div>
                    <div className="font-mono font-bold text-amber-400">
                      R$ {team.totalPaid.toFixed(0)}/{team.totalFee.toFixed(0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                  <div className="text-[11px] text-neutral-400">
                    Ação da Coordenação Geral:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateTeamStatus(team.id, 'aprovada')}
                      className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold px-3 py-1 rounded-lg text-xs font-cyber transition cursor-pointer"
                    >
                      Aprovar Equipe
                    </button>
                    <button
                      onClick={() => updateTeamStatus(team.id, 'recusada')}
                      className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold px-3 py-1 rounded-lg text-xs font-cyber transition cursor-pointer"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: As 14 Modalidades & Diretores */}
      {activeTab === 'modalidades' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modalities.map((mod) => (
              <div
                key={mod.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm font-cyber">{mod.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {mod.category}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase font-cyber block">
                      Diretor(a) Responsável:
                    </label>
                    <input
                      type="text"
                      value={mod.responsibleDirectorName}
                      onChange={(e) =>
                        updateModalityConfig(mod.id, { responsibleDirectorName: e.target.value })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-1 px-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase font-cyber block">
                      WhatsApp / Contato do Diretor:
                    </label>
                    <input
                      type="text"
                      value={mod.directorContact}
                      onChange={(e) =>
                        updateModalityConfig(mod.id, { directorContact: e.target.value })
                      }
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-1 px-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase font-cyber block">
                        Local da Competição:
                      </label>
                      <input
                        type="text"
                        value={mod.venue}
                        onChange={(e) => updateModalityConfig(mod.id, { venue: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-1 px-2 text-xs text-white truncate"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase font-cyber block">
                        Datas Oficiais:
                      </label>
                      <input
                        type="text"
                        value={mod.dates}
                        onChange={(e) => updateModalityConfig(mod.id, { dates: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-1 px-2 text-xs text-white truncate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Sorteio das Coletivas */}
      {activeTab === 'sorteio' && (
        <div className="max-w-xl mx-auto bg-neutral-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 glow-gold-sm text-center">
          <div className="flex justify-center">
            <Shuffle className="w-10 h-10 text-amber-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              FERRAMENTA DE SORTEIO DAS MODALIDADES COLETIVAS (Art. 9º §5º)
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Data oficial do sorteio: <strong>05/11/2026</strong> pelo Instagram oficial da atlética: <a href="https://www.instagram.com/atleticacyborgues" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">@atleticacyborgues</a>. O sorteio define o chaveamento de semifinais e finais entre as equipes homologadas.
            </p>
          </div>

          <div className="text-left space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Selecione a Modalidade Coletiva:
            </label>
            <select
              value={selectedModalityForDraw}
              onChange={(e) => setSelectedModalityForDraw(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2.5 px-3 text-sm text-amber-400 font-bold focus:border-amber-400 focus:outline-none"
            >
              {modalities
                .filter((m) => m.category === 'coletiva')
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleDraw}
            disabled={isDrawing}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer font-cyber uppercase tracking-wider text-sm shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isDrawing ? 'Sorteando Confrontos...' : 'Realizar Sorteio dos Confrontos'}</span>
          </button>
        </div>
      )}

      {/* Tab 5: Controle Geral de Pagamentos */}
      {activeTab === 'pagamentos' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                CONTROLE DE REPASSE E HOMOLOGAÇÃO PIX (Art. 22 e 23)
              </h3>
              <p className="text-xs text-neutral-400 font-cyber">
                Chave PIX: aaa.cyborgues@gmail.com (Santander - Luys Arthur Serejo Alves).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px]">
                <tr>
                  <th className="p-2.5">Equipe</th>
                  <th className="p-2.5">Capitão Responsável</th>
                  <th className="p-2.5">Contato</th>
                  <th className="p-2.5 text-center">Atletas Inscritos</th>
                  <th className="p-2.5 text-center">Total Devido</th>
                  <th className="p-2.5 text-center">Total Confirmado</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-right">Ação Diretoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/30">
                    <td className="p-2.5 font-sans font-bold text-white">{t.name}</td>
                    <td className="p-2.5 font-sans text-neutral-300">{t.captainName}</td>
                    <td className="p-2.5 text-neutral-400">{t.captainContact}</td>
                    <td className="p-2.5 text-center">{t.members.length}</td>
                    <td className="p-2.5 text-center text-amber-400 font-bold">R$ {t.totalFee.toFixed(2)}</td>
                    <td className="p-2.5 text-center text-emerald-400 font-bold">R$ {t.totalPaid.toFixed(2)}</td>
                    <td className="p-2.5 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-cyber ${
                          t.paymentStatus === 'pago'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-sans">
                      <button
                        onClick={() => updateTeamPayment(t.id, t.paymentStatus === 'pago' ? 'pendente' : 'pago')}
                        className="bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-bold px-2.5 py-1 rounded-lg text-xs font-cyber transition cursor-pointer"
                      >
                        {t.paymentStatus === 'pago' ? 'Marcar Pendente' : 'Confirmar Pagamento'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Publicar Comunicados */}
      {activeTab === 'comunicados' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <span>NOVO COMUNICADO OFICIAL DA DIRETORIA GERAL</span>
            </h3>

            <form onSubmit={handleAddNotice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Título do Aviso *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="Ex: Prorrogação de inscrições, alteração de local..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Prioridade</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e: any) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-cyber"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Conteúdo do Comunicado *</label>
                <textarea
                  required
                  rows={3}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Texto oficial do aviso..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold py-2 px-5 rounded-xl text-xs font-cyber transition cursor-pointer"
              >
                Publicar no Mural Público
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase font-cyber">Comunicados Ativos:</h4>
            {notices.map((n) => (
              <div key={n.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-cyber uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                      {n.priority}
                    </span>
                    <span className="text-xs font-bold text-white">{n.title}</span>
                  </div>
                  <p className="text-xs text-neutral-300">{n.content}</p>
                </div>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="text-neutral-500 hover:text-red-400 p-1"
                  title="Excluir comunicado"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Dados Reais (Importar / Preparar) */}
      {activeTab === 'dados_reais' && (
        <div className="space-y-6">
          <div className="bg-neutral-900/80 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 glow-gold-sm">
            <div className="border-b border-neutral-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>PREPARAR & CARREGAR DADOS REAIS DO V INTERNERD</span>
                </h3>
                <p className="text-xs text-neutral-300 font-cyber mt-1">
                  O sistema está 100% pronto para receber os dados oficiais de equipes, atletas, modalidades, jogos e súmulas.
                </p>
              </div>

              <button
                onClick={() => {
                  const template = {
                    teams: teams.slice(0, 1),
                    matches: matches.slice(0, 2),
                    placements: placements.slice(0, 2),
                    notices: notices.slice(0, 1),
                  };
                  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'modelo_dados_reais_vinternerd.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs font-cyber flex items-center gap-2 transition cursor-pointer self-start"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Baixar Modelo JSON</span>
              </button>
            </div>

            {importStatus && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                  importStatus.success
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/60 border border-red-500/50 text-red-200'
                }`}
              >
                {importStatus.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}

            {/* Ingestion options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option A: Upload JSON */}
              <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-cyber flex items-center gap-2">
                  <span>Opção 1: Upload de Arquivo .JSON</span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Carregue um arquivo JSON gerado com os dados oficiais dos inscritos e confrontos.
                </p>

                <label className="block p-4 border-2 border-dashed border-neutral-700 hover:border-amber-400 rounded-xl text-center cursor-pointer transition bg-neutral-900/50">
                  <span className="text-xs text-neutral-300 block font-medium">Clique para selecionar arquivo .json</span>
                  <span className="text-[10px] text-neutral-500 font-cyber">Formatos suportados: UTF-8 JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const parsed = JSON.parse(ev.target?.result as string);
                          const res = importAllData(parsed);
                          setImportStatus(res);
                        } catch (err: any) {
                          setImportStatus({ success: false, message: 'JSON inválido: ' + err.message });
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              {/* Option B: Clean slate */}
              <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-cyber flex items-center gap-2">
                  <span>Opção 2: Zerar Dados Demo</span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Limpa todas as equipes, jogos e resultados de teste para deixar a plataforma 100% limpa para cadastro manual ou novas inscrições reais.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza? Isso apagará as equipes e jogos demo, mantendo as 14 modalidades configuradas e o login administrativo.')) {
                      clearDemoData();
                      setImportStatus({ success: true, message: 'Base limpa com sucesso! O sistema está pronto para receber cadastros reais.' });
                    }
                  }}
                  className="w-full bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-500/40 font-bold py-3 px-4 rounded-xl text-xs font-cyber transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Limpar Dados de Teste (Zerar Base)</span>
                </button>
              </div>
            </div>

            {/* Paste JSON directly */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <label className="block text-xs font-bold text-neutral-300 font-cyber">
                Ou Cole os Dados Reais em JSON diretamente abaixo:
              </label>
              <textarea
                rows={5}
                value={realDataJsonInput}
                onChange={(e) => setRealDataJsonInput(e.target.value)}
                placeholder='{ "teams": [...], "matches": [...] }'
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(realDataJsonInput);
                    const res = importAllData(parsed);
                    setImportStatus(res);
                  } catch (err: any) {
                    setImportStatus({ success: false, message: 'Erro de sintaxe JSON: ' + err.message });
                  }
                }}
                disabled={!realDataJsonInput.trim()}
                className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-xl text-xs font-cyber transition cursor-pointer"
              >
                Importar JSON Colado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Acessos & Credenciais (Hierarquia Oficial) */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-heading text-white">
                  GESTÃO HIERÁRQUICA DE ACESSOS E CREDENCIAIS
                </h3>
              </div>
              <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                A Diretoria Geral provisiona os logins e senhas para Diretores de Modalidade e Capitães de Equipe. Os atletas são inscritos pelos capitães. Após a criação, <strong>a senha pode ser editada pelo usuário, mas o nome de usuário (login) é estritamente imutável</strong>.
              </p>
            </div>
            <div className="bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-xl text-right shrink-0">
              <span className="text-[10px] text-neutral-400 uppercase font-cyber block">Total de Usuários</span>
              <span className="text-xl font-bold font-mono text-amber-400">{users.length}</span>
            </div>
          </div>

          {userActionMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                userActionMsg.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/70 border-red-500/50 text-red-200'
              }`}
            >
              {userActionMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{userActionMsg.message}</span>
            </div>
          )}

          {/* Cards dos Dois Diretores Gerais Oficiais */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase font-cyber mb-2 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>Diretores Gerais Oficiais (Acesso Total)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-heading">Caio Cruz</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-cyber uppercase">
                    Diretoria Geral
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono space-y-0.5">
                  <div>Usuário: <strong className="text-amber-400">Caiocruz</strong> (Imutável)</div>
                  <div className="text-[11px] text-emerald-400 font-cyber">● Acesso de Administrador Ativo</div>
                  <div className="text-[11px] text-neutral-500">caiocruz@cyborgues.uema.br</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-heading">Luys Arthur Serejo Alves</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-cyber uppercase">
                    Diretoria Geral & PIX
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono space-y-0.5">
                  <div>Usuário: <strong className="text-amber-400">Luisarthur</strong> (Imutável)</div>
                  <div className="text-[11px] text-emerald-400 font-cyber">● Acesso de Administrador Ativo</div>
                  <div className="text-[11px] text-neutral-500">aaa.cyborgues@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Duas Colunas: Formulários para Criar Diretor e Capitão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form: Criar Diretor de Modalidade */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">CADASTRAR DIRETOR DE MODALIDADE</h4>
                  <p className="text-[11px] text-neutral-400">Provisionar login para gerenciar uma modalidade</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setUserActionMsg(null);
                  const selectedMod = modalities.find((m) => m.id === newDirectorForm.modalityId);
                  const res = adminCreateUser({
                    name: newDirectorForm.name,
                    username: newDirectorForm.username,
                    password: newDirectorForm.password,
                    email: `${newDirectorForm.username.toLowerCase()}@cyborgues.uema.br`,
                    role: 'diretor',
                    assignedModalities: [newDirectorForm.modalityId],
                    phone: newDirectorForm.phone,
                  });

                  if (res.success) {
                    if (selectedMod) {
                      assignModalityDirector(
                        newDirectorForm.modalityId,
                        'user-dir-' + newDirectorForm.username,
                        newDirectorForm.name,
                        newDirectorForm.phone || '(98) 98888-0000'
                      );
                    }
                    setUserActionMsg({
                      type: 'success',
                      message: `Diretor "${newDirectorForm.name}" criado! Usuário: ${newDirectorForm.username} | Senha inicial: ${newDirectorForm.password}`,
                    });
                    setNewDirectorForm({ name: '', username: '', password: '@Cyborgues2026', modalityId: 'futsal', phone: '' });
                  } else {
                    setUserActionMsg({ type: 'error', message: res.error || 'Erro ao criar diretor.' });
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newDirectorForm.name}
                    onChange={(e) => setNewDirectorForm({ ...newDirectorForm, name: e.target.value })}
                    placeholder="Ex: Beatriz Mendes"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Usuário / Login *</label>
                    <input
                      type="text"
                      required
                      value={newDirectorForm.username}
                      onChange={(e) => setNewDirectorForm({ ...newDirectorForm, username: e.target.value.replace(/\s+/g, '') })}
                      placeholder="Ex: beatrizmendes"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Senha Inicial *</label>
                    <input
                      type="text"
                      required
                      value={newDirectorForm.password}
                      onChange={(e) => setNewDirectorForm({ ...newDirectorForm, password: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Modalidade Atribuída *</label>
                    <select
                      value={newDirectorForm.modalityId}
                      onChange={(e) => setNewDirectorForm({ ...newDirectorForm, modalityId: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-2 text-xs text-white focus:outline-none"
                    >
                      {modalities.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp / Contato</label>
                    <input
                      type="text"
                      value={newDirectorForm.phone}
                      onChange={(e) => setNewDirectorForm({ ...newDirectorForm, phone: e.target.value })}
                      placeholder="(98) 9XXXX-XXXX"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded-xl transition text-xs font-cyber uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Acesso de Diretor</span>
                </button>
              </form>
            </div>

            {/* Form: Criar Capitão de Equipe */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">CADASTRAR CAPITÃO DE EQUIPE</h4>
                  <p className="text-[11px] text-neutral-400">Provisionar login para gerenciar e inscrever atletas</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setUserActionMsg(null);
                  const res = adminCreateUser({
                    name: newCaptainForm.name,
                    username: newCaptainForm.username,
                    password: newCaptainForm.password,
                    email: `${newCaptainForm.username.toLowerCase()}@aluno.uema.br`,
                    role: 'capitao',
                    teamName: newCaptainForm.teamName,
                    matricula: newCaptainForm.matricula,
                    phone: newCaptainForm.phone,
                  });

                  if (res.success) {
                    setUserActionMsg({
                      type: 'success',
                      message: `Capitão "${newCaptainForm.name}" criado! Usuário: ${newCaptainForm.username} | Equipe: ${newCaptainForm.teamName}`,
                    });
                    setNewCaptainForm({ name: '', username: '', password: '@Cyborgues2026', teamName: '', matricula: '', phone: '' });
                  } else {
                    setUserActionMsg({ type: 'error', message: res.error || 'Erro ao criar capitão.' });
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome do Capitão *</label>
                  <input
                    type="text"
                    required
                    value={newCaptainForm.name}
                    onChange={(e) => setNewCaptainForm({ ...newCaptainForm, name: e.target.value })}
                    placeholder="Ex: Matheus Alencar"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Usuário / Login *</label>
                    <input
                      type="text"
                      required
                      value={newCaptainForm.username}
                      onChange={(e) => setNewCaptainForm({ ...newCaptainForm, username: e.target.value.replace(/\s+/g, '') })}
                      placeholder="Ex: matheusalencar"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Senha Inicial *</label>
                    <input
                      type="text"
                      required
                      value={newCaptainForm.password}
                      onChange={(e) => setNewCaptainForm({ ...newCaptainForm, password: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome da Equipe *</label>
                    <input
                      type="text"
                      required
                      value={newCaptainForm.teamName}
                      onChange={(e) => setNewCaptainForm({ ...newCaptainForm, teamName: e.target.value })}
                      placeholder="Ex: Kernel Panic FC"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Matrícula UEMA</label>
                    <input
                      type="text"
                      value={newCaptainForm.matricula}
                      onChange={(e) => setNewCaptainForm({ ...newCaptainForm, matricula: e.target.value })}
                      placeholder="20241502010"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-400 text-black font-bold py-2.5 rounded-xl transition text-xs font-cyber uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Acesso de Capitão</span>
                </button>
              </form>
            </div>
          </div>

          {/* Tabela de Todos os Usuários e Credenciais */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 space-y-4">
            <h4 className="text-sm font-bold font-heading text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>RELAÇÃO OFICIAL DE USUÁRIOS E CREDENCIAIS ({users.length})</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="p-3">Usuário (Imutável)</th>
                    <th className="p-3">Nome do Titular</th>
                    <th className="p-3">Perfil</th>
                    <th className="p-3">Vínculo (Equipe / Modalidades)</th>
                    <th className="p-3">Senha Atual</th>
                    <th className="p-3 text-right">Ação Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-neutral-800/30">
                      <td className="p-3 font-mono font-bold text-amber-300">
                        {u.username || u.email.split('@')[0]}
                      </td>
                      <td className="p-3 font-medium text-white">{u.name}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-cyber ${
                            u.role === 'admin'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                              : u.role === 'capitao'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : u.role === 'diretor'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          {u.role === 'admin' ? 'Diretoria Geral' : u.role === 'capitao' ? 'Capitão' : u.role === 'diretor' ? 'Diretor' : 'Atleta'}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400 max-w-[200px] truncate">
                        {u.teamName
                          ? `Equipe: ${u.teamName}`
                          : u.assignedModalities && u.assignedModalities.length > 0
                          ? `Modalidades: ${u.assignedModalities.join(', ')}`
                          : '-'}
                      </td>
                      <td className="p-3 font-mono text-neutral-500 tracking-widest text-xs">
                        ••••••••
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const newPass = prompt(`Digite a nova senha para ${u.name} (usuário: ${u.username}):`, '@Cyborgues2026');
                            if (newPass && newPass.length >= 6) {
                              adminResetUserPassword(u.uid, newPass);
                              alert(`Senha do usuário ${u.username} redefinida com sucesso!`);
                            }
                          }}
                          className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[11px] font-cyber transition cursor-pointer"
                        >
                          Redefinir Senha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
};
