import React from 'react';
import { SavedSimulation } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Scale, Trash2 } from 'lucide-react';

interface ComparisonViewProps {
  simulations: SavedSimulation[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  simulations,
  onRemove,
  onClearAll,
}) => {
  if (simulations.length === 0) return null;

  return (
    <div className="bg-[#1A1A1C] border border-[#333333] p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-[#FFD700]" />
          <h3 className="text-lg font-oswald uppercase text-[#FFD700]">
            Comparativa de Escenarios ({simulations.length})
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="font-oswald text-xs uppercase text-zinc-400 hover:text-[#D32F2F] transition-colors"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {simulations.map((sim, index) => (
          <div
            key={sim.id}
            className="bg-[#000000] border border-[#333333] p-4 relative space-y-3 hover:border-[#FFD700] transition-all"
          >
            <button
              onClick={() => onRemove(sim.id)}
              className="absolute top-3 right-3 text-zinc-500 hover:text-[#D32F2F] transition-colors p-1"
              title="Eliminar opción"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-[#FFD700] text-[#111113] font-oswald font-bold text-xs flex items-center justify-center">
                #{index + 1}
              </span>
              <h4 className="font-oswald text-sm font-bold text-white truncate pr-6 uppercase">
                {sim.title}
              </h4>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Monto Total:</span>
                <span>${sim.totalAmount.toLocaleString()} USDT</span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Inicial ({sim.initialPercentage}%):</span>
                <span>${(sim.totalAmount * sim.initialPercentage / 100).toFixed(2)} USDT</span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Monto Financiado:</span>
                <span>${sim.financedAmount.toFixed(2)} USDT</span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Plazo:</span>
                <span>{sim.termMonths} Meses ({sim.totalWeeks} Semanas)</span>
              </div>

              <div className="flex justify-between font-oswald font-bold text-base text-[#FFD700] pt-2 border-t border-[#333333]">
                <span>Cuota Semanal:</span>
                <span>{formatCurrency(sim.weeklyPayment)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
