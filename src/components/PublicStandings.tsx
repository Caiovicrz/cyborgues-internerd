import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Award,
  Medal,
  ChevronRight,
  Sparkles,
  Info,
  ShieldAlert,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicStandings: React.FC = () => {
  const { standings, placements, modalities, incidents, teams } = useTournament();
  const [selectedModalityId, setSelectedModalityId] = useState<string>('all');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#facc15', '#ffffff', '#000000'],
    });
  };

  const currentLeader = standings[0];

  const filteredPlacements =
    selectedModalityId === 'all'
      ? placements
      : placements.filter((p) => p.modalityId === selectedModalityId);

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-neutral-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-cyber font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Classificação Geral Oficial • Art. 25 a 28</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            QUADRO GERAL DE PONTUAÇÃO & MEDALHAS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Soma dos pontos acumulados em todas as 14 modalidades. Desempate automático pelos critérios I a IV do Art. 28 do regulamento oficial.
          </p>
        </div>

        {currentLeader && (
          <div className="flex flex-col items-center bg-neutral-950 p-4 rounded-2xl border border-amber-400/40 text-center shrink-0">
            <span className="text-[10px] font-cyber uppercase tracking-wider text-amber-400 font-bold mb-1">
              🏆 LÍDER ATUAL DO V INTERNERD
            </span>
            <div className="text-xl font-heading font-black text-white">{currentLeader.teamName}</div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">
              {currentLeader.totalPoints} <span className="text-xs text-neutral-400 font-normal">PONTOS</span>
            </div>
            <button
              onClick={triggerConfetti}
              className="mt-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-3 py-1.5 rounded-lg font-cyber transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comemorar</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Standings Table */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>TABELA GERAL DAS EQUIPES</span>
            </h2>
            <p className="text-xs text-neutral-400 font-cyber">
              Ordenada por Pontos e Critérios Oficiais de Desempate (Art. 28)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 font-cyber uppercase text-[11px] border-b border-neutral-800">
              <tr>
                <th className="p-3">Posição</th>
                <th className="p-3">Equipe</th>
                <th className="p-3 text-center text-amber-400 font-bold">Total Pts</th>
                <th className="p-3 text-center" title="Critério I: Mais 1ºs lugares">1ºs (Ouro)</th>
                <th className="p-3 text-center" title="Critério II: Mais 2ºs lugares">2ºs (Prata)</th>
                <th className="p-3 text-center" title="Critério III: Mais 3ºs lugares">3ºs (Bronze)</th>
                <th className="p-3 text-center" title="Critério IV: Mais 1ºs lugares em coletivas">1ºs Coletivas</th>
                <th className="p-3 text-center" title="Critério V: Pontos em modalidades de maior valor">Pts Maior Valor</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {standings.map((team, idx) => {
                const pos = idx + 1;
                const isChampion = pos === 1;
                return (
                  <tr
                    key={team.teamId}
                    className={`transition hover:bg-neutral-800/40 ${
                      isChampion ? 'bg-amber-400/5' : ''
                    }`}
                  >
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-2">
                        {pos === 1 && <Medal className="w-4 h-4 text-amber-400" />}
                        {pos === 2 && <Medal className="w-4 h-4 text-neutral-300" />}
                        {pos === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                        {pos > 3 && <span className="text-neutral-500 font-mono pl-1">{pos}º</span>}
                        {pos <= 3 && <span>{pos}º</span>}
                      </div>
                    </td>
                    <td className="p-3 font-sans font-bold text-white text-sm">
                      <div className="flex items-center gap-2">
                        <span>{team.teamName}</span>
                        {isChampion && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-cyber">
                            Líder
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center text-base font-black text-amber-400 bg-neutral-950/40">
                      {team.totalPoints}
                    </td>
                    <td className="p-3 text-center text-amber-300 font-bold">{team.firstPlacesCount}</td>
                    <td className="p-3 text-center text-neutral-300">{team.secondPlacesCount}</td>
                    <td className="p-3 text-center text-amber-600">{team.thirdPlacesCount}</td>
                    <td className="p-3 text-center text-blue-400">{team.collectiveFirstPlacesCount}</td>
                    <td className="p-3 text-center text-neutral-400">{team.pointsInHighValueModalities}</td>
                    <td className="p-3 text-right font-sans">
                      {team.needsManualResolution ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-cyber text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Empate Manual (Art. 28 VI)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-500 font-cyber">Classificada</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tie breaker note */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-300 font-cyber">
            Critérios Oficiais de Desempate (Art. 28 do Regulamento):
          </p>
          <p>
            I. Maior nº de 1ºs lugares &bull; II. Maior nº de 2ºs &bull; III. Maior nº de 3ºs &bull; IV. Maior nº de 1ºs lugares em modalidades coletivas &bull; V. Maior pontuação em modalidades de maior valor (Futsal, Vôlei, LoL, Valorant) &bull; VI. Decisão manual pela Coordenação Geral.
          </p>
        </div>
      </section>

      {/* Podiums by Modality Breakdown */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>COLOCAÇÕES POR MODALIDADE</span>
            </h2>
            <p className="text-xs text-neutral-400 font-cyber">
              Resultados homologados que compõem a pontuação geral das equipes.
            </p>
          </div>

          {/* Filter */}
          <select
            value={selectedModalityId}
            onChange={(e) => setSelectedModalityId(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
          >
            <option value="all">Todas as Modalidades ({modalities.length})</option>
            {modalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modalities
            .filter((m) => selectedModalityId === 'all' || m.id === selectedModalityId)
            .map((mod) => {
              const modPlacements = placements
                .filter((p) => p.modalityId === mod.id)
                .sort((a, b) => a.placement - b.placement);

              return (
                <div
                  key={mod.id}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="font-bold text-sm text-white font-cyber">{mod.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-cyber ${
                        mod.category === 'coletiva'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {mod.category}
                    </span>
                  </div>

                  {modPlacements.length === 0 ? (
                    <div className="py-4 text-center text-xs text-neutral-500 font-cyber">
                      Aguardando encerramento das disputas
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {modPlacements.map((plc) => (
                        <div
                          key={plc.id}
                          className="flex items-center justify-between text-xs bg-neutral-950 p-2 rounded-xl border border-neutral-800/80"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                plc.placement === 1
                                  ? 'bg-amber-400 text-black'
                                  : plc.placement === 2
                                  ? 'bg-neutral-300 text-black'
                                  : plc.placement === 3
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {plc.placement}º
                            </span>
                            <div>
                              <div className="font-bold text-white">{plc.teamName}</div>
                              {plc.athleteName && (
                                <div className="text-[10px] text-neutral-400">{plc.athleteName}</div>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px]">
                            +{plc.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* Disciplinary Register Transparency (Art. 32-35) */}
      {incidents.length > 0 && (
        <section className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold font-heading text-white">
              TRANSPARÊNCIA DISCIPLINAR (Art. 32 a 35)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-cyber">
            Registro público de cartões, advertências e decisões da Coordenação de Arbitragem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">{inc.modalityName}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{inc.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold font-cyber uppercase">
                    {inc.type.replace('_', ' ')}
                  </span>
                  <span className="text-white font-semibold">
                    {inc.targetName} ({inc.teamName})
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px]">{inc.reason}</p>
                <div className="text-[10px] text-amber-400/90 pt-1 border-t border-neutral-800/80">
                  Penalidade: {inc.penalty} (Relatado por: {inc.reportedBy})
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
