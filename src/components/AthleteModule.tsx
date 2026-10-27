import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  User,
  Search,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  Copy,
  Check,
  Award,
  Lock,
} from 'lucide-react';
import { calculateAthleteFee, PIX_PAYMENT_INFO } from '../utils/rules';

export const AthleteModule: React.FC = () => {
  const { currentUser, teams, modalities, matches } = useTournament();

  const [searchQuery, setSearchQuery] = useState(currentUser?.matricula || '');
  const [copiedPix, setCopiedPix] = useState(false);

  // Coleta todos os atletas de todas as equipes
  const allEnrolledAthletes = teams.flatMap((team) =>
    team.members.map((member) => ({
      ...member,
      teamId: team.id,
      teamName: team.name,
      teamTag: team.tag,
      captainName: team.captainName,
      captainContact: team.captainContact,
      teamStatus: team.status,
    }))
  );

  const filteredAthletes = allEnrolledAthletes.filter((ath) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      ath.athleteName.toLowerCase().includes(q) ||
      ath.matricula.toLowerCase().includes(q) ||
      ath.teamName.toLowerCase().includes(q)
    );
  });

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_PAYMENT_INFO.key);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Module Header */}
      <div className="rounded-3xl bg-neutral-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-cyber font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Módulo A • Consulta & Ficha do Atleta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            CONSULTA DE INSCRIÇÃO DO ATLETA
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Consulte sua inscrição oficial, equipe vinculada e modalidades cadastradas no V INTERNERD 2026.
          </p>
        </div>

        {currentUser && (
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-right text-xs space-y-1">
            <div className="text-neutral-400 font-cyber">Conectado como:</div>
            <div className="font-bold text-amber-300 font-mono text-sm">{currentUser.name}</div>
            <div className="text-[11px] text-neutral-400">
              Usuário: <span className="font-mono text-neutral-300">{currentUser.username || currentUser.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Official Rule Notice: Athletes Do NOT Self-Register */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-start gap-3.5 text-amber-200">
        <Lock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h3 className="font-bold font-cyber text-amber-300 uppercase tracking-wide text-sm">
            REGRA OFICIAL: INSCRIÇÕES CENTRALIZADAS PELOS CAPITÃES (Art. 17 e 23)
          </h3>
          <p className="leading-relaxed text-neutral-300">
            Conforme determinado pelo Regulamento Oficial do V INTERNERD, <strong className="text-white">os atletas não realizam auto-inscrição individual no sistema</strong>. Todas as inscrições de atletas são realizadas exclusivamente pelo <strong className="text-amber-300">Capitão da sua Equipe</strong>. Se você é atleta e ainda não consta na lista, solicite sua inclusão ao capitão da sua equipe.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>LOCALIZAR MINHA INSCRIÇÃO</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Digite seu nome, número de matrícula da UEMA ou o nome da sua equipe.
            </p>
          </div>

          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por matrícula (ex: 20241502045) ou nome..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-neutral-500 font-cyber flex justify-between items-center border-t border-neutral-800 pt-3">
          <span>{filteredAthletes.length} atleta(s) cadastrado(s) no campeonato</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline cursor-pointer text-[11px]"
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* Athletes List */}
        {filteredAthletes.length === 0 ? (
          <div className="p-8 text-center bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2">
            <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300">Nenhum atleta encontrado com os dados informados.</p>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Verifique a matrícula digitada ou solicite ao capitão da sua equipe que realize o seu cadastro no Painel do Capitão.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredAthletes.map((ath) => {
              const athleteFee = calculateAthleteFee(ath.modalities.length);
              const athleteMatches = matches.filter((m) => ath.modalities.includes(m.modalityId));

              return (
                <div
                  key={`${ath.teamId}-${ath.athleteId}`}
                  className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 transition space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base font-heading">
                          {ath.athleteName}
                        </h3>
                        {ath.isCaptain && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-cyber font-bold border border-amber-500/30">
                            Capitão
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Matrícula: <strong className="text-neutral-200">{ath.matricula}</strong> • {ath.turma}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase font-cyber px-2.5 py-1 rounded border shrink-0 ${
                        ath.paymentStatus === 'pago'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {ath.paymentStatus === 'pago' ? 'Taxa Paga' : 'Pagamento Pendente'}
                    </span>
                  </div>

                  {/* Team Info */}
                  <div className="p-3 bg-neutral-900/80 rounded-xl border border-neutral-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Equipe Vinculada:</span>
                      <span className="font-bold text-amber-400">{ath.teamName} ({ath.teamTag})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Representante / Capitão:</span>
                      <span className="text-neutral-300">{ath.captainName}</span>
                    </div>
                  </div>

                  {/* Modalities */}
                  <div>
                    <div className="text-[11px] font-bold text-neutral-400 uppercase font-cyber mb-1.5 flex items-center justify-between">
                      <span>Modalidades Inscritas ({ath.modalities.length}):</span>
                      <span className="text-amber-400 font-mono font-bold">R$ {athleteFee.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ath.modalities.map((modId) => {
                        const modItem = modalities.find((m) => m.id === modId);
                        return (
                          <span
                            key={modId}
                            className="bg-neutral-900 px-2.5 py-1 rounded-lg text-[11px] text-neutral-300 border border-neutral-800 flex items-center gap-1 font-cyber"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{modItem ? modItem.name : modId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Matches preview */}
                  {athleteMatches.length > 0 && (
                    <div className="border-t border-neutral-800 pt-2 text-[11px] text-neutral-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{athleteMatches.length} partida(s) programada(s)</span>
                      </span>
                      <span className="text-amber-400/80 font-cyber">Ver na Tabela de Jogos &rarr;</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment & Centralization Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>PAGAMENTO DA TAXA (Art. 22 e 23)</span>
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            A taxa de inscrição é de <strong className="text-amber-300">R$ 5,00 por modalidade</strong>.
            Lembre-se: os atletas repassam o valor da sua taxa diretamente ao <strong className="text-white">Capitão da sua equipe</strong>. O capitão reúne os valores de todos os atletas e efetua a transferência do total para a organização.
          </p>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1 text-xs">
            <div className="text-neutral-400 font-cyber">Chave PIX Oficial da Atlética:</div>
            <div className="flex items-center justify-between bg-neutral-900 p-2 rounded-lg border border-neutral-700">
              <span className="font-mono text-amber-400 font-bold truncate mr-2">{PIX_PAYMENT_INFO.key}</span>
              <button
                type="button"
                onClick={copyPix}
                className="p-1 text-neutral-300 hover:text-white shrink-0 cursor-pointer"
                title="Copiar PIX"
              >
                {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[10px] text-neutral-500 pt-1">
              {PIX_PAYMENT_INFO.bank} • Titular: <strong>{PIX_PAYMENT_INFO.holder}</strong> (Diretoria Geral)
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>REQUISITOS DO ATLETA (Art. 11 e 24)</span>
          </h3>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Estar regularmente matriculado em Engenharia de Computação na UEMA no semestre do campeonato.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Apresentar documento oficial com foto e comprovante de matrícula quando solicitado pela arbitragem.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Representação única: é expressamente vedado disputar modalidades por mais de uma equipe (Art. 13).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
