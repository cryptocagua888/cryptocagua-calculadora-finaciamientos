import React from 'react';
import { FinancingResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { CheckCircle2, AlertTriangle, Calendar, Crown, Sparkles } from 'lucide-react';

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
  const formattedMonthly = formatCurrency(result.monthlyPayment);
  const formattedInitial = formatCurrency(result.initialAmount);
  const formattedFinanced = formatCurrency(result.financedAmount);

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Decorative Accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Primary KPI Header */}
      <div className="relative z-10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Resultado de la Cotización
              </span>

              {result.isVipTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-300 border border-purple-500/50 animate-pulse">
                  <Sparkles className="w-3 h-3 text-purple-400" /> PLAN VIP ({result.calculatedMonths} MESES)
                </span>
              )}

              {result.isVipInitial && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-500/50">
                  <Crown className="w-3 h-3 text-amber-400" /> INICIAL VIP 25%
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              Resumen de Financiamiento
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onSaveComparison}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm min-h-[38px]"
              title="Guardar opción para comparar"
            >
              + Comparar
            </button>
            <button
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 min-h-[38px]"
            >
              Exportar
            </button>
          </div>
        </div>

        {/* Hero Card: Cuota Mensual */}
        <div className={`bg-gradient-to-br from-slate-950 via-slate-900 border rounded-xl p-4 sm:p-5 shadow-inner transition-all ${
          result.isVipTerm
            ? 'to-purple-950/40 border-purple-500/40 ring-1 ring-purple-500/20'
            : 'to-emerald-950/40 border-emerald-500/40'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 flex-wrap">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Cuota Mensual Estimada ({result.calculatedMonths} {result.calculatedMonths === 1 ? 'Mes' : 'Meses'})
                {result.isVipTerm && (
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                    VIP &gt; 6 M
                  </span>
                )}
              </p>
              <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-300 mt-1 tracking-tight">
                {formattedMonthly}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ${result.monthlyPayment.toFixed(2)} USDT / mes
              </p>
            </div>

            {/* Capacity Status Badge */}
            <div className="sm:text-right">
              {result.isWithinCapacity ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dentro de Capacidad</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Excede por ${result.capacityDifference.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Inicial */}
          <div className={`border rounded-xl p-3.5 space-y-1 ${
            result.isVipInitial ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>Inicial ({result.initialPercentage}%)</span>
              {result.isVipInitial && <Crown className="w-3 h-3 text-amber-400" />}
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-white block truncate">
              {formattedInitial}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ${result.initialAmount.toFixed(2)} USDT
            </span>
          </div>

          {/* Monto Financiado */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 block">Monto a Financiar</span>
            <span className="text-sm sm:text-base font-bold font-mono text-white block truncate">
              {formattedFinanced}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ${result.financedAmount.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

