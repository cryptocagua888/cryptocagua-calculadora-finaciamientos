import React from 'react';
import { FinancingParams } from '../types';
import { DollarSign, Percent, Calendar, Wallet, Check, Crown, Clock, Lock } from 'lucide-react';

interface CalculatorFormProps {
  params: FinancingParams;
  onChange: (updated: Partial<FinancingParams>) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  params,
  onChange,
}) => {
  const PRESET_AMOUNTS = [100, 200, 500, 1000, 2500, 5000];
  const PRESET_INITIALS = [0, 25, 30, 40, 50, 60, 70];

  const baseInitial = params.totalAmount * (params.initialPercentage / 100);

  const handleInitialChange = (pct: number) => {
    const clamped = Math.min(Math.max(pct, 0), 70);
    onChange({ initialPercentage: clamped });
  };

  const handleInitialAmountChange = (usdtVal: number) => {
    if (params.totalAmount <= 0) {
      onChange({ initialPercentage: 0 });
      return;
    }
    const pct = (usdtVal / params.totalAmount) * 100;
    const clamped = Math.min(Math.max(pct, 0), 70);
    onChange({ initialPercentage: clamped });
  };

  return (
    <div className="bg-[#1A1A1C] border border-[#333333] p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#333333] mb-6 gap-2">
        <div>
          <h2 className="text-xl font-oswald uppercase tracking-wider text-[#FFD700] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#FFD700]" />
            Parámetros del Financiamiento
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configura el monto total y el porcentaje de inicial (0% a 70%).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Monto Total */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-oswald text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#FFD700]" />
              Monto Total (USDT)
            </label>
            <span className="font-oswald text-sm font-bold text-[#FFD700] bg-[#000000] px-3 py-1 border border-[#333333]">
              ${params.totalAmount.toLocaleString('en-US')} USDT
            </span>
          </div>

          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFD700] font-oswald text-xl font-bold">
              $
            </div>
            <input
              type="number"
              min={10}
              max={100000}
              step={10}
              value={params.totalAmount || ''}
              onChange={(e) => onChange({ totalAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
              placeholder="1000"
              className="w-full pl-10 pr-4 py-3 bg-[#000000] border-2 border-[#333333] text-[#FFD700] font-oswald text-2xl font-bold focus:outline-none focus:border-[#FFD700] transition-colors"
            />
          </div>

          {/* Quick Amount Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-oswald text-xs uppercase tracking-wider text-zinc-500 mr-1">Rápido:</span>
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ totalAmount: amt })}
                className={`px-3 py-1.5 font-oswald text-xs font-bold uppercase transition-all border ${
                  params.totalAmount === amt
                    ? 'bg-[#FFD700] text-[#111113] border-[#FFD700]'
                    : 'bg-[#000000] text-zinc-300 border-[#333333] hover:border-[#FFD700] hover:text-[#FFD700]'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Inicial (0% - 70%) */}
        <div className={`bg-[#000000] border p-4 transition-all ${
          params.initialPercentage === 0 ? 'border-[#FFD700]' : params.initialPercentage === 25 ? 'border-[#FFD700]' : 'border-[#333333]'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <label className="font-oswald text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 flex-wrap">
              <Percent className="w-4 h-4 text-[#FFD700]" />
              Porcentaje Inicial (0% a 70%)
              {params.initialPercentage === 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 font-oswald text-[10px] font-bold uppercase bg-[#FFD700] text-[#111113]">
                  <Lock className="w-3 h-3 text-[#111113]" /> 0% SIN INICIAL
                </span>
              )}
              {params.initialPercentage === 25 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 font-oswald text-[10px] font-bold uppercase bg-[#D32F2F] text-white">
                  <Crown className="w-3 h-3 text-[#FFD700]" /> VIP 25%
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <span className="font-oswald text-sm font-bold px-2.5 py-0.5 border text-[#FFD700] bg-[#1A1A1C] border-[#333333]">
                {params.initialPercentage}%
              </span>
              <span className="font-mono text-xs text-zinc-400 hidden sm:inline">
                (${baseInitial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT)
              </span>
            </div>
          </div>

          {/* Input directo en USDT o Porcentaje */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="font-oswald text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                Monto Inicial (USDT)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#FFD700] font-oswald font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={params.totalAmount * 0.7}
                  value={Number(baseInitial.toFixed(2))}
                  onChange={(e) => handleInitialAmountChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-lg font-bold focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            <div>
              <label className="font-oswald text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                Porcentaje de Inicial (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="70"
                  value={Number(params.initialPercentage.toFixed(2))}
                  onChange={(e) => handleInitialChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-7 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-lg font-bold focus:outline-none focus:border-[#FFD700]"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 font-oswald">%</span>
              </div>
            </div>
          </div>

          {/* Percentage Slider */}
          <input
            type="range"
            min={0}
            max={70}
            step={0.5}
            value={params.initialPercentage}
            onChange={(e) => handleInitialChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-[#1A1A1C] rounded-none appearance-none cursor-pointer accent-[#FFD700] mb-3"
          />

          {/* Preset Buttons for Initial */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {PRESET_INITIALS.map((pct) => {
              const isZero = pct === 0;
              const isVip25 = pct === 25;
              const isSelected = params.initialPercentage === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleInitialChange(pct)}
                  className={`py-2 px-1 font-oswald text-xs font-bold uppercase border transition-all flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#FFD700] text-[#111113] border-[#FFD700]'
                      : isZero
                      ? 'bg-[#1A1A1C] text-[#FFD700] border-[#FFD700]/50 hover:bg-[#FFD700] hover:text-[#111113]'
                      : isVip25
                      ? 'bg-[#1A1A1C] text-[#FFD700] border-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'
                      : 'bg-[#1A1A1C] text-zinc-300 border-[#333333] hover:border-[#FFD700] hover:text-[#FFD700]'
                  }`}
                >
                  {isZero && <Lock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#111113]' : 'text-[#FFD700]'}`} />}
                  {isVip25 && <Crown className="w-3 h-3 text-[#FFD700] shrink-0" />}
                  <span>{pct}%</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-400 mt-3 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
              Restante a financiar: <strong className="text-white font-oswald text-sm">${(params.totalAmount * (1 - params.initialPercentage / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</strong>
            </span>
          </p>
        </div>

        {/* 3. Selección del Plazo (1 a 3 Meses) */}
        <div className="bg-[#000000] border border-[#333333] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-oswald text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FFD700]" />
              Plazo del Financiamiento
            </span>
            <span className="font-oswald text-xs font-bold uppercase bg-[#D32F2F] text-white px-2.5 py-1">
              {params.termMonths || 3} MES{(params.termMonths || 3) > 1 ? 'ES' : ''} ({((params.termMonths || 3) * 4)} SEMANAS)
            </span>
          </div>

          {/* Term selector buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((months) => {
              const isSelected = (params.termMonths || 3) === months;
              const totalWeeks = months * 4;
              return (
                <button
                  key={months}
                  type="button"
                  onClick={() => onChange({ termMonths: months })}
                  className={`py-2.5 px-2 font-oswald text-xs font-bold uppercase border transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-[#FFD700] text-[#111113] border-[#FFD700] shadow-md'
                      : 'bg-[#1A1A1C] text-zinc-300 border-[#333333] hover:border-[#FFD700] hover:text-[#FFD700]'
                  }`}
                >
                  <span className="text-sm font-extrabold">{months} {months === 1 ? 'Mes' : 'Meses'}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#111113]' : 'text-zinc-400'}`}>
                    ({totalWeeks} semanas)
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#1A1A1C] border border-[#333333] flex items-center gap-3">
            <div className="p-2 bg-[#D32F2F] text-white shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-oswald uppercase text-sm font-bold text-[#FFD700]">Pagos Obligatoriamente Semanales</p>
              <p className="text-zinc-400 text-xs mt-0.5">
                El financiamiento es a {params.termMonths || 3} { (params.termMonths || 3) === 1 ? 'mes' : 'meses' } divididos en {((params.termMonths || 3) * 4)} cuotas semanales consecutivas (1 cuota cada 7 días).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
