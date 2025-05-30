import { Transaction, CreditCard, CreditCardPurchase, CreditCardSubscription, FinancialGoal, PlannedPurchase, Debt } from './types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salário',
    amount: 5000,
    description: 'Salário mensal',
    date: new Date(2024, 4, 1),
    isRecurring: true,
    recurringPattern: 'monthly'
  },
  {
    id: '2',
    type: 'income',
    category: 'Freelance',
    amount: 1200,
    description: 'Projeto web',
    date: new Date(2024, 4, 15),
    isRecurring: false
  },
  {
    id: '3',
    type: 'expense',
    category: 'Alimentação',
    amount: 800,
    description: 'Supermercado',
    date: new Date(2024, 4, 10),
    isRecurring: false
  },
  {
    id: '4',
    type: 'expense',
    category: 'Moradia',
    amount: 1500,
    description: 'Aluguel',
    date: new Date(2024, 4, 5),
    isRecurring: true,
    recurringPattern: 'monthly'
  }
];

export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    name: 'Nubank',
    limit: 5000,
    closingDay: 15,
    dueDay: 10,
    color: '#8A2BE2'
  },
  {
    id: '2',
    name: 'Itaú',
    limit: 3000,
    closingDay: 20,
    dueDay: 15,
    color: '#FF6600'
  }
];

export const mockCreditCardPurchases: CreditCardPurchase[] = [
  {
    id: '1',
    cardId: '1',
    description: 'Notebook Dell',
    amount: 2400,
    installments: 12,
    purchaseDate: new Date(2024, 4, 10),
    category: 'Eletrônicos'
  },
  {
    id: '2',
    cardId: '1',
    description: 'Supermercado',
    amount: 350,
    installments: 1,
    purchaseDate: new Date(2024, 4, 12),
    category: 'Alimentação'
  }
];

export const mockCreditCardSubscriptions: CreditCardSubscription[] = [
  {
    id: '1',
    cardId: '1',
    description: 'Netflix',
    amount: 45.90,
    startDate: new Date(2024, 0, 1),
    category: 'Entretenimento',
    isActive: true
  },
  {
    id: '2',
    cardId: '1',
    description: 'Spotify',
    amount: 21.90,
    startDate: new Date(2024, 1, 15),
    category: 'Entretenimento',
    isActive: true
  },
  {
    id: '3',
    cardId: '2',
    description: 'Adobe Creative',
    amount: 89.90,
    startDate: new Date(2024, 2, 1),
    category: 'Trabalho',
    isActive: true
  }
];

export const mockGoals: FinancialGoal[] = [
  {
    id: '1',
    title: 'Reserva de Emergência',
    targetAmount: 30000,
    currentAmount: 15000,
    deadline: new Date(2025, 0, 1),
    priority: 'high',
    category: 'emergency'
  },
  {
    id: '2',
    title: 'Viagem para Europa',
    targetAmount: 15000,
    currentAmount: 5000,
    deadline: new Date(2024, 11, 1),
    priority: 'medium',
    category: 'other'
  }
];

export const mockPlannedPurchases: PlannedPurchase[] = [
  {
    id: '1',
    item: 'iPhone 15',
    estimatedPrice: 4500,
    urgency: 'medium',
    canInstall: true,
    maxInstallments: 12,
    category: 'Eletrônicos'
  },
  {
    id: '2',
    item: 'Geladeira',
    estimatedPrice: 2800,
    urgency: 'high',
    canInstall: true,
    maxInstallments: 10,
    category: 'Eletrodomésticos'
  }
];

export const mockDebts: Debt[] = [
  {
    id: '1',
    name: 'Financiamento do Carro',
    totalAmount: 35000,
    remainingAmount: 15000,
    monthlyPayment: 850,
    interestRate: 1.2,
    installmentsLeft: 18,
    type: 'financing'
  }
];
