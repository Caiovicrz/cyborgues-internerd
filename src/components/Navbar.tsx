import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Trophy,
  Calendar,
  FileText,
  Users,
  Shield,
  Award,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
  Flame,
  UserCheck,
  Instagram,
} from 'lucide-react';
import { CyborgLogo } from './CyborgLogo';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, loginAs } = useTournament();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Diretoria Geral', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 'capitao':
        return { label: 'Capitão', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 'diretor':
        return { label: 'Diretor Modalidade', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'atleta':
        return { label: 'Atleta', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
      default:
        return { label: 'Visitante', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' };
    }
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: Trophy },
    { id: 'regulamento', label: 'Regulamento', icon: FileText },
    { id: 'jogos', label: 'Tabela de Jogos', icon: Calendar },
    { id: 'resultados', label: 'Resultados', icon: Activity },
    { id: 'classificacao', label: 'Classificação Geral', icon: Award },
  ];

  // Abas de módulos do torneio
  const moduleTabs = [
    { id: 'modulo-atleta', label: 'Área do Atleta', icon: UserCheck, roleRequired: 'atleta' },
    { id: 'modulo-capitao', label: 'Painel do Capitão', icon: Users, roleRequired: 'capitao' },
    { id: 'modulo-diretor', label: 'Diretor Modalidade', icon: Flame, roleRequired: 'diretor' },
    { id: 'modulo-admin', label: 'Diretoria Geral', icon: Shield, roleRequired: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b-2 border-amber-500/30 shadow-xl">
      {/* Top Notice Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-black text-[11px] font-bold px-4 py-1.5 flex items-center justify-between font-cyber">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-black text-amber-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            OFICIAL
          </span>
          <span>V INTERNERD CYBORGUES 2026 • UEMA SÃO LUÍS • 31/10/2026 A 06/11/2026</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[11px]">
          <span>Inscrições até: <strong>28/09/2026</strong></span>
          <span>•</span>
          <a
            href="https://www.instagram.com/atleticacyborgues"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline text-black font-extrabold"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Sorteio 05/10/2026 no Instagram @atleticacyborgues</span>
          </a>
          <span>•</span>
          <span>PIX: aaa.cyborgues@gmail.com</span>
        </div>
      </div>

      {/* Main Navbar Row with Generous Spacing and Lower Border Margin */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Title with Safe Vertical Breathing Room */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <CyborgLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-heading font-black tracking-wider text-xl text-white">
                  V INTER<span className="text-amber-400">NERD</span>
                </span>
                <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  2026
                </span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-300 font-cyber tracking-tight mt-1.5">
                A.A.A. ENG. DE COMPUTAÇÃO CYBORGUES – UEMA
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold font-cyber transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black font-bold shadow-md'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="h-6 w-px bg-neutral-800 mx-2" />

            {/* Quick Access to Active Modules */}
            {moduleTabs.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeTab === mod.id;
              const isRelevant =
                currentUser?.role === mod.roleRequired ||
                currentUser?.role === 'admin' ||
                mod.id === 'modulo-atleta';

              if (!isRelevant) return null;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold font-cyber transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-500/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Status & Role Switcher */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Fast Role Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  getRoleBadge(currentUser?.role).color
                }`}
                title="Clique para alternar perfil de teste"
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="font-semibold">{getRoleBadge(currentUser?.role).label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-[10px] uppercase text-neutral-400 font-bold font-cyber tracking-wider border-b border-neutral-800 mb-1">
                    Simular Perfil de Acesso:
                  </div>
                  <button
                    onClick={() => {
                      loginAs('admin');
                      setRoleDropdownOpen(false);
                      setActiveTab('modulo-admin');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-400/20 text-amber-300 font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span>👑 Diretoria Geral</span>
                    <span className="text-[10px] text-neutral-400">Admin</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs('capitao');
                      setRoleDropdownOpen(false);
                      setActiveTab('modulo-capitao');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-400/20 text-blue-300 font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span>🛡️ Capitão Equipe</span>
                    <span className="text-[10px] text-neutral-400">ByteForce</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs('diretor');
                      setRoleDropdownOpen(false);
                      setActiveTab('modulo-diretor');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-400/20 text-emerald-300 font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Diretor de Modalidade</span>
                    <span className="text-[10px] text-neutral-400">Futsal</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs('atleta');
                      setRoleDropdownOpen(false);
                      setActiveTab('modulo-atleta');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-400/20 text-purple-300 font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span>🏃 Atleta / Aluno</span>
                    <span className="text-[10px] text-neutral-400">Inscrito</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs('visitante');
                      setRoleDropdownOpen(false);
                      setActiveTab('home');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 transition cursor-pointer"
                  >
                    <span>🌐 Modo Visitante (Público)</span>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') setActiveTab('modulo-admin');
                    else if (currentUser.role === 'capitao') setActiveTab('modulo-capitao');
                    else if (currentUser.role === 'diretor') setActiveTab('modulo-diretor');
                    else setActiveTab('modulo-atleta');
                  }}
                  className="text-xs text-neutral-200 hover:text-amber-400 font-medium max-w-[130px] truncate cursor-pointer"
                  title={currentUser.name}
                >
                  {currentUser.name}
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition cursor-pointer"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-md font-cyber"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs bg-amber-500 text-black font-bold px-2.5 py-1 rounded-lg"
            >
              {currentUser ? currentUser.name.split(' ')[0] : 'Entrar'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-2">
          <div className="text-[11px] font-bold text-neutral-400 uppercase font-cyber mb-1">
            Navegação Pública
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-cyber flex items-center gap-2.5 transition ${
                  isActive ? 'bg-amber-400 text-black font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="h-px bg-neutral-800 my-2" />
          <div className="text-[11px] font-bold text-amber-400 uppercase font-cyber mb-1">
            Módulos do Campeonato
          </div>
          {moduleTabs.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveTab(mod.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-cyber flex items-center gap-2.5 transition ${
                  isActive ? 'bg-amber-400 text-black font-bold' : 'text-amber-300 bg-amber-400/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mod.label}</span>
              </button>
            );
          })}

          <div className="h-px bg-neutral-800 my-2" />
          <div className="pt-2">
            <div className="text-xs text-neutral-400 mb-2">Simular Perfil Rápido:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  loginAs('admin');
                  setMobileMenuOpen(false);
                  setActiveTab('modulo-admin');
                }}
                className="p-2 bg-neutral-900 rounded-lg text-xs text-amber-400 font-bold border border-amber-500/30"
              >
                Diretoria Geral
              </button>
              <button
                onClick={() => {
                  loginAs('capitao');
                  setMobileMenuOpen(false);
                  setActiveTab('modulo-capitao');
                }}
                className="p-2 bg-neutral-900 rounded-lg text-xs text-blue-400 font-bold border border-blue-500/30"
              >
                Capitão Equipe
              </button>
              <button
                onClick={() => {
                  loginAs('diretor');
                  setMobileMenuOpen(false);
                  setActiveTab('modulo-diretor');
                }}
                className="p-2 bg-neutral-900 rounded-lg text-xs text-emerald-400 font-bold border border-emerald-500/30"
              >
                Diretor Modalidade
              </button>
              <button
                onClick={() => {
                  loginAs('atleta');
                  setMobileMenuOpen(false);
                  setActiveTab('modulo-atleta');
                }}
                className="p-2 bg-neutral-900 rounded-lg text-xs text-purple-400 font-bold border border-purple-500/30"
              >
                Atleta Inscrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};
