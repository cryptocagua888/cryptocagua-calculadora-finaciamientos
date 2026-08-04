import { FinancingParams, FinancingResult, PaymentScheduleItem, GainTierConfig } from '../types';

export const DEFAULT_GAIN_TIERS: GainTierConfig = {
  tier1Max: 500,
  tier1Rate: 20,
  tier2Max: 1000,
  tier2Rate: 17,
  tier3Max: 5000,
  tier3Rate: 14,
  tier4Rate: 10,
  initialFeeRate: 3,
};

export function getGainRateForAmount(amount: number, config: GainTierConfig = DEFAULT_GAIN_TIERS): { rate: number; tierLabel: string } {
  if (amount <= config.tier1Max) {
    return { rate: config.tier1Rate, tierLabel: `$1 - $${config.tier1Max}` };
  } else if (amount <= config.tier2Max) {
    return { rate: config.tier2Rate, tierLabel: `$${config.tier1Max + 1} - $${config.tier2Max}` };
  } else if (amount <= config.tier3Max) {
    return { rate: config.tier3Rate, tierLabel: `$${config.tier2Max + 1} - $${config.tier3Max}` };
  } else {
    return { rate: config.tier4Rate, tierLabel: `>$${config.tier3Max}` };
  }
}

export function calculateFinancing(params: FinancingParams): FinancingResult {
  const { totalAmount, initialPercentage, termMonths, monthlyCapacity, calculationMode, tierConfig } = params;
  
  const activeTiers = tierConfig || DEFAULT_GAIN_TIERS;

  // Ensure initial percentage is strictly between 25% and 70%
  const clampedInitialPct = Math.min(Math.max(initialPercentage, 25), 70);
  const baseInitialAmount = totalAmount * (clampedInitialPct / 100);
  const initialFeeRate = activeTiers.initialFeeRate ?? 3;
  const initialFee = baseInitialAmount * (initialFeeRate / 100); // configurable fee on initial amount (default 3%)
  const initialAmount = baseInitialAmount + initialFee; // Total initial payable

  const financedAmount = totalAmount - baseInitialAmount;

  // Tier interest rate evaluated on financed amount
  const { rate: gainPercentage, tierLabel: appliedTierLabel } = getGainRateForAmount(financedAmount, activeTiers);
  const gainRateDecimal = gainPercentage / 100;

  let months = termMonths;
  let monthlyPayment = 0;

  // Monthly gain fee based on financed amount
  const monthlyInterestFee = financedAmount * gainRateDecimal;

  if (calculationMode === 'capacity') {
    if (monthlyCapacity > monthlyInterestFee && financedAmount > 0) {
      const rawMonths = financedAmount / (monthlyCapacity - monthlyInterestFee);
      months = Math.max(1, Math.min(Math.ceil(rawMonths), 36));
      monthlyPayment = monthlyCapacity;
    } else {
      months = termMonths || 6;
      monthlyPayment = (financedAmount + (monthlyInterestFee * months)) / months;
    }
  } else {
    months = Math.max(1, Math.min(termMonths, 36));
    const totalInterest = monthlyInterestFee * months;
    monthlyPayment = months > 0 ? (financedAmount + totalInterest) / months : 0;
  }

  const totalInterestAmount = monthlyInterestFee * months;
  const totalToPayWithInterest = totalAmount + totalInterestAmount + initialFee;

  // Build Payment Schedule
  const schedule: PaymentScheduleItem[] = [];
  let remainingBalance = financedAmount + totalInterestAmount;
  const now = new Date();

  const monthlyPrincipal = financedAmount / months;
  const monthlyInterest = monthlyInterestFee;

  for (let i = 1; i <= months; i++) {
    const paymentDate = new Date(now.getFullYear(), now.getMonth() + i, now.getDate());
    const dateFormatted = paymentDate.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const isLastMonth = i === months;
    const currentMonthlyPayment = isLastMonth ? remainingBalance : (monthlyPrincipal + monthlyInterest);
    remainingBalance = Math.max(0, remainingBalance - currentMonthlyPayment);

    schedule.push({
      month: i,
      paymentDate: dateFormatted,
      principalPayment: monthlyPrincipal,
      interestPayment: monthlyInterest,
      totalMonthlyPayment: currentMonthlyPayment,
      remainingBalance: remainingBalance
    });
  }

  const isWithinCapacity = monthlyCapacity <= 0 || monthlyPayment <= monthlyCapacity;
  const capacityDifference = monthlyCapacity > 0 ? monthlyPayment - monthlyCapacity : 0;

  const isVipTerm = months > 6;
  const isVipInitial = clampedInitialPct === 25;

  return {
    totalAmount,
    baseInitialAmount,
    initialFee,
    initialFeePercentage: initialFeeRate,
    initialAmount,
    initialPercentage: clampedInitialPct,
    financedAmount,
    monthlyInterestPercentage: gainPercentage,
    appliedTierLabel,
    totalInterestAmount,
    totalToPayWithInterest,
    monthlyPayment,
    calculatedMonths: months,
    schedule,
    isWithinCapacity,
    capacityDifference,
    isVipTerm,
    isVipInitial
  };
}


export function formatCurrency(amount: number, _currency: 'USDT' = 'USDT', _exchangeRateVES?: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
}
