/**
 * Utilitários de exportação em CSV e impressão de Súmula para o V INTERNERD
 */

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        const str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(';'); // Padrão brasileiro Excel (ponto e vírgula)
  };

  const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n'); // \uFEFF para UTF-8 BOM
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printMatchSumula(match: {
  modalityName: string;
  phase: string;
  roundName?: string;
  date: string;
  time: string;
  venue: string;
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  isWO?: boolean;
  woWinner?: string;
  notes?: string;
  sumulaDetails?: string;
}) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Súmula Oficial - ${match.modalityName} - V INTERNERD 2026</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .header h2 { margin: 5px 0 0; font-size: 15px; color: #555; }
        .grid { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .box { border: 1px solid #999; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .scoreboard { text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; padding: 15px; background: #f4f4f4; border: 2px solid #333; }
        .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
        .sign-line { border-top: 1px solid #000; width: 220px; text-align: center; padding-top: 5px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 13px; }
        th { background: #eee; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>V INTERNERD – Cyborgues 2026</h1>
        <h2>A.A.A. Eng. de Computação Cyborgues – UEMA São Luís</h2>
        <h3>Súmula Oficial de Partida: ${match.modalityName}</h3>
      </div>

      <div class="grid">
        <div><strong>Fase:</strong> ${match.phase} (${match.roundName || 'Jogo'})</div>
        <div><strong>Data/Hora:</strong> ${match.date} às ${match.time}</div>
        <div><strong>Local:</strong> ${match.venue}</div>
      </div>

      <div class="scoreboard">
        ${match.teamAName} 
        <span style="margin: 0 20px; padding: 4px 15px; background: #fff; border: 1px solid #999;">
          ${match.scoreA !== null ? match.scoreA : '-'} x ${match.scoreB !== null ? match.scoreB : '-'}
        </span> 
        ${match.teamBName}
      </div>

      ${match.isWO ? `<div style="color: red; font-weight: bold; text-align: center; margin-bottom: 15px;">PARTIDA DECIDIDA POR W.O. (Vencedor: Equipe ${match.woWinner})</div>` : ''}

      <div class="box">
        <strong>Relatório / Ocorrências da Partida:</strong>
        <p>${match.sumulaDetails || match.notes || 'Nenhuma ocorrência disciplinar grave registrada.'}</p>
      </div>

      <div class="signatures">
        <div class="sign-line">Árbitro / Diretor da Modalidade</div>
        <div class="sign-line">Capitão: ${match.teamAName}</div>
        <div class="sign-line">Capitão: ${match.teamBName}</div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}
