import React, { useState } from 'react';
import { TournamentProvider } from './context/TournamentContext';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { PublicRegulations } from './components/PublicRegulations';
import { PublicScheduleAndMatches } from './components/PublicScheduleAndMatches';
import { PublicStandings } from './components/PublicStandings';
import { AthleteModule } from './components/AthleteModule';
import { CaptainModule } from './components/CaptainModule';
import { DirectorModule } from './components/DirectorModule';
import { AdminModule } from './components/AdminModule';
import { CyborgLogo } from './components/CyborgLogo';
import { Trophy, FileText, Calendar, Users, Shield, Heart } from 'lucide-react';

function TournamentApp() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Header and Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && <PublicHome setActiveTab={setActiveTab} />}
        {activeTab === 'regulamento' && <PublicRegulations />}
        {activeTab === 'jogos' && <PublicScheduleAndMatches />}
        {activeTab === 'resultados' && <PublicScheduleAndMatches />}
        {activeTab === 'classificacao' && <PublicStandings />}
        {activeTab === 'modulo-atleta' && <AthleteModule />}
        {activeTab === 'modulo-capitao' && <CaptainModule />}
        {activeTab === 'modulo-diretor' && <DirectorModule />}
        {activeTab === 'modulo-admin' && <AdminModule />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950/80 py-10 px-4 text-xs text-neutral-400 font-cyber">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CyborgLogo size="sm" />
            <div>
              <div className="font-heading font-black text-white tracking-wider text-sm">
                V INTER<span className="text-amber-400">NERD</span> 2026
              </div>
              <div className="text-[11px] text-neutral-500">
                A.A.A. Engenharia de Computação Cyborgues – UEMA São Luís/MA
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-amber-400 transition"
            >
              Início
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('regulamento')}
              className="hover:text-amber-400 transition"
            >
              Regulamento Geral
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('jogos')}
              className="hover:text-amber-400 transition"
            >
              Tabela de Jogos
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('classificacao')}
              className="hover:text-amber-400 transition"
            >
              Classificação
            </button>
            <span>&bull;</span>
            <a
              href={`${import.meta.env.BASE_URL}assets/aistudio/REGULAMENTO_OFICIAL_V_INTERNERD_2026-3_89e291d9.pdf`}
              download
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline font-bold"
            >
              PDF Oficial
            </a>
          </div>

          <div className="text-right text-[11px] text-neutral-500">
            <div>Chave PIX: <strong className="text-neutral-300">aaa.cyborgues@gmail.com</strong></div>
            <div>Banco Santander • Luys Arthur Serejo Alves</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TournamentProvider>
      <TournamentApp />
    </TournamentProvider>
  );
}
