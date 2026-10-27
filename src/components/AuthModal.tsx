import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { ShieldCheck, Mail, KeyRound, LogIn, UserPlus, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { CyborgLogo } from './CyborgLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, loginAs } = useTournament();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
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

  const handleQuickRole = (role: string) => {
    loginAs(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-amber-500/30 p-6 shadow-2xl glow-gold text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CyborgLogo size="md" />
          </div>
          <h2 className="text-xl font-bold font-heading text-amber-400 tracking-wider">
            PORTAL CYBORGUES
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Autenticação Oficial • V INTERNERD 2026 (UEMA)
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2.5 px-4 rounded-xl border border-neutral-700 hover:border-amber-400/50 transition mb-4 cursor-pointer text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-3 text-neutral-500 text-xs uppercase tracking-wider font-cyber">
            ou com e-mail institucional
          </span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@aluno.uema.br"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Senha</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{tab === 'login' ? 'Entrar no Sistema' : 'Cadastrar Conta'}</span>
          </button>
        </form>

        {/* Quick Role Tester Bar */}
        <div className="mt-6 pt-5 border-t border-neutral-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 text-center mb-2.5 font-cyber">
            🚀 Testar Perfis Instantaneamente:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickRole('admin')}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 border border-neutral-700 text-left transition flex items-center gap-1.5 text-neutral-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-300">Diretoria Geral</span>
                <span className="block text-[10px] text-neutral-400">Admin Geral</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickRole('capitao')}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 border border-neutral-700 text-left transition flex items-center gap-1.5 text-neutral-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-300">Capitão Equipe</span>
                <span className="block text-[10px] text-neutral-400">ByteForce</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickRole('diretor')}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 border border-neutral-700 text-left transition flex items-center gap-1.5 text-neutral-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-300">Diretor Modalidade</span>
                <span className="block text-[10px] text-neutral-400">Futsal / Vôlei</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickRole('atleta')}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 border border-neutral-700 text-left transition flex items-center gap-1.5 text-neutral-200"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-300">Atleta / Aluno</span>
                <span className="block text-[10px] text-neutral-400">Inscrito</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
