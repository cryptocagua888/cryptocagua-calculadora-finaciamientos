import React, { useState } from 'react';
import { FinancingResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { X, Copy, Check, MessageSquare, Share2 } from 'lucide-react';

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

  const scheduleText = result.schedule
    ? result.schedule
        .map(
          (item) =>
            `• Semana ${item.week} (${item.paymentDate}): ${formatCurrency(item.totalWeeklyPayment)}`
        )
        .join('\n')
    : '';

  const quoteText = `🚀 *COTIZACIÓN DE FINANCIAMIENTO CRYPTOCAGUA* 🚀
----------------------------------------
📌 *Monto Total:* ${formatCurrency(result.totalAmount)}
💵 *Inicial Seleccionada (${result.initialPercentage}%):* ${formatCurrency(result.initialAmount)}
💳 *Monto a Financiar:* ${formatCurrency(result.financedAmount)}
----------------------------------------
📅 *Plazo:* ${result.calculatedMonths} Meses (${result.calculatedWeeks} Semanas)
🗓️ *Cuota Semanal:* ${formatCurrency(result.weeklyPayment)}
----------------------------------------
📋 *CRONOGRAMA DE CUOTAS SEMANALES:*
${scheduleText}
----------------------------------------
✨ *Generado con la Calculadora Oficial de Financiamientos Cryptocagua*

💡 ¡Calcula tu próximo financiamiento aquí! 👇
🔗 https://cryptocagua-calculadora-finaciamien.vercel.app/`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1C] border border-[#333333] border-t-4 border-t-[#D32F2F] max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 bg-[#000000] border border-[#333333] hover:border-[#FFD700] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-[#D32F2F] text-white shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-oswald uppercase text-[#FFD700] flex items-center gap-2">
              Cotización Listo Para Compartir
            </h3>
            <p className="text-xs text-zinc-400">
              Formato optimizado para WhatsApp y Telegram.
            </p>
          </div>
        </div>

        {/* Formatted Text Box */}
        <div className="relative mb-5">
          <textarea
            readOnly
            value={quoteText}
            rows={12}
            className="w-full max-h-72 bg-[#000000] border border-[#333333] p-4 text-[#FFD700] font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="py-3 font-oswald uppercase text-xs font-bold bg-[#000000] hover:bg-[#333333] text-white border border-[#333333] transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-[#FFD700]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-3 font-oswald uppercase text-xs font-bold bg-[#FFD700] text-[#111113] hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-[#111113]" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
