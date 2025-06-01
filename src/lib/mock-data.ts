
import { Transaction, CreditCard, CreditCardPurchase, CreditCardSubscription, FinancialGoal, PlannedPurchase } from '@/lib/types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salário',
    amount: 5000,
    description: 'Salário mensal',
    date: new Date('2024-01-01'),
    isRecurring: true,
    recurringPattern: 'monthly',
    tags: ['trabalho', 'principal']
  },
  {
    id: '2',
    type: 'expense',
    category: 'Alimentação',
    amount: 150,
    description: 'Supermercado',
    date: new Date('2024-01-02'),
    isRecurring: false,
    tags: ['casa', 'necessário']
  },
  {
    id: '3',
    type: 'expense',
    category: 'Transporte',
    amount: 80,
    description: 'Combustível',
    date: new Date('2024-01-03'),
    isRecurring: false,
    tags: ['carro', 'combustível']
  }
];

export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    name: 'Nubank',
    limit: 2000,
    closingDay: 15,
    dueDay: 10,
    color: '#8A2BE2',
    availableLimit: 1500,
    currentBalance: 500
  },
  {
    id: '2',
    name: 'Itaú',
    limit: 3000,
    closingDay: 20,
    dueDay: 15,
    color: '#FF6600',
    availableLimit: 2500,
    currentBalance: 500
  }
];

export const mockPurchases: CreditCardPurchase[] = [
  {
    id: '1',
    cardId: '1',
    description: 'Smartphone',
    amount: 800,
    installments: 10,
    purchaseDate: new Date('2024-01-01'),
    category: 'Eletrônicos',
    currentInstallment: 1,
    remainingAmount: 800,
    isPaid: false
  },
  {
    id: '2',
    cardId: '2',
    description: 'Notebook',
    amount: 1200,
    installments: 12,
    purchaseDate: new Date('2024-01-05'),
    category: 'Eletrônicos',
    currentInstallment: 1,
    remainingAmount: 1200,
    isPaid: false
  }
];

export const mockSubscriptions: CreditCardSubscription[] = [
  {
    id: '1',
    cardId: '1',
    description: 'Netflix',
    amount: 32.90,
    startDate: new Date('2024-01-01'),
    category: 'Entretenimento',
    isActive: true
  },
  {
    id: '2',
    cardId: '2',
    description: 'Spotify',
    amount: 21.90,
    startDate: new Date('2024-01-01'),
    category: 'Entretenimento',
    isActive: true
  }
];

export const mockGoals: FinancialGoal[] = [
  {
    id: '1',
    title: 'Reserva de Emergência',
    targetAmount: 10000,
    currentAmount: 2500,
    deadline: new Date('2024-12-31'),
    priority: 'high',
    category: 'emergency'
  },
  {
    id: '2',
    title: 'Viagem para Europa',
    targetAmount: 8000,
    currentAmount: 1200,
    deadline: new Date('2024-06-30'),
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
    category: 'Eletrônicos',
    notes: 'Aguardando promoção'
  },
  {
    id: '2',
    item: 'Geladeira',
    estimatedPrice: 2200,
    urgency: 'high',
    canInstall: true,
    maxInstallments: 10,
    category: 'Eletrodomésticos',
    notes: 'Geladeira atual com defeito'
  }
];
