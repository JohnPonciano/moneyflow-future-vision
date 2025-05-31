import { useState, useCallback } from 'react';
import { Invoice, CreditCard, Transaction, CreditCardPurchase } from '../lib/types';

// Dados de exemplo
const mockCards: CreditCard[] = [
  {
    id: '1',
    name: 'Nubank',
    limit: 5000,
    closingDay: 15,
    dueDay: 25,
    color: '#8A05BE',
    availableLimit: 3500,
    currentBalance: 1500
  },
  {
    id: '2',
    name: 'Itaú',
    limit: 3000,
    closingDay: 10,
    dueDay: 20,
    color: '#EC7000',
    availableLimit: 2000,
    currentBalance: 1000
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    cardId: '1',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    amount: 1500,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
    isPaid: false,
    paymentStatus: 'pending',
    paidAmount: 0,
    remainingAmount: 1500,
    purchases: [],
    subscriptions: []
  },
  {
    id: '2',
    cardId: '2',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    amount: 1000,
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
    isPaid: false,
    paymentStatus: 'pending',
    paidAmount: 0,
    remainingAmount: 1000,
    purchases: [],
    subscriptions: []
  }
];

export function usePayments() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [cards, setCards] = useState<CreditCard[]>(mockCards);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const payInvoice = useCallback((invoiceId: string, paymentMethod: 'pix' | 'transfer' | 'debit' | 'other') => {
    setInvoices(prevInvoices => {
      const updatedInvoices = prevInvoices.map(invoice => {
        if (invoice.id === invoiceId) {
          // Atualiza o status da fatura
          const updatedInvoice: Invoice = {
            ...invoice,
            isPaid: true,
            paymentDate: new Date(),
            paymentMethod,
            paymentStatus: 'paid',
            paidAmount: invoice.amount,
            remainingAmount: 0
          };

          // Cria uma nova transação para o pagamento
          const paymentTransaction: Transaction = {
            id: `payment-${invoiceId}`,
            type: 'expense',
            category: 'credit-card-payment',
            amount: invoice.amount,
            description: `Pagamento da fatura do cartão ${invoice.cardId}`,
            date: new Date(),
            isRecurring: false,
            relatedInvoiceId: invoiceId
          };

          setTransactions(prev => [...prev, paymentTransaction]);

          // Atualiza o cartão
          setCards(prevCards => {
            return prevCards.map(card => {
              if (card.id === invoice.cardId) {
                return {
                  ...card,
                  availableLimit: card.limit,
                  currentBalance: 0
                };
              }
              return card;
            });
          });

          return updatedInvoice;
        }
        return invoice;
      });

      return updatedInvoices;
    });
  }, []);

  const addPurchase = useCallback((cardId: string, purchase: Omit<CreditCardPurchase, 'id'>) => {
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === cardId) {
          const newBalance = card.currentBalance + purchase.amount;
          return {
            ...card,
            currentBalance: newBalance,
            availableLimit: card.limit - newBalance
          };
        }
        return card;
      });
    });

    // Atualiza a fatura atual do cartão
    setInvoices(prevInvoices => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      return prevInvoices.map(invoice => {
        if (invoice.cardId === cardId && 
            invoice.month === currentMonth && 
            invoice.year === currentYear) {
          return {
            ...invoice,
            amount: invoice.amount + purchase.amount,
            remainingAmount: invoice.remainingAmount + purchase.amount
          };
        }
        return invoice;
      });
    });
  }, []);

  return {
    invoices,
    cards,
    transactions,
    payInvoice,
    addPurchase
  };
} 