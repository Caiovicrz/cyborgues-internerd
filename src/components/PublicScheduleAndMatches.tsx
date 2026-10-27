import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  Printer,
  X,
  CheckCircle,
} from 'lucide-react';
import { Match } from '../types/tournament';
import { printMatchSumula } from '../utils/exportHelpers';

export const PublicScheduleAndMatches: React.FC = () => {
  const { matches, modalities } = useTournament();
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'agendado' | 'finalizado'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMatch, setActiveModalMatch] = useState<Match | null>(null);

  const filteredMatches = matches.filter((m) => {
    if (selectedModality !== 'all' && m.modalityId !== selectedModality) return false;
    if (selectedPhase !== 'all' && m.phase !== selectedPhase) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.teamAName} ${m.teamBName} ${m.athleteAName || ''} ${m.athleteBName || ''} ${m.modalityName} ${m.venue}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const phases = Array.from(new Set(matches.map((m) => m.phase)));

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-white">
            TABELA OFICIAL DE JOGOS & CALENDÁRIO
          </h1>
          <p className="text-xs text-neutral-400 font-cyber">
            Acompanhe partidas, horários, locais e resultados oficiais do V INTERNERD 2026.
          </p>
        </div>
        <div className="text-xs bg-amber-400/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl font-cyber flex items-center gap-1.5 self-start">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Tolerância geral: 15 min (Vôlei e Sinuca: 10 min)</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por equipe, atleta, local..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">Todas as 14 Modalidades</option>
              {modalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>

            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">Todas as Fases</option>
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-xl p-0.5 text-xs font-cyber">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('agendado')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === 'agendado' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Agendados
              </button>
              <button
                onClick={() => setStatusFilter('finalizado')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === 'finalizado' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400'
                }`}
              >
                Finalizados
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800">
          <Calendar className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
          <p className="text-neutral-400 text-sm">Nenhuma partida encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => {
            const isFinished = match.status === 'finalizado';
            return (
              <div
                key={match.id}
                className="bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 transition space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-cyber text-amber-400">{match.modalityName}</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-300">{match.phase}</span>
                    {match.roundName && <span className="text-neutral-500 font-mono text-[11px]">({match.roundName})</span>}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-cyber ${
                      isFinished
                        ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {isFinished ? 'Finalizado' : 'Agendado'}
                  </span>
                </div>

                {/* Scoreboard */}
                <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800/80 flex items-center justify-between">
                  {/* Team A */}
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm text-white truncate">{match.teamAName}</div>
                    {match.athleteAName && (
                      <div className="text-[11px] text-neutral-400 truncate">Atleta: {match.athleteAName}</div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="px-4 text-center shrink-0">
                    {isFinished ? (
                      <div className="flex items-center gap-2 font-mono text-xl font-black text-amber-400">
                        <span>{match.scoreA ?? 0}</span>
                        <span className="text-neutral-600 font-normal">x</span>
                        <span>{match.scoreB ?? 0}</span>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-neutral-500 uppercase font-cyber">vs</div>
                    )}
                    {match.isWO && (
                      <span className="block text-[10px] text-red-400 font-bold uppercase font-cyber mt-0.5">
                        Vitória W.O. ({match.woWinner})
                      </span>
                    )}
                  </div>

                  {/* Team B */}
                  <div className="flex-1 text-right">
                    <div className="font-bold text-sm text-white truncate">{match.teamBName}</div>
                    {match.athleteBName && (
                      <div className="text-[11px] text-neutral-400 truncate">Atleta: {match.athleteBName}</div>
                    )}
                  </div>
                </div>

                {/* Meta details & Súmula Button */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2 pt-1 border-t border-neutral-800/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{match.date} às {match.time}</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{match.venue}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveModalMatch(match)}
                    className="text-amber-400 hover:text-amber-300 font-cyber font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Ver Súmula</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Súmula Detail Modal */}
      {activeModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-neutral-100">
            <button
              onClick={() => setActiveModalMatch(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded font-cyber uppercase">
                Súmula Oficial
              </span>
              <span className="text-xs text-neutral-400 font-mono">ID: {activeModalMatch.id}</span>
            </div>

            <h3 className="text-lg font-bold text-white font-heading mb-1">
              {activeModalMatch.modalityName} – {activeModalMatch.phase}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              {activeModalMatch.date} às {activeModalMatch.time} • Local: {activeModalMatch.venue}
            </p>

            <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 text-center mb-4">
              <div className="text-xs text-neutral-400 mb-1">{activeModalMatch.teamAName} vs {activeModalMatch.teamBName}</div>
              <div className="text-3xl font-black font-mono text-amber-400">
                {activeModalMatch.scoreA !== null ? activeModalMatch.scoreA : '-'} :{' '}
                {activeModalMatch.scoreB !== null ? activeModalMatch.scoreB : '-'}
              </div>
              {activeModalMatch.isWO && (
                <div className="text-xs text-red-400 font-bold uppercase mt-1">
                  Decidido por W.O. • Vencedor Oficial: {activeModalMatch.woWinner}
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase font-cyber mb-1">
                  Relatório da Partida & Gols/Pontos:
                </h4>
                <p className="text-xs text-neutral-300 bg-neutral-950/70 p-3 rounded-lg border border-neutral-800">
                  {activeModalMatch.sumulaDetails || 'Nenhum detalhe adicional de súmula inserido.'}
                </p>
              </div>

              {activeModalMatch.notes && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-300 uppercase font-cyber mb-1">Observações Técnicas:</h4>
                  <p className="text-xs text-neutral-400 bg-neutral-950/70 p-3 rounded-lg border border-neutral-800">
                    {activeModalMatch.notes}
                  </p>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                <strong>Regra de Tolerância (Art. 30 e 61):</strong> {activeModalMatch.toleranceMinutes} minutos tolerados para comparecimento antes da decretação de W.O.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                onClick={() => printMatchSumula(activeModalMatch)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-cyber flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Imprimir Súmula</span>
              </button>

              <button
                onClick={() => setActiveModalMatch(null)}
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-xl text-xs font-cyber transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
