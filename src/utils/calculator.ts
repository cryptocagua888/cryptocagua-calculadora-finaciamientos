import { FinancingParams, FinancingResult, PaymentScheduleItem, GainTierConfig } from '../types';

export const DEFAULT_GAIN_TIERS: GainTierConfig = {
  tier1Max: 100,
  tier1Rate: 25,
  tier2Max: 500,
  tier2Rate: 20,
  tier3Max: 1000,
  tier3Rate: 17,
  tier4Max: 5000,
  tier4Rate: 14,
  tier5Rate: 10,
  initialFeeRate: 0,
};

export function getGainRateForAmount(amount: number, config: GainTierConfig = DEFAULT_GAIN_TIERS): { rate: number; tierLabel: string } {
  if (amount <= config.tier1Max) {
    return { rate: config.tier1Rate, tierLabel: `$1 - $${config.tier1Max}` };
  } else if (amount <= config.tier2Max) {
    return { rate: config.tier2Rate, tierLabel: `$${config.tier1Max + 1} - $${config.tier2Max}` };
  } else if (amount <= config.tier3Max) {
    return { rate: config.tier3Rate, tierLabel: `$${config.tier2Max + 1} - $${config.tier3Max}` };
  } else if (amount <= config.tier4Max) {
    return { rate: config.tier4Rate, tierLabel: `$${config.tier3Max + 1} - $${config.tier4Max}` };
  } else {
    return { rate: config.tier5Rate, tierLabel: `>$${config.tier4Max}` };
  }
}

export function calculateFinancing(params: FinancingParams): FinancingResult {
  const { totalAmount, initialPercentage, tierConfig } = params;
  
  const activeTiers = tierConfig || DEFAULT_GAIN_TIERS;

  // Allow initial percentage between 0% and 70%
  const clampedInitialPct = Math.min(Math.max(initialPercentage, 0), 70);
  const isZeroInitial = clampedInitialPct === 0;

  // Tier interest rate evaluated on total amount of equipment/product
  // Rule: if initial percentage is 0%, interest rate is ALWAYS 25% regardless of total amount.
  let gainPercentage: number;
  let appliedTierLabel: string;

  if (isZeroInitial) {
    gainPercentage = activeTiers.tier1Rate;
    appliedTierLabel = '0% Inicial (25%)';
  } else {
    const tierInfo = getGainRateForAmount(totalAmount, activeTiers);
    gainPercentage = tierInfo.rate;
    appliedTierLabel = tierInfo.tierLabel;
  }
  const gainRateDecimal = gainPercentage / 100;

  // Dynamic financing term: 1, 2, or 3 months (4, 8, or 12 weeks)
  const rawMonths = params.termMonths || 3;
  const months = Math.min(Math.max(rawMonths, 1), 3);
  const weeks = months * 4;

  // 1. Initial payment calculated directly on base totalAmount (ZERO SURCHARGE ON INITIAL)
  const baseInitialAmount = totalAmount * (clampedInitialPct / 100);
  const initialFee = 0; // No surcharge on initial payment
  const initialAmount = baseInitialAmount;

  // 2. Interest fee calculated on complete product total amount for chosen months
  const monthlyInterestFee = totalAmount * gainRateDecimal;
  const totalInterestAmount = monthlyInterestFee * months; // Total interest over selected months
  
  // 3. Total amount after adding interest
  const totalToPayWithInterest = totalAmount + totalInterestAmount;

  // 4. Financed balance remaining to pay in weekly installments
  const financedAmount = totalToPayWithInterest - initialAmount;
  const weeklyPayment = weeks > 0 ? financedAmount / weeks : 0;

  // Build Weekly Payment Schedule
  const schedule: PaymentScheduleItem[] = [];
  let remainingBalance = financedAmount;
  const now = new Date();

  const weeklyPrincipal = (totalAmount * (1 - clampedInitialPct / 100)) / weeks;
  const weeklyInterest = (totalInterestAmount * (1 - clampedInitialPct / 100)) / weeks;

  for (let i = 1; i <= weeks; i++) {
    const paymentDate = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    const dateFormatted = paymentDate.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const isLastWeek = i === weeks;
    const currentWeeklyPayment = isLastWeek ? remainingBalance : weeklyPayment;
    remainingBalance = Math.max(0, remainingBalance - currentWeeklyPayment);

    schedule.push({
      week: i,
      paymentDate: dateFormatted,
      principalPayment: weeklyPrincipal,
      interestPayment: weeklyInterest,
      totalWeeklyPayment: currentWeeklyPayment,
      remainingBalance: remainingBalance
    });
  }

  const isVipInitial = clampedInitialPct === 25;

  return {
    totalAmount,
    baseInitialAmount,
    initialFee,
    initialFeePercentage: 0,
    initialAmount,
    initialPercentage: clampedInitialPct,
    financedAmount,
    monthlyInterestPercentage: gainPercentage,
    appliedTierLabel,
    totalInterestAmount,
    totalToPayWithInterest,
    weeklyPayment,
    calculatedMonths: months,
    calculatedWeeks: weeks,
    schedule,
    isVipInitial,
    isZeroInitial
  };
}


export function formatCurrency(amount: number, _currency: 'USDT' = 'USDT', _exchangeRateVES?: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
}
