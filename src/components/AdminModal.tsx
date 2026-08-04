import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Settings, Percent, Check, AlertCircle, Shield, RotateCcw } from 'lucide-react';
import { GainTierConfig } from '../types';
import { DEFAULT_GAIN_TIERS } from '../utils/calculator';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierConfig: GainTierConfig;
  onUpdateTierConfig: (newConfig: GainTierConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  tierConfig,
  onUpdateTierConfig,
}) => {
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [tempConfig, setTempConfig] = useState<GainTierConfig>(tierConfig || DEFAULT_GAIN_TIERS);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (tierConfig) {
      setTempConfig(tierConfig);
    }
  }, [tierConfig, isOpen]);

  if (!isOpen) return null;

  // Expected password from env variable or default
  const envPassword = (import.meta as unknown as { env?: { VITE_ADMIN_PASSWORD?: string } }).env?.VITE_ADMIN_PASSWORD;
  const expectedPassword = envPassword || 'cryptocagua_admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === expectedPassword.trim()) {
      setIsAuthenticated(true);
      setAuthError('');
      setTempConfig(tierConfig || DEFAULT_GAIN_TIERS);
    } else {
      setAuthError('Clave incorrecta. Verifica la clave de administrador.');
    }
  };

  const handleSave = () => {
    onUpdateTierConfig(tempConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setTempConfig(DEFAULT_GAIN_TIERS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Panel Administrativo
            </h3>
            <p className="text-xs text-slate-400">
              Configura las tasas de ganancia escalonadas por monto total.
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Ingresa la Clave de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError('');
                }}
                placeholder="Clave de acceso"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 min-h-[42px]"
            >
              <Unlock className="w-4 h-4" />
              Acceder al Panel
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Autenticado correctamente.</span>
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar por defecto
              </button>
            </div>

            <div className="space-y-3">
              {/* Initial Fee config */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-300">Recargo Aplicado a la Inicial (%)</span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tempConfig.initialFeeRate ?? 3}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Recargo %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.initialFeeRate ?? 3}
                    onChange={(e) => setTempConfig({ ...tempConfig, initialFeeRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <p className="text-slate-300 font-semibold flex items-center gap-1.5 pt-1">
                <Percent className="w-4 h-4 text-emerald-400" />
                Tasas de Ganancia por Tramos de Monto:
              </p>

              {/* Tier 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Tramo 1: $1 a ${tempConfig.tier1Max} USDT</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tempConfig.tier1Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier1Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier1Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Tramo 2: ${tempConfig.tier1Max + 1} a ${tempConfig.tier2Max} USDT</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tempConfig.tier2Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier2Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier2Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Tramo 3: ${tempConfig.tier2Max + 1} a ${tempConfig.tier3Max} USDT</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tempConfig.tier3Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier3Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier3Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Tier 4 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400">Tramo 4: Más de ${tempConfig.tier3Max} USDT</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tempConfig.tier4Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier4Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier4Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-center font-bold">
                ¡Tasas por tramos actualizadas con éxito!
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all min-h-[42px]"
              >
                Salir
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 min-h-[42px]"
              >
                <Settings className="w-4 h-4" />
                Guardar Tramos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
