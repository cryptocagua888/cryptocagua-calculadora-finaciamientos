import React from 'react';
import { Coins, ShieldCheck, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminModal,
}) => {
  return (
    <header className="bg-[#111113] border-b-4 border-[#D32F2F] text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-none bg-[#FFD700] flex items-center justify-center border border-[#FFD700] shrink-0">
              <Coins className="h-6 w-6 text-[#111113]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-oswald uppercase tracking-tight text-[#FFD700]">
                  CRYPTOCAGUA FINANCIAMIENTOS
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 font-oswald text-xs uppercase font-bold bg-[#D32F2F] text-white">
                  1 A 3 MESES
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 font-mono">
                <span>Financiamiento de 1 a 3 meses (cuotas semanales obligatorias)</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-[#FFD700] hidden sm:flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" /> Verificado
                </span>
              </p>
            </div>
          </div>

          {/* Admin Icon button for mobile */}
          <button
            onClick={onOpenAdminModal}
            className="md:hidden p-2 bg-[#1A1A1C] text-[#FFD700] border border-[#333333] hover:bg-[#FFD700] hover:text-[#111113] transition-all"
            title="Panel de Administración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Badge & Actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          {/* Currency Indicator (USDT Only) */}
          <div className="bg-[#1A1A1C] border border-[#333333] px-3.5 py-1.5 flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-[#FFD700]">
            <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse" />
            <span>Moneda: USDT</span>
          </div>

          {/* Desktop Admin Button */}
          <button
            onClick={onOpenAdminModal}
            className="hidden md:flex items-center space-x-1 px-4 py-2 font-oswald uppercase text-xs font-bold bg-[#1A1A1C] hover:bg-[#FFD700] text-[#FFD700] hover:text-[#111113] border border-[#333333] transition-all"
            title="Panel de Administración"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
