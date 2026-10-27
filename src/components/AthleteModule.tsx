import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  Copy,
  Users,
  Award,
  Check,
} from 'lucide-react';
import { calculateAthleteFee, PIX_PAYMENT_INFO } from '../utils/rules';

export const AthleteModule: React.FC = () => {
  const { currentUser, teams, modalities, matches, registerAthlete } = useTournament();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    matricula: currentUser?.matricula || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    turma: currentUser?.turma || 'Eng. Comp 2024.1',
    photoUrl: currentUser?.photoUrl || '',
    proofFileName: currentUser?.proofFileName || 'comprovante_matricula_uema.pdf',
    teamId: currentUser?.teamId || (teams[0]?.id || ''),
    inviteCode: '',
    selectedModalities: currentUser?.registeredModalities || ['futsal', 'fifa'],
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const calculatedFee = calculateAthleteFee(formData.selectedModalities.length);

  const handleModalityToggle = (modId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedModalities.includes(modId);
      const updated = exists
        ? prev.selectedModalities.filter((id) => id !== modId)
        : [...prev.selectedModalities, modId];
      return { ...prev, selectedModalities: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = registerAthlete(
      {
        uid: currentUser?.uid,
        name: formData.name,
        matricula: formData.matricula,
        email: formData.email,
        phone: formData.phone,
        turma: formData.turma,
        photoUrl: formData.photoUrl,
        proofFileName: formData.proofFileName,
        proofDocumentUrl: formData.proofFileName,
        registeredModalities: formData.selectedModalities,
      },
      formData.inviteCode.trim() || formData.teamId
    );

    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'Inscrição registrada e enviada com sucesso! Aguarde a aprovação do capitão e da diretoria.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Erro ao processar inscrição.',
      });
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_PAYMENT_INFO.key);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  // Jogos das modalidades em que o atleta está inscrito
  const myMatches = matches.filter(
    (m) => currentUser?.registeredModalities?.includes(m.modalityId)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Module Header */}
      <div className="rounded-3xl bg-neutral-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-cyber font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Módulo A • Registro & Ficha do Atleta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            CADASTRO OFICIAL DO ATLETA
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Inscreva-se em sua equipe e selecione as modalidades que deseja disputar.
            Conforme o Art. 13, cada atleta só pode pertencer a UMA equipe em todo o campeonato.
          </p>
        </div>

        {currentUser && (
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-right text-xs space-y-1">
            <div className="text-neutral-400">Status da Inscrição:</div>
            <div className="inline-block font-bold uppercase font-cyber px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/30">
              {currentUser.registrationStatus || 'Pendente'}
            </div>
            <div className="text-neutral-400 pt-1">Status do Pagamento:</div>
            <div
              className={`inline-block font-bold uppercase font-cyber px-2.5 py-0.5 rounded ${
                currentUser.paymentStatus === 'pago'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {currentUser.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/60 border-red-500/50 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Form and Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Registration Form */}
        <div className="lg:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>DADOS DO ATLETA (Art. 18 e 24)</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do atleta"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Matrícula Acadêmica (UEMA) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="Ex: 20241502045"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none font-mono"
                />
                <span className="text-[10px] text-neutral-500 font-cyber">
                  A matrícula é validada para evitar inscrições duplicadas em mais de uma equipe.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aluno@uema.br"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(98) 9XXXX-XXXX"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Período / Turma *
                </label>
                <input
                  type="text"
                  required
                  value={formData.turma}
                  onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                  placeholder="Ex: Eng. Comp 2024.1"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Comprovante de Matrícula (Art. 24)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.proofFileName}
                      onChange={(e) => setFormData({ ...formData, proofFileName: e.target.value })}
                      placeholder="Nome do arquivo enviado"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none"
                    />
                  </div>
                  <label className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 px-3 py-2 rounded-xl text-xs font-cyber flex items-center gap-1 cursor-pointer transition border border-neutral-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Anexar</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, proofFileName: e.target.files[0].name });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Team Selection and Invite Code */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <label className="block text-xs font-bold text-amber-400 uppercase font-cyber">
                Vínculo com a Equipe (Art. 13 - Regra de Representação Única)
              </label>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-400 space-y-1">
                <p className="text-neutral-300 font-semibold">
                  Atenção: É expressamente proibido representar mais de uma equipe durante o V INTERNERD.
                </p>
                <p>
                  Sua pontuação em modalidades individuais também reverterá exclusivamente para esta equipe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">
                    Selecionar Equipe Existente:
                  </label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Capitão: {t.captainName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">
                    Ou digitar Código de Convite da Equipe:
                  </label>
                  <input
                    type="text"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                    placeholder="Ex: BYTE2026"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 px-3 text-xs text-white uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Modalities Selection with Real-Time Fee Calculation */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase font-cyber">
                    Modalidades que Deseja Disputar
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    Taxa: R$ 5,00 por modalidade (Art. 22). Marque as modalidades que irá participar.
                  </p>
                </div>
                <div className="bg-amber-400/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-right">
                  <div className="text-[10px] text-neutral-400 font-cyber uppercase">Taxa Calculada</div>
                  <div className="text-base font-black font-mono text-amber-400">
                    R$ {calculatedFee.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {modalities.map((m) => {
                  const isChecked = formData.selectedModalities.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-400/15 border-amber-400/50 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="text-xs font-bold truncate">{m.name}</div>
                        <div className="text-[10px] text-neutral-500 uppercase">{m.category}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleModalityToggle(m.id)}
                        className="rounded border-neutral-700 text-amber-400 focus:ring-0 shrink-0"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer font-cyber uppercase tracking-wider text-sm shadow-lg mt-6"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Inscrição Oficial</span>
            </button>
          </form>
        </div>

        {/* Right: Payment Instructions & Athlete Status */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>CONTROLE FINANCEIRO (Art. 22)</span>
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Modalidades Selecionadas:</span>
                <span className="font-bold text-white font-mono">{formData.selectedModalities.length}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-800 pt-2">
                <span className="text-xs text-neutral-400">Total Devido pelo Atleta:</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  R$ {calculatedFee.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-800 pt-2">
                <span className="text-xs text-neutral-400">Situação:</span>
                <span
                  className={`text-xs font-bold font-cyber uppercase px-2 py-0.5 rounded ${
                    currentUser?.paymentStatus === 'pago'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {currentUser?.paymentStatus === 'pago' ? 'Confirmado' : 'Pendente de Repasse'}
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-300 space-y-2 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
              <p className="font-bold text-amber-300 font-cyber">Centralização do Pagamento (Art. 23):</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Repasse sua taxa diretamente ao capitão da sua equipe. O capitão reunirá o montante da equipe e efetuará a transferência para o PIX oficial:
              </p>
              <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 truncate mr-2">{PIX_PAYMENT_INFO.key}</span>
                <button
                  type="button"
                  onClick={copyPix}
                  className="p-1 text-neutral-400 hover:text-white shrink-0 cursor-pointer"
                  title="Copiar PIX"
                >
                  {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[10px] text-neutral-500">
                {PIX_PAYMENT_INFO.bank} • Titular: {PIX_PAYMENT_INFO.holder}
              </div>
            </div>
          </div>

          {/* My Next Matches */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>MINHAS PARTIDAS AGENDADAS</span>
            </h3>

            {myMatches.length === 0 ? (
              <p className="text-xs text-neutral-500 font-cyber">
                Nenhuma partida agendada para suas modalidades no momento.
              </p>
            ) : (
              <div className="space-y-2.5">
                {myMatches.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">{m.modalityName}</span>
                      <span className="text-[10px] text-neutral-500">{m.date} - {m.time}</span>
                    </div>
                    <div className="text-white truncate font-medium">{m.teamAName} vs {m.teamBName}</div>
                    <div className="text-[10px] text-neutral-400">{m.venue}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
