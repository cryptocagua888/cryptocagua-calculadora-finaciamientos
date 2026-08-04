export interface GainTierConfig {
  tier1Max: number; // default 500
  tier1Rate: number; // default 20%
  tier2Max: number; // default 1000
  tier2Rate: number; // default 17%
  tier3Max: number; // default 5000
  tier3Rate: number; // default 14%
  tier4Rate: number; // default 10%
}

export interface FinancingParams {
  totalAmount: number;
  initialPercentage: number; // 25 to 70
  termMonths: number; // 1 to 24
  monthlyCapacity: number; // User's monthly payment capacity in USD
  calculationMode: 'months' | 'capacity'; // Whether user selects term or enters capacity
  currency: 'USDT';
  exchangeRateVES?: number; // Optional fallback
  monthlyGainPercentage?: number; // Legacy fallback
  tierConfig?: GainTierConfig;
}

export interface PaymentScheduleItem {
  month: number;
  paymentDate: string;
  principalPayment: number;
  interestPayment: number;
  totalMonthlyPayment: number;
  remainingBalance: number;
}

export interface FinancingResult {
  totalAmount: number;
  initialAmount: number;
  initialPercentage: number;
  financedAmount: number;
  monthlyInterestPercentage: number;
  appliedTierLabel: string;
  totalInterestAmount: number;
  totalToPayWithInterest: number;
  monthlyPayment: number;
  calculatedMonths: number;
  schedule: PaymentScheduleItem[];
  isWithinCapacity: boolean;
  capacityDifference: number;
  isVipTerm: boolean; // More than 6 months
  isVipInitial: boolean; // Exactly 25% initial
}

export interface SavedSimulation {
  id: string;
  date: string;
  title: string;
  totalAmount: number;
  initialPercentage: number;
  termMonths: number;
  monthlyPayment: number;
  financedAmount: number;
  totalToPay: number;
}
