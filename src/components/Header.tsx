import React from 'react';
import { Coins, ShieldCheck, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-emerald-500/20 text-white sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 shrink-0">
              <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  Financiamientos Cryptocagua
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Inicial 25% - 70%
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Simulador de Cuotas & Inicial Flexible</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-emerald-400 font-medium hidden sm:flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </p>
            </div>
          </div>

          {/* Admin Icon button for mobile */}
          <button
            onClick={onOpenAdminModal}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700 hover:border-amber-500/40 transition-all"
            title="Panel de Administración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Badge & Actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          {/* Currency Indicator (USDT Only) */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-300 min-h-[38px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Moneda: USDT</span>
          </div>

          {/* Desktop Admin Button */}
          <button
            onClick={onOpenAdminModal}
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all min-h-[38px]"
            title="Panel de Administración"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

