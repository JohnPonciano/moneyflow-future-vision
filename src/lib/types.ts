export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringPattern?: 'monthly' | 'weekly' | 'yearly';
  tags?: string[];
  relatedInvoiceId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
  availableLimit: number;
  currentBalance: number;
}

export interface CreditCardPurchase {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  installments: number;
  purchaseDate: Date;
  category: string;
  currentInstallment: number;
  remainingAmount: number;
  isPaid: boolean;
}

export interface CreditCardSubscription {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  startDate: Date;
  category: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  cardId: string;
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  paymentDate?: Date;
  paymentMethod?: 'pix' | 'transfer' | 'debit' | 'other';
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount: number;
  remainingAmount: number;
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'purchase' | 'debt' | 'other';
}

export interface PlannedPurchase {
  id: string;
  item: string;
  estimatedPrice: number;
  urgency: 'high' | 'medium' | 'low';
  canInstall: boolean;
  maxInstallments?: number;
  category: string;
  notes?: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  installmentsLeft: number;
  type: 'loan' | 'financing' | 'card' | 'other';
}

export interface FinancialSummary {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  projectedBalance: number;
}

export type FinancialLight = 'green' | 'yellow' | 'red';

export interface CreditCardInvoice {
  id: string;
  cardId: string;
  cardName: string;
  year: number;
  month: number;
  amount: number;
  status: 'pending' | 'paid';
  dueDate: Date;
  paidAt?: Date;
  paymentMethod?: string;
}
