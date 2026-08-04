import React, { useState, useMemo } from 'react';
import { FinancingParams, SavedSimulation, GainTierConfig } from './types';
import { calculateFinancing, DEFAULT_GAIN_TIERS } from './utils/calculator';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultSummary } from './components/ResultSummary';
import { AmortizationTable } from './components/AmortizationTable';
import { ExportModal } from './components/ExportModal';
import { AdminModal } from './components/AdminModal';
import { ComparisonView } from './components/ComparisonView';
import { Coins } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<FinancingParams>({
    totalAmount: 1000,
    initialPercentage: 30,
    termMonths: 6,
    monthlyCapacity: 200,
    calculationMode: 'months',
    currency: 'USDT',
    tierConfig: DEFAULT_GAIN_TIERS,
  });

  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Compute live financing result
  const result = useMemo(() => calculateFinancing(params), [params]);

  // Monthly interest fee in USDT
  const monthlyInterestFee = result.totalAmount * (result.monthlyInterestPercentage / 100);

  const handleParamChange = (updated: Partial<FinancingParams>) => {
    setParams((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateTierConfig = (newConfig: GainTierConfig) => {
    handleParamChange({ tierConfig: newConfig });
  };

  const handleSaveComparison = () => {
    const newSim: SavedSimulation = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-VE'),
      title: `${params.initialPercentage}% Inicial - ${result.calculatedMonths} Meses`,
      totalAmount: result.totalAmount,
      initialPercentage: result.initialPercentage,
      termMonths: result.calculatedMonths,
      monthlyPayment: result.monthlyPayment,
      financedAmount: result.financedAmount,
      totalToPay: result.totalAmount + result.totalInterestAmount,
    };

    setSavedSimulations((prev) => [newSim, ...prev.slice(0, 5)]);
  };

  const handleRemoveSimulation = (id: string) => {
    setSavedSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Header */}
      <Header
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Tagline */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Calculadora de Financiamiento <span className="text-emerald-400">Cryptocagua</span>
          </h2>
          <p className="text-sm text-slate-400">
            Simula tu financiamiento con inicial desde <strong>25% hasta 70%</strong> y cuotas mensuales adaptadas a tu capacidad de pago.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            <CalculatorForm
              params={params}
              onChange={handleParamChange}
              monthlyInterestFee={monthlyInterestFee}
            />
          </div>

          {/* Right Column: Result KPI & Schedule (7 cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            <ResultSummary
              result={result}
              onOpenExport={() => setIsExportModalOpen(true)}
              onSaveComparison={handleSaveComparison}
            />

            <AmortizationTable
              schedule={result.schedule}
            />
          </div>
        </div>

        {/* Saved Comparison Drawer (if any saved) */}
        <ComparisonView
          simulations={savedSimulations}
          onRemove={handleRemoveSimulation}
          onClearAll={() => setSavedSimulations([])}
        />
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        tierConfig={params.tierConfig || DEFAULT_GAIN_TIERS}
        onUpdateTierConfig={handleUpdateTierConfig}
      />

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">Cryptocagua Financing System</span>
            <span>•</span>
            <span>Financiamiento Flexible</span>
          </div>

          <p className="text-slate-400 flex items-center gap-1">
            <span>Simulador de Cuotas & Amortización</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

