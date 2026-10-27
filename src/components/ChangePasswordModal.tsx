import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTournament } from '../context/TournamentContext';
import { Lock, KeyRound, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, changePassword } = useTournament();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!newPassword || newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'A confirmação de senha não confere.' });
      return;
    }

    const res = changePassword(newPassword);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Senha atualizada com sucesso!' });
      setTimeout(() => {
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao alterar senha.' });
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md my-auto rounded-3xl bg-neutral-900 border-2 border-amber-500/50 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-neutral-100 max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-neutral-800 pb-3">
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">MINHA CONTA & SENHA</h3>
            <p className="text-xs text-neutral-400">V INTERNERD – Segurança e Acesso</p>
          </div>
        </div>

        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/70 border-red-500/50 text-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Nome Completo</label>
            <input
              type="text"
              disabled
              value={currentUser.name}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-300 cursor-not-allowed opacity-80"
            />
          </div>

          {/* Usuário (IMUTÁVEL - Conforme regra do usuário) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-amber-400">
                Nome de Usuário (Login)
              </label>
              <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-cyber">
                Imutável
              </span>
            </div>
            <input
              type="text"
              disabled
              value={currentUser.username || currentUser.email.split('@')[0]}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-sm font-mono font-bold text-amber-300 cursor-not-allowed select-none"
            />
            <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1 font-cyber">
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span>O usuário não pode ser alterado após a criação (apenas a senha).</span>
            </p>
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Perfil Atribuído</label>
            <input
              type="text"
              disabled
              value={
                currentUser.role === 'admin'
                  ? 'Diretoria Geral (Administrador)'
                  : currentUser.role === 'capitao'
                  ? `Capitão de Equipe (${currentUser.teamName || 'Equipe'})`
                  : currentUser.role === 'diretor'
                  ? 'Diretor de Modalidade'
                  : 'Atleta'
              }
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-300 cursor-not-allowed opacity-80 font-cyber"
            />
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Nova Senha *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 dígitos"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Confirmar Nova Senha *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md mt-4 font-cyber uppercase tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Nova Senha</span>
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
