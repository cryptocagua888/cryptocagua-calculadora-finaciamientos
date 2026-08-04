import React, { useState } from 'react';
import { FinancingResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { X, Copy, Check, MessageSquare, Share2, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: FinancingResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const quoteText = `🚀 *COTIZACIÓN DE FINANCIAMIENTO CRYPTOCAGUA* 🚀
----------------------------------------
📌 *Monto Total:* ${formatCurrency(result.totalAmount)}
💵 *Inicial Seleccionada (${result.initialPercentage}%):* ${formatCurrency(result.initialAmount)}
💳 *Monto a Financiar:* ${formatCurrency(result.financedAmount)}
----------------------------------------
📅 *Plazo:* ${result.calculatedMonths} Meses
🗓️ *Cuota Mensual:* ${formatCurrency(result.monthlyPayment)}
----------------------------------------
✨ *Generado con la Calculadora Oficial de Financiamientos Cryptocagua*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(quoteText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Cotización Lista para Compartir
            </h3>
            <p className="text-xs text-slate-400">
              Formato optimizado para WhatsApp y Telegram.
            </p>
          </div>
        </div>

        {/* Formatted Text Box */}
        <div className="relative mb-5">
          <textarea
            readOnly
            value={quoteText}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Enviar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
