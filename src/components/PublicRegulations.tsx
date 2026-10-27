import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { OFFICIAL_MODALITIES } from '../utils/rules';

export const PublicRegulations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');

  const topics = [
    { id: 'todos', label: 'Todos os Títulos' },
    { id: 'modalidades', label: '14 Modalidades (Art. 9)' },
    { id: 'inscricoes', label: 'Inscrições e Equipes (Art. 11-21)' },
    { id: 'taxas', label: 'Taxa e Pagamento PIX (Art. 22-24)' },
    { id: 'pontuacao', label: 'Pontuação e Desempate (Art. 25-28)' },
    { id: 'jogos_wo', label: 'Jogos, Tolerâncias e W.O. (Art. 29-31)' },
    { id: 'disciplina', label: 'Disciplina e Infrações (Art. 32-35)' },
  ];

  const sections = [
    {
      topic: 'modalidades',
      title: 'TÍTULO IV – REALIZAÇÃO E AS 14 MODALIDADES',
      articles: [
        {
          num: 'Art. 7º e 8º',
          title: 'Período e Locais',
          content: 'O V INTERNERD será realizado no período de 31/10/2026 a 06/11/2026 (sexta-feira) nos espaços e ginásios do Campus Paulo VI – UEMA São Luís.',
        },
        {
          num: 'Art. 9º §1º',
          title: 'Modalidades Coletivas (6)',
          content: 'Futsal, Voleibol, Basquete 2x2, Sinuca em Duplas, League of Legends (LoL) e Valorant.',
        },
        {
          num: 'Art. 9º §2º e §4º',
          title: 'Modalidades Individuais (8)',
          content: 'FIFA, Clash Royale, Tênis de Mesa (feminino e masculino), Xadrez, FDP (cartas com vidas), Poker Texas Hold\'em, Mortal Kombat 11 e Coup.',
        },
        {
          num: 'Art. 9º §5º',
          title: 'Sorteio Oficial das Coletivas pelo Instagram',
          content: 'Os confrontos das modalidades coletivas serão definidos por sorteio oficial no dia 05/10/2026 transmitido ao vivo pelo Instagram da Atlética: https://www.instagram.com/atleticacyborgues.',
        },
        {
          num: 'Art. 10º',
          title: 'Alterações na Tabela',
          content: 'Alterações poderão ser solicitadas até o dia 02/11/2026, havendo disponibilidade de horário e arbitragem.',
        },
      ],
    },
    {
      topic: 'inscricoes',
      title: 'TÍTULO V E VI – PARTICIPAÇÃO, EQUIPES E INSCRIÇÕES',
      articles: [
        {
          num: 'Art. 11º',
          title: 'Elegibilidade do Participante',
          content: 'Poderá participar todo estudante regularmente matriculado em pelo menos uma disciplina do curso de graduação em Engenharia de Computação da UEMA.',
        },
        {
          num: 'Art. 12º e 13º',
          title: 'Vínculo Único à Equipe (Impedimento de Multi-Equipes)',
          content: 'É expressamente PROIBIDO que um atleta represente equipes diferentes em modalidades distintas. O atleta deve representar a mesma equipe em todo o INTERNERD.',
        },
        {
          num: 'Art. 16º',
          title: 'Período Oficial de Inscrições',
          content: 'Inscrições online abertas de 07/09/2026 a 28/09/2026.',
        },
        {
          num: 'Art. 17º §2º',
          title: 'Capitão / Representante da Equipe',
          content: 'Cada equipe possui um representante indicado livremente, sendo vedado que uma mesma pessoa seja capitão de mais de uma equipe.',
        },
        {
          num: 'Art. 19º',
          title: 'Composição Mínima da Equipe',
          content: 'Cada equipe deverá ser composta por, no mínimo, 15 (quinze) atletas e disputar, no mínimo, 6 (seis) modalidades.',
        },
        {
          num: 'Art. 21º',
          title: 'Bloqueio de Transferência pós-Prazo',
          content: 'Após 28/09/2026, é proibida a transferência de atletas entre equipes. Exceções somente mediante autorização expressa da Coordenação Geral.',
        },
      ],
    },
    {
      topic: 'taxas',
      title: 'CAPÍTULO II E III – TAXAS DE INSCRIÇÃO E DOCUMENTAÇÃO',
      articles: [
        {
          num: 'Art. 22º',
          title: 'Valor e Chave PIX Oficial',
          content: 'Taxa de R$ 5,00 por atleta, por modalidade inscrita. Pagamento via PIX: aaa.cyborgues@gmail.com (Banco Santander - Titular: Luys Arthur Serejo Alves).',
        },
        {
          num: 'Art. 23º',
          title: 'Centralização pelo Capitão',
          content: 'Caberá ao representante de cada equipe reunir os valores devidos pelos atletas e repassar a taxa total à organização.',
        },
        {
          num: 'Art. 24º',
          title: 'Documentos Válidos Aceitos',
          content: 'I. Documento oficial com foto; II. Comprovante de matrícula atualizado; III. Carteira do Restaurante Universitário (R.U.) com foto.',
        },
      ],
    },
    {
      topic: 'pontuacao',
      title: 'TÍTULO VII – PONTUAÇÃO E CRITÉRIOS DE DESEMPATE',
      articles: [
        {
          num: 'Art. 26º',
          title: 'Tabela Oficial de Pontos por Modalidade',
          content: 'Futsal e Vôlei (12, 9, 6, 3); LoL e Valorant (10, 7, 5, 3); Basquete 2x2 e Sinuca (8, 6, 4, 2); Individuais (6, 4, 2).',
        },
        {
          num: 'Art. 26º §4º',
          title: 'Limite de Pontuação em Individuais',
          content: 'Para fins de classificação geral, serão considerados, no MÁXIMO, os 2 (dois) melhores resultados de uma mesma equipe em cada modalidade individual.',
        },
        {
          num: 'Art. 28º',
          title: 'Critérios de Desempate Geral',
          content: 'I. Mais 1ºs lugares; II. Mais 2ºs lugares; III. Mais 3ºs lugares; IV. Mais 1ºs lugares em modalidades coletivas; V. Maior pontuação em modalidades de maior valor; VI. Decisão pela Coordenação Geral.',
        },
      ],
    },
    {
      topic: 'jogos_wo',
      title: 'TÍTULO VIII – JOGOS, TOLERÂNCIAS E W.O.',
      articles: [
        {
          num: 'Art. 30º e 61º',
          title: 'Tempo de Tolerância para Início',
          content: 'Tolerância geral de 15 (quinze) minutos após o horário agendado. Exceções: Voleibol e Sinuca possuem tolerância estrita de 10 (dez) minutos.',
        },
        {
          num: 'Art. 31º',
          title: 'Efeitos do W.O. (Walkover)',
          content: 'A equipe ou atleta ausente será declarada perdedora e terá placar zerado. A reincidência pode acarretar desclassificação.',
        },
      ],
    },
    {
      topic: 'disciplina',
      title: 'TÍTULO IX – DISCIPLINA E PENALIDADES',
      articles: [
        {
          num: 'Art. 32º e 33º',
          title: 'Infrações e Sanções',
          content: 'Infrações como desrespeito, agressão, uso de atleta irregular ou abandono acarretam advertência, perda de pontos, suspensão ou desclassificação.',
        },
      ],
    },
  ];

  const filteredSections = sections
    .filter((sec) => selectedTopic === 'todos' || sec.topic === selectedTopic)
    .map((sec) => {
      if (!searchTerm) return sec;
      const term = searchTerm.toLowerCase();
      const filteredArticles = sec.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term) ||
          a.num.toLowerCase().includes(term)
      );
      return { ...sec, articles: filteredArticles };
    })
    .filter((sec) => sec.articles.length > 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl bg-neutral-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-gold-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-cyber font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>Documento Oficial Registrado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            REGULAMENTO OFICIAL DO V INTERNERD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Regras gerais e específicas aprovadas pelo Comitê Organizador da Associação Atlética Acadêmica Cyborgues – UEMA.
          </p>
        </div>

        <a
          href="/assets/aistudio/REGULAMENTO_OFICIAL_V_INTERNERD_2026-3_89e291d9.pdf"
          download
          target="_blank"
          rel="noreferrer"
          className="shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer text-xs font-cyber uppercase tracking-wider shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Baixar PDF Completo (28 Págs)</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artigos (ex: W.O., matrícula, taxa, desempate)..."
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cyber transition cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring Table Summary Card (Art. 26) */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-white text-base">
              TABELA OFICIAL DE PONTUAÇÃO (Art. 26)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-800 text-neutral-400 font-cyber uppercase">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Modalidade</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5 text-center text-amber-300">1º Lugar</th>
                  <th className="p-2.5 text-center text-neutral-200">2º Lugar</th>
                  <th className="p-2.5 text-center text-amber-600">3º Lugar</th>
                  <th className="p-2.5 text-center text-neutral-400 rounded-r-lg">4º Lugar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">Futsal e Voleibol</td>
                  <td className="p-2.5 text-blue-400">Coletiva</td>
                  <td className="p-2.5 text-center font-bold text-amber-400">12 pts</td>
                  <td className="p-2.5 text-center text-neutral-300">9 pts</td>
                  <td className="p-2.5 text-center text-amber-600">6 pts</td>
                  <td className="p-2.5 text-center text-neutral-400">3 pts</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">League of Legends & Valorant</td>
                  <td className="p-2.5 text-blue-400">Coletiva</td>
                  <td className="p-2.5 text-center font-bold text-amber-400">10 pts</td>
                  <td className="p-2.5 text-center text-neutral-300">7 pts</td>
                  <td className="p-2.5 text-center text-amber-600">5 pts</td>
                  <td className="p-2.5 text-center text-neutral-400">3 pts</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">Basquete 2x2 & Sinuca em Duplas</td>
                  <td className="p-2.5 text-blue-400">Coletiva</td>
                  <td className="p-2.5 text-center font-bold text-amber-400">8 pts</td>
                  <td className="p-2.5 text-center text-neutral-300">6 pts</td>
                  <td className="p-2.5 text-center text-amber-600">4 pts</td>
                  <td className="p-2.5 text-center text-neutral-400">2 pts</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white font-sans">
                    Todas as 8 Individuais (FIFA, Clash, TM, Xadrez, FDP, Poker, MK11, Coup)
                  </td>
                  <td className="p-2.5 text-emerald-400">Individual</td>
                  <td className="p-2.5 text-center font-bold text-amber-400">6 pts</td>
                  <td className="p-2.5 text-center text-neutral-300">4 pts</td>
                  <td className="p-2.5 text-center text-amber-600">2 pts</td>
                  <td className="p-2.5 text-center text-neutral-500">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-amber-300/90 font-cyber">
            * <strong>Art. 26 §4º:</strong> Nas modalidades individuais, no máximo os 2 (dois) melhores resultados de cada equipe são somados na Classificação Geral.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {filteredSections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-sm font-bold font-cyber text-amber-400 uppercase tracking-wider border-b border-amber-500/20 pb-1.5">
                {sec.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.articles.map((art, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold bg-neutral-800 text-amber-300 px-2 py-0.5 rounded">
                        {art.num}
                      </span>
                      <h4 className="font-bold text-xs text-white">{art.title}</h4>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
