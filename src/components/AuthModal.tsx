import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTournament } from '../context/TournamentContext';
import { KeyRound, LogIn, AlertCircle, X, User, Eye, EyeOff } from 'lucide-react';
import { CyborgLogo } from './CyborgLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials } = useTournament();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Trava a rolagem do corpo da página quando o modal de login está aberto
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!usernameOrEmail.trim()) {
      setError('Por favor, informe seu usuário ou e-mail.');
      return;
    }
    if (!password) {
      setError('Por favor, informe sua senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginWithCredentials(usernameOrEmail.trim(), password);
      if (res.success) {
        setUsernameOrEmail('');
        setPassword('');
        setError(null);
        onClose();
      } else {
        setError(res.error || 'Usuário ou senha incorretos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setUsernameOrEmail('');
    setPassword('');
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Card de Login Centralizado com Efeito Dourado */}
      <div
        className="relative w-full max-w-md my-auto rounded-3xl bg-neutral-900 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-neutral-100 max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CyborgLogo size="md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-400 tracking-wider">
            PORTAL DE ACESSO
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            V INTERNERD 2026 • Cyborgues UEMA
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário Padrão de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 font-cyber uppercase tracking-wider">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Digite seu usuário ou e-mail"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-3 pl-10 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 font-cyber uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none transition focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-neutral-400 hover:text-amber-400 transition cursor-pointer p-0.5"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-black font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg mt-3 font-cyber uppercase tracking-wider glow-gold-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Entrando...' : 'Entrar no Sistema'}</span>
          </button>
        </form>

        {/* Rodapé Informativo */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Acesso exclusivo para Capitães, Diretores e Organização do torneio. Em caso de dúvidas sobre seu acesso, consulte a Diretoria Geral.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
