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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1A1A1C] border border-[#333333] border-t-4 border-t-[#D32F2F] max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-[#000000] border border-[#333333] hover:border-[#FFD700] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-[#D32F2F] text-white shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-oswald uppercase text-[#FFD700] flex items-center gap-2">
              Panel Administrativo
            </h3>
            <p className="text-xs text-zinc-400">
              Configura las tasas de ganancia escalonadas por monto total.
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="bg-[#000000] border border-[#333333] p-4 space-y-2">
              <label className="font-oswald text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#FFD700]" />
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
                className="w-full px-3 py-2.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-mono text-sm focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            {authError && (
              <div className="p-3 bg-[#D32F2F]/20 border border-[#D32F2F] text-white text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D32F2F]" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 font-oswald uppercase font-bold text-xs bg-[#FFD700] text-[#111113] hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Acceder al Panel
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#000000] border border-[#FFD700] text-[#FFD700] flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FFD700] shrink-0" />
                <span>Autenticado correctamente.</span>
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="font-oswald text-xs uppercase text-zinc-400 hover:text-[#FFD700] flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-oswald text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 pt-1">
                <Percent className="w-4 h-4 text-[#FFD700]" />
                Tasas de Ganancia por Tramos de Monto Total:
              </p>

              {/* Tier 1 */}
              <div className="bg-[#000000] border border-[#333333] p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xs uppercase text-[#FFD700]">Tramo 1: $1 a ${tempConfig.tier1Max} USDT</span>
                  <span className="font-oswald text-xs font-bold text-[#FFD700] bg-[#1A1A1C] px-2 py-0.5 border border-[#333333]">
                    {tempConfig.tier1Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier1Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier1Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-base font-bold focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-[#000000] border border-[#333333] p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xs uppercase text-[#FFD700]">Tramo 2: ${tempConfig.tier1Max + 1} a ${tempConfig.tier2Max} USDT</span>
                  <span className="font-oswald text-xs font-bold text-[#FFD700] bg-[#1A1A1C] px-2 py-0.5 border border-[#333333]">
                    {tempConfig.tier2Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier2Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier2Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-base font-bold focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-[#000000] border border-[#333333] p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xs uppercase text-[#FFD700]">Tramo 3: ${tempConfig.tier2Max + 1} a ${tempConfig.tier3Max} USDT</span>
                  <span className="font-oswald text-xs font-bold text-[#FFD700] bg-[#1A1A1C] px-2 py-0.5 border border-[#333333]">
                    {tempConfig.tier3Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier3Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier3Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-base font-bold focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Tier 4 */}
              <div className="bg-[#000000] border border-[#333333] p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xs uppercase text-[#FFD700]">Tramo 4: ${tempConfig.tier3Max + 1} a ${tempConfig.tier4Max} USDT</span>
                  <span className="font-oswald text-xs font-bold text-[#FFD700] bg-[#1A1A1C] px-2 py-0.5 border border-[#333333]">
                    {tempConfig.tier4Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier4Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier4Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-base font-bold focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Tier 5 */}
              <div className="bg-[#000000] border border-[#333333] p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xs uppercase text-[#FFD700]">Tramo 5: Más de ${tempConfig.tier4Max} USDT</span>
                  <span className="font-oswald text-xs font-bold text-[#FFD700] bg-[#1A1A1C] px-2 py-0.5 border border-[#333333]">
                    {tempConfig.tier5Rate}% mensual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono">Tasa %:</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={tempConfig.tier5Rate}
                    onChange={(e) => setTempConfig({ ...tempConfig, tier5Rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-[#1A1A1C] border border-[#333333] text-[#FFD700] font-oswald text-base font-bold focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-[#000000] border border-[#FFD700] text-[#FFD700] text-center font-oswald text-sm uppercase">
                ¡Tasas por tramos actualizadas con éxito!
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="w-1/3 py-2.5 font-oswald uppercase text-xs font-bold border border-[#333333] text-zinc-300 hover:bg-[#000000] transition-all"
              >
                Salir
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-2/3 py-2.5 font-oswald uppercase text-xs font-bold bg-[#FFD700] text-[#111113] hover:bg-yellow-400 transition-all flex items-center justify-center gap-1.5"
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
