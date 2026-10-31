export interface GainTierConfig {
  tier1Max: number; // default 100 ($1 - $100)
  tier1Rate: number; // default 25%
  tier2Max: number; // default 500 ($101 - $500)
  tier2Rate: number; // default 20%
  tier3Max: number; // default 1000 ($501 - $1000)
  tier3Rate: number; // default 17%
  tier4Max: number; // default 5000 ($1001 - $5000)
  tier4Rate: number; // default 14%
  tier5Rate: number; // default 10% (> $5000)
  initialFeeRate?: number; // default 0
}

export interface FinancingParams {
  totalAmount: number;
  initialPercentage: number; // 0 to 70
  termMonths?: number; // 1, 2, or 3 months
  currency: 'USDT';
  tierConfig?: GainTierConfig;
}

export interface PaymentScheduleItem {
  week: number;
  paymentDate: string;
  principalPayment: number;
  interestPayment: number;
  totalWeeklyPayment: number;
  remainingBalance: number;
}

export interface FinancingResult {
  totalAmount: number;
  baseInitialAmount: number;
  initialFee: number;
  initialFeePercentage: number;
  initialAmount: number;
  initialPercentage: number;
  financedAmount: number;
  monthlyInterestPercentage: number;
  appliedTierLabel: string;
  totalInterestAmount: number;
  totalToPayWithInterest: number;
  weeklyPayment: number;
  calculatedMonths: number; // 1, 2, or 3
  calculatedWeeks: number; // 4, 8, or 12
  schedule: PaymentScheduleItem[];
  isVipInitial: boolean; // Exactly 25% initial
  isZeroInitial: boolean; // Exactly 0% initial
}

export interface SavedSimulation {
  id: string;
  date: string;
  title: string;
  totalAmount: number;
  initialPercentage: number;
  termMonths: number;
  totalWeeks: number;
  weeklyPayment: number;
  financedAmount: number;
  totalToPay: number;
}
