import React from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Download,
  Pin,
  CheckCircle2,
  DollarSign,
  Shield,
  Instagram,
} from 'lucide-react';
import { CyborgLogo } from './CyborgLogo';

interface PublicHomeProps {
  setActiveTab: (tab: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ setActiveTab }) => {
  const { modalities, teams, matches, notices } = useTournament();

  const finishedMatches = matches.filter((m) => m.status === 'finalizado');
  const totalAthletes = teams.reduce((acc, t) => acc + t.members.length, 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-neutral-900 via-neutral-950 to-black border border-amber-500/30 p-8 sm:p-12 lg:p-16 glow-gold">
        {/* Cyber grid background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080d_1px,transparent_1px),linear-gradient(to_bottom,#eab3080d_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Main Official Emblem */}
          <div className="flex justify-center">
            <CyborgLogo size="xl" className="hover:scale-105 transition-transform" />
          </div>

          {/* Badge with the Atlética Logo (Emoji Removed as Requested) */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold font-cyber uppercase tracking-wider shadow-sm">
            <img
              src="/assets/aistudio/image_1__114eeea8.png"
              alt="Atlética Cyborgues"
              className="w-5 h-5 object-contain"
            />
            <span>Campeonato Interno Oficial • Engenharia de Computação UEMA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white uppercase">
            V INTER<span className="text-amber-400">NERD</span>
            <span className="block text-2xl sm:text-3xl text-neutral-300 font-cyber font-normal mt-2">
              CYBORGUES 2026
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            O maior evento esportivo e eletrônico da Engenharia de Computação da Universidade Estadual do Maranhão.
            14 modalidades disputadas no Campus Paulo VI – São Luís/MA.
          </p>

          {/* Quick Date and Location Tag in Brazilian Format dd/mm/aaaa */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs sm:text-sm text-neutral-200 font-cyber">
            <div className="flex items-center gap-2 bg-neutral-900/90 px-3.5 py-2 rounded-xl border border-neutral-800">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>31/10/2026 a 06/11/2026</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900/90 px-3.5 py-2 rounded-xl border border-neutral-800">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Campus Paulo VI – UEMA São Luís</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900/90 px-3.5 py-2 rounded-xl border border-neutral-800">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Taxa: R$ 5,00 por modalidade</span>
            </div>
            <a
              href="https://www.instagram.com/atleticacyborgues"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 px-3.5 py-2 rounded-xl border border-amber-500/40 transition"
            >
              <Instagram className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sorteio: 05/11/2026 no Instagram @atleticacyborgues</span>
            </a>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('modulo-atleta')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer font-cyber uppercase tracking-wider text-sm"
            >
              <span>Inscrever como Atleta</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('modulo-capitao')}
              className="bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer font-cyber uppercase tracking-wider text-sm"
            >
              <Users className="w-4 h-4" />
              <span>Registrar Equipe</span>
            </button>

            <button
              onClick={() => setActiveTab('classificacao')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-semibold px-5 py-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer font-cyber text-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Classificação Geral</span>
            </button>

            <a
              href="/assets/aistudio/REGULAMENTO_OFICIAL_V_INTERNERD_2026-3_89e291d9.pdf"
              download
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-medium px-4 py-3.5 rounded-xl transition flex items-center gap-2 text-sm"
              title="Baixar Regulamento Oficial PDF"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Regulamento (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black font-heading text-amber-400">{modalities.length}</div>
          <div className="text-xs uppercase font-cyber text-neutral-400 mt-1">Modalidades (6 Coletivas + 8 Individuais)</div>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black font-heading text-amber-400">{teams.length}</div>
          <div className="text-xs uppercase font-cyber text-neutral-400 mt-1">Equipes Oficiais Registradas</div>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black font-heading text-amber-400">{totalAthletes}</div>
          <div className="text-xs uppercase font-cyber text-neutral-400 mt-1">Atletas da Eng. de Computação</div>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 text-center">
          <div className="text-3xl font-black font-heading text-amber-400">{finishedMatches.length} / {matches.length}</div>
          <div className="text-xs uppercase font-cyber text-neutral-400 mt-1">Jogos Realizados</div>
        </div>
      </section>

      {/* Official Notices / Mural de Comunicados */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-heading text-white">MURAL DE COMUNICADOS OFICIAIS</h2>
          </div>
          <span className="text-xs font-cyber text-neutral-400">Diretoria Geral Cyborgues</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
                notice.priority === 'urgente'
                  ? 'bg-amber-950/20 border-amber-500/50 glow-gold-sm'
                  : 'bg-neutral-900/70 border-neutral-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold font-cyber uppercase px-2 py-0.5 rounded ${
                      notice.priority === 'urgente'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : notice.priority === 'alta'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {notice.priority}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">{notice.date}</span>
                </div>
                <h3 className="font-bold text-sm text-white mb-2">{notice.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{notice.content}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Por: {notice.author}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PIX Payment Banner Box (Art. 22 & 23) */}
      <section className="rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black font-black text-xs px-2 py-0.5 rounded font-cyber">
              PAGAMENTO PIX (Art. 22)
            </span>
            <span className="text-xs text-neutral-400">Banco Santander</span>
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            Chave Oficial: <span className="text-amber-400 font-mono">aaa.cyborgues@gmail.com</span>
          </h3>
          <p className="text-xs text-neutral-300">
            Titular: <strong>Luys Arthur Serejo Alves</strong> • Valor: <strong>R$ 5,00</strong> por atleta por modalidade inscrita.
            Conforme o Art. 23, os pagamentos são centralizados pelo representante/capitão de cada equipe.
          </p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText('aaa.cyborgues@gmail.com');
            alert('Chave PIX copiada: aaa.cyborgues@gmail.com');
          }}
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl text-xs font-cyber transition cursor-pointer flex items-center gap-2"
        >
          <span>Copiar Chave PIX</span>
        </button>
      </section>

      {/* Modalities Preview Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-heading text-white">AS 14 MODALIDADES DO V INTERNERD</h2>
          </div>
          <button
            onClick={() => setActiveTab('jogos')}
            className="text-xs text-amber-400 hover:text-amber-300 font-cyber flex items-center gap-1 cursor-pointer"
          >
            <span>Ver tabela completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modalities.map((mod) => (
            <div
              key={mod.id}
              className="bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 transition group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span
                    className={`text-[10px] font-bold font-cyber uppercase px-2 py-0.5 rounded ${
                      mod.category === 'coletiva'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {mod.category === 'coletiva' ? 'Coletiva' : 'Individual'}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1 group-hover:text-amber-300 transition">
                    {mod.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    1º: {mod.points.first} pts
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{mod.rulesSummary}</p>

              <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Atletas / Equipe:</span>
                  <span className="text-neutral-200 font-medium">
                    {mod.minAthletes} {mod.maxAthletes > mod.minAthletes ? `a ${mod.maxAthletes}` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tolerância de atraso:</span>
                  <span className="text-amber-300 font-bold">{mod.toleranceMinutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Local:</span>
                  <span className="text-neutral-300 truncate max-w-[170px]">{mod.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
