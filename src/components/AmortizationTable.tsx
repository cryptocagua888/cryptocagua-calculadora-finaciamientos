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
    const headers = ['Mes', 'Fecha', 'Cuota Mensual', 'Saldo Pendiente'];
    const rows = schedule.map((item) => [
      item.month,
      item.paymentDate,
      item.totalMonthlyPayment.toFixed(2),
      item.remainingBalance.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cronograma_Cryptocagua_${schedule.length}_meses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    let text = `📅 CRONOGRAMA DE PAGOS CRYPTOCAGUA (${schedule.length} Meses)\n\n`;
    schedule.forEach((item) => {
      text += `Mes ${item.month} (${item.paymentDate}): Cuota = ${formatCurrency(item.totalMonthlyPayment)} | Saldo Restante: ${formatCurrency(item.remainingBalance)}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Tabla de Amortización ({schedule.length} Meses)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Cronograma de cuotas mensuales
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all min-h-[36px]"
            title="Copiar cronograma"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Calendar className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-all min-h-[36px]"
            title="Descargar CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Table Content */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[480px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4"># Mes</th>
                <th className="py-3 px-4">Fecha Sugerida</th>
                <th className="py-3 px-4 text-right text-emerald-400 font-bold">Cuota Mensual</th>
                <th className="py-3 px-4 text-right">Saldo Restante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {schedule.map((item) => (
                <tr key={item.month} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-300 whitespace-nowrap">
                    Mes {item.month}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {item.paymentDate}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-300 whitespace-nowrap">
                    {formatCurrency(item.totalMonthlyPayment)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 whitespace-nowrap">
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

