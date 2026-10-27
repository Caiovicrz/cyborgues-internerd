import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Mail, KeyRound, LogIn, CheckCircle2, AlertCircle, X, User, Crown, Users } from 'lucide-react';
import { CyborgLogo } from './CyborgLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, loginWithGoogle, loginAs } = useTournament();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!usernameOrEmail) {
      setError('Por favor, informe seu usuário ou e-mail institucional.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginWithCredentials(usernameOrEmail, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Falha ao autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCredential = async (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithCredentials(user, pass);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Falha ao autenticar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError('Erro ao autenticar com Google: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-amber-500/40 p-6 sm:p-7 shadow-2xl glow-gold text-neutral-100 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <CyborgLogo size="md" />
          </div>
          <h2 className="text-xl font-bold font-heading text-amber-400 tracking-wider">
            PORTAL DE ACESSO CYBORGUES
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Autenticação Oficial • V INTERNERD 2026 (UEMA)
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Usuário ou E-mail Institucional *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Ex: Caiocruz, Luisarthur, lucassilva..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition font-mono"
              />
            </div>
            <span className="text-[10px] text-neutral-500 font-cyber">
              Capitães e Diretores recebem seus logins da Diretoria Geral.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-300">Senha de Acesso *</label>
              <span className="text-[10px] text-amber-400/80 font-mono">Padrão: @Cyborgues2026</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md mt-2 font-cyber uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
          </button>
        </form>

        {/* Quick Credential Buttons Requested by User */}
        <div className="mt-5 pt-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-cyber">
              🔑 Entrar com Credenciais Oficiais:
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Senha: @Cyborgues2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Caio Cruz */}
            <button
              onClick={() => handleQuickCredential('Caiocruz', '@Cyborgues2026')}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 text-left transition flex items-center gap-2 cursor-pointer group"
            >
              <Crown className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="truncate">
                <span className="font-bold text-amber-300 block">Caio Cruz</span>
                <span className="text-[10px] text-neutral-400 font-mono">Usuário: Caiocruz</span>
              </div>
            </button>

            {/* Luis Arthur */}
            <button
              onClick={() => handleQuickCredential('Luisarthur', '@Cyborgues2026')}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-400 text-left transition flex items-center gap-2 cursor-pointer group"
            >
              <Crown className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="truncate">
                <span className="font-bold text-amber-300 block">Luys Arthur</span>
                <span className="text-[10px] text-neutral-400 font-mono">Usuário: Luisarthur</span>
              </div>
            </button>

            {/* Capitão Lucas Silva */}
            <button
              onClick={() => handleQuickCredential('lucassilva', '@Cyborgues2026')}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-blue-500/15 border border-blue-500/30 hover:border-blue-400 text-left transition flex items-center gap-2 cursor-pointer group"
            >
              <Users className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="truncate">
                <span className="font-bold text-blue-300 block">Lucas Silva</span>
                <span className="text-[10px] text-neutral-400 font-mono">Capitão ByteForce</span>
              </div>
            </button>

            {/* Diretor Lucas Vinicius */}
            <button
              onClick={() => handleQuickCredential('lucasvinicius', '@Cyborgues2026')}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 text-left transition flex items-center gap-2 cursor-pointer group"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="truncate">
                <span className="font-bold text-emerald-300 block">Lucas Vinícius</span>
                <span className="text-[10px] text-neutral-400 font-mono">Dir. Futsal & Vôlei</span>
              </div>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed font-cyber">
            ℹ️ <strong className="text-amber-300">Regra de Segurança:</strong> Diretores e Capitães podem alterar suas senhas a qualquer momento no menu "Minha Conta", mas o nome de usuário (login) é estritamente imutável.
          </div>
        </div>
      </div>
    </div>
  );
};
