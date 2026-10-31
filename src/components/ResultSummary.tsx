import React from 'react';
import { FinancingResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Calendar, Crown, Sparkles, Clock, Share2, PlusCircle } from 'lucide-react';

interface ResultSummaryProps {
  result: FinancingResult;
  onOpenExport: () => void;
  onSaveComparison: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  onOpenExport,
  onSaveComparison,
}) => {
  const formattedWeekly = formatCurrency(result.weeklyPayment);
  const formattedInitial = formatCurrency(result.initialAmount);
  const formattedFinanced = formatCurrency(result.financedAmount);

  return (
    <div className="bg-[#1A1A1C] border border-[#333333] p-6 shadow-xl space-y-5">
      {/* Primary KPI Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#333333]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-oswald text-xs uppercase tracking-widest text-[#FFD700] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" /> Cotización Oficial
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-oswald text-[10px] uppercase font-bold bg-[#D32F2F] text-white">
              <Clock className="w-3 h-3" /> {result.calculatedMonths} MES{result.calculatedMonths > 1 ? 'ES' : ''} ({result.calculatedWeeks} SEMANAS)
            </span>

            {result.isZeroInitial && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-oswald text-[10px] uppercase font-bold bg-[#FFD700] text-[#111113]">
                0% SIN INICIAL
              </span>
            )}

            {result.isVipInitial && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-oswald text-[10px] uppercase font-bold bg-[#FFD700] text-[#111113]">
                <Crown className="w-3 h-3 text-[#111113]" /> INICIAL VIP 25%
              </span>
            )}
          </div>
          <h3 className="text-2xl font-oswald uppercase tracking-tight text-white mt-1">
            Resumen de Financiamiento
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onSaveComparison}
            className="px-3.5 py-2 font-oswald uppercase text-xs font-bold bg-[#000000] hover:bg-[#333333] text-zinc-200 border border-[#333333] transition-all flex items-center gap-1.5"
            title="Guardar opción para comparar"
          >
            <PlusCircle className="w-4 h-4 text-[#FFD700]" />
            <span>Comparar</span>
          </button>
          <button
            onClick={onOpenExport}
            className="px-4 py-2 font-oswald uppercase text-xs font-bold bg-[#FFD700] text-[#111113] hover:bg-yellow-400 transition-all flex items-center gap-1.5 shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Crimson Red Background Stat Card (as in Variation 4) */}
      <div className="bg-[#D32F2F] p-5 border border-red-700 shadow-md text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-oswald text-xs uppercase tracking-widest text-white/90 block mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-white" />
              Cuota Semanal ({result.calculatedWeeks} Semanas)
            </span>
            <div className="font-oswald text-4xl sm:text-5xl font-bold tracking-tight text-[#FFD700] leading-none my-1">
              {formattedWeekly}
            </div>
            <p className="text-xs text-white/80 font-mono mt-1">
              ${result.weeklyPayment.toFixed(2)} USDT / semana ({result.calculatedWeeks} cuotas consecutivas)
            </p>
          </div>

          <div className="sm:text-right">
            <div className="inline-block bg-[#111113] border border-[#FFD700] px-3 py-1 font-oswald text-xs uppercase font-bold text-[#FFD700]">
              Plazo {result.calculatedMonths} {result.calculatedMonths === 1 ? 'Mes' : 'Meses'} ({result.calculatedWeeks} Semanas)
            </div>
          </div>
        </div>
      </div>

      {/* Secondary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Inicial */}
        <div className={`bg-[#000000] border p-4 space-y-1 ${
          result.isZeroInitial ? 'border-[#FFD700]' : result.isVipInitial ? 'border-[#FFD700]' : 'border-[#333333]'
        }`}>
          <span className="font-oswald text-xs uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>Inicial Requerido ({result.initialPercentage}%)</span>
            {result.isVipInitial && <Crown className="w-3.5 h-3.5 text-[#FFD700]" />}
          </span>
          <span className="font-oswald text-2xl font-bold text-[#FFD700] block truncate">
            {formattedInitial}
          </span>
          <span className="text-xs text-zinc-400 block font-mono">
            {result.initialPercentage === 0 ? 'Sin inicial requerido ($0 USDT)' : `$${result.initialAmount.toFixed(2)} USDT (${result.initialPercentage}% del monto total)`}
          </span>
        </div>

        {/* Monto Financiado */}
        <div className="bg-[#000000] border border-[#333333] p-4 space-y-1">
          <span className="font-oswald text-xs uppercase tracking-widest text-zinc-400 block">
            Monto a Financiar
          </span>
          <span className="font-oswald text-2xl font-bold text-white block truncate">
            {formattedFinanced}
          </span>
          <span className="text-xs text-zinc-400 block font-mono">
            ${result.financedAmount.toFixed(2)} USDT financiado ({result.monthlyInterestPercentage}% recargo/mes s/ financiado)
          </span>
        </div>
      </div>
    </div>
  );
};
