import React, { useState } from 'react';
import { PaymentScheduleItem } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Table, Calendar, Download, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface AmortizationTableProps {
  schedule: PaymentScheduleItem[];
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleExportCSV = () => {
    const headers = ['Semana', 'Fecha', 'Cuota Semanal', 'Saldo Pendiente'];
    const rows = schedule.map((item) => [
      item.week,
      item.paymentDate,
      item.totalWeeklyPayment.toFixed(2),
      item.remainingBalance.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cronograma_Cryptocagua_${schedule.length}_semanas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    const months = Math.round(schedule.length / 4);
    let text = `📅 CRONOGRAMA DE PAGOS CRYPTOCAGUA (${schedule.length} Semanas / ${months} Mes${months > 1 ? 'es' : ''})\n\n`;
    schedule.forEach((item) => {
      text += `Semana ${item.week} (${item.paymentDate}): Cuota = ${formatCurrency(item.totalWeeklyPayment)} | Saldo Restante: ${formatCurrency(item.remainingBalance)}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monthsCount = Math.round(schedule.length / 4);

  return (
    <div className="bg-[#1A1A1C] border border-[#333333] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-[#333333] flex items-center justify-between bg-[#111113] gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#D32F2F] text-white shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-oswald uppercase tracking-wider text-[#FFD700] flex items-center gap-2">
              Tabla de Amortización ({schedule.length} Semanas - {monthsCount} Mes{monthsCount > 1 ? 'es' : ''})
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Cronograma de {schedule.length} cuotas semanales obligatorias
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1 px-3 py-1.5 font-oswald text-xs font-bold uppercase bg-[#000000] hover:bg-[#333333] text-zinc-300 border border-[#333333] transition-all"
            title="Copiar cronograma"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#FFD700]" /> : <Calendar className="w-3.5 h-3.5 text-zinc-400" />}
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-3 py-1.5 font-oswald text-xs font-bold uppercase bg-[#FFD700] text-[#111113] hover:bg-yellow-400 transition-all"
            title="Descargar CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-[#000000] border border-[#333333] text-zinc-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all flex items-center justify-center"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Table Content */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[480px]">
            <thead className="bg-[#000000] border-b-2 border-[#FFD700]">
              <tr>
                <th className="py-3 px-4 font-oswald uppercase tracking-wider text-[#FFD700] text-sm">Semana</th>
                <th className="py-3 px-4 font-oswald uppercase tracking-wider text-[#FFD700] text-sm">Fecha Sugerida</th>
                <th className="py-3 px-4 font-oswald uppercase tracking-wider text-[#FFD700] text-sm text-right">Cuota Semanal</th>
                <th className="py-3 px-4 font-oswald uppercase tracking-wider text-[#FFD700] text-sm text-right">Saldo Restante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333] font-mono">
              {schedule.map((item) => (
                <tr key={item.week} className="hover:bg-[#111113] transition-colors">
                  <td className="py-3 px-4 font-oswald text-sm font-bold text-white whitespace-nowrap">
                    Semana {item.week < 10 ? `0${item.week}` : item.week}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                    {item.paymentDate}
                  </td>
                  <td className="py-3 px-4 text-right font-oswald text-base font-bold text-[#FFD700] whitespace-nowrap">
                    {formatCurrency(item.totalWeeklyPayment)}
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-400 whitespace-nowrap">
                    {formatCurrency(item.remainingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
