import React from 'react';
import { FinancingParams } from '../types';
import { getGainRateForAmount, DEFAULT_GAIN_TIERS } from '../utils/calculator';
import { DollarSign, Percent, Calendar, Wallet, HelpCircle, Check, Crown, Sparkles } from 'lucide-react';

interface CalculatorFormProps {
  params: FinancingParams;
  onChange: (updated: Partial<FinancingParams>) => void;
  monthlyInterestFee: number;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  params,
  onChange,
  monthlyInterestFee,
}) => {
  const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000];
  const PRESET_INITIALS = [25, 30, 40, 50, 60, 70];
  const PRESET_MONTHS = [1, 2, 3, 6, 9, 12, 18, 24];

  const { rate: currentGainPct, tierLabel } = getGainRateForAmount(params.totalAmount, params.tierConfig || DEFAULT_GAIN_TIERS);

  const handleInitialChange = (pct: number) => {
    const clamped = Math.min(Math.max(pct, 25), 70);
    onChange({ initialPercentage: clamped });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            Parámetros del Financiamiento
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura el monto, la inicial (25% a 70%) y el plazo según tu capacidad.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Monto Total */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Monto Total a Financiar (USDT)
            </label>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              ${params.totalAmount.toLocaleString('en-US')} USDT
            </span>
          </div>

          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
              $
            </div>
            <input
              type="number"
              min={10}
              max={100000}
              step={10}
              value={params.totalAmount || ''}
              onChange={(e) => onChange({ totalAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
              placeholder="Ej: 1000"
              className="w-full pl-9 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white font-mono text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-[48px]"
            />
          </div>

          {/* Quick Amount Presets */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-slate-400 mr-1">Rápido:</span>
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ totalAmount: amt })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all min-h-[36px] ${
                  params.totalAmount === amt
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Inicial (25% - 70%) */}
        <div className={`bg-slate-950/50 border rounded-xl p-4 transition-all ${params.initialPercentage === 25 ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-slate-800'}`}>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-400" />
              Monto Inicial (25% a 70%)
              {params.initialPercentage === 25 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  <Crown className="w-3 h-3 text-amber-400" /> VIP 25%
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                params.initialPercentage === 25
                  ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {params.initialPercentage}%
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                (${(params.totalAmount * (params.initialPercentage / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
          </div>

          {/* Percentage Slider */}
          <input
            type="range"
            min={25}
            max={70}
            step={1}
            value={params.initialPercentage}
            onChange={(e) => handleInitialChange(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-3 min-h-[32px]"
          />

          {/* Preset Buttons for Initial */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {PRESET_INITIALS.map((pct) => {
              const isVip25 = pct === 25;
              const isSelected = params.initialPercentage === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleInitialChange(pct)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all border text-center relative min-h-[40px] flex items-center justify-center gap-1 ${
                    isSelected
                      ? isVip25
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                        : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : isVip25
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isVip25 && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span>{pct}%</span>
                  {isVip25 && <span className="text-[9px] font-black uppercase text-amber-300 ml-0.5">VIP</span>}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              Restante a financiar: <strong className="text-slate-200 font-mono">${(params.totalAmount * (1 - params.initialPercentage / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</strong>
            </span>
          </p>
        </div>

        {/* 3. Modo de Cálculo */}
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            ¿Cómo deseas calcular tu financiamiento?
          </label>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onChange({ calculationMode: 'months' })}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                params.calculationMode === 'months'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Por Plazo (Meses)
            </button>
            <button
              type="button"
              onClick={() => onChange({ calculationMode: 'capacity' })}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                params.calculationMode === 'capacity'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Por Capacidad ($/mes)
            </button>
          </div>

          {/* Mode A: Select Term in Months */}
          {params.calculationMode === 'months' && (
            <div className={`bg-slate-950/40 border rounded-xl p-4 space-y-3 transition-all ${
              params.termMonths > 6 ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-slate-800/80'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  Duración del Financiamiento:
                  {params.termMonths > 6 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Sparkles className="w-3 h-3 text-purple-400" /> PLAN VIP (&gt; 6 MESES)
                    </span>
                  )}
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  params.termMonths > 6
                    ? 'text-purple-300 bg-purple-500/20 border-purple-500/40'
                    : 'text-emerald-400 bg-slate-900 border-slate-700'
                }`}>
                  {params.termMonths} {params.termMonths === 1 ? 'Mes' : 'Meses'}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={params.termMonths}
                onChange={(e) => onChange({ termMonths: parseInt(e.target.value) || 1 })}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 min-h-[32px]"
              />

              {/* Preset buttons with color variation for > 6 months (VIP) */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
                {PRESET_MONTHS.map((m) => {
                  const isVip = m > 6;
                  const isSelected = params.termMonths === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onChange({ termMonths: m })}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center min-h-[44px] ${
                        isSelected
                          ? isVip
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                            : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : isVip
                          ? 'bg-purple-950/30 text-purple-300 border-purple-800/60 hover:bg-purple-900/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{m} m</span>
                      {isVip && <span className="text-[9px] text-purple-300 font-extrabold">VIP</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode B: Input Monthly Capacity */}
          {params.calculationMode === 'capacity' && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">¿Cuánto puedes pagar cada mes? (Monto al gusto)</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Mínimo sugerido: ${Math.ceil(monthlyInterestFee * 1.2)} USDT/mes
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  $
                </div>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={params.monthlyCapacity || ''}
                  onChange={(e) => onChange({ monthlyCapacity: parseFloat(e.target.value) || 0 })}
                  placeholder={`Ej: ${Math.ceil(monthlyInterestFee * 1.5)}`}
                  className="w-full pl-9 pr-16 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-emerald-400 font-mono font-bold">
                  USDT/mes
                </div>
              </div>

              {/* Quick Capacity Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-400 mr-1">Preajustes:</span>
                {[50, 100, 150, 200, 300, 500].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => onChange({ monthlyCapacity: cap })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all min-h-[34px] ${
                      params.monthlyCapacity === cap
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    ${cap}
                  </button>
                ))}
              </div>

              {params.monthlyCapacity > 0 && params.monthlyCapacity <= monthlyInterestFee && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                  <span className="font-bold shrink-0">⚠️ Nota:</span>
                  <span>
                    El monto mínimo estimado para cubrir las cuotas es de <strong>${monthlyInterestFee.toFixed(2)} USDT</strong>. Se recomienda ingresar una capacidad superior.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

