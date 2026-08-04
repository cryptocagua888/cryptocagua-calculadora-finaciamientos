import React from 'react';
import { SavedSimulation } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Scale, Trash2, ArrowRight } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            Comparativa de Escenarios ({simulations.length})
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
        >
          Limpiar Todo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {simulations.map((sim, index) => (
          <div
            key={sim.id}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 relative space-y-3 group hover:border-emerald-500/40 transition-all"
          >
            <button
              onClick={() => onRemove(sim.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Eliminar opción"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                #{index + 1}
              </span>
              <h4 className="text-sm font-bold text-white truncate pr-6">
                {sim.title}
              </h4>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Monto Total:</span>
                <span>${sim.totalAmount.toLocaleString()} USDT</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Inicial ({sim.initialPercentage}%):</span>
                <span>${(sim.totalAmount * sim.initialPercentage / 100).toFixed(2)} USDT</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Monto Financiado:</span>
                <span>${sim.financedAmount.toFixed(2)} USDT</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Plazo:</span>
                <span>{sim.termMonths} Meses</span>
              </div>

              <div className="flex justify-between font-bold text-emerald-400 pt-1.5 border-t border-slate-800/80">
                <span>Cuota Mensual:</span>
                <span>{formatCurrency(sim.monthlyPayment)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
