import { useState, useCallback, useEffect } from 'react';
import { Invoice, CreditCard, Transaction, CreditCardPurchase } from '../lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useCreditCards } from './useCreditCards';
import { CreditCardInvoice } from '@/lib/types';

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

export const usePayments = () => {
  const [invoices, setInvoices] = useState<CreditCardInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchAll } = useCreditCards();
  const [cards, setCards] = useState<CreditCard[]>(mockCards);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const payInvoice = async (invoiceId: string) => {
    try {
      const [cardId, year, month] = invoiceId.split('-');
      const invoiceDate = new Date(parseInt(year), parseInt(month) - 1);
      
      // Atualiza o status de pagamento das compras
      const { error: updateError } = await supabase
        .from('credit_card_purchases')
        .update({ is_paid: true })
        .eq('card_id', cardId)
        .lte('purchase_date', invoiceDate);

      if (updateError) throw updateError;

          // Atualiza o status da fatura
      const { error: invoiceError } = await supabase
        .from('credit_card_invoices')
        .update({ 
          is_paid: true,
          paid_at: new Date().toISOString(),
          payment_method: 'credit_card'
        })
        .eq('id', invoiceId);

      if (invoiceError) throw invoiceError;

          // Cria uma nova transação para o pagamento
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            description: `Pagamento da fatura do cartão ${invoice.cardName}`,
            amount: invoice.amount,
            date: new Date().toISOString(),
            category: 'credit_card_payment',
            type: 'expense',
            payment_method: 'credit_card'
          });

        if (transactionError) throw transactionError;
      }

      // Recarrega os dados dos cartões
      await fetchAll();

      // Atualiza o estado local
      setInvoices(prev => 
        prev.map(inv => 
          inv.id === invoiceId 
            ? { ...inv, status: 'paid', paidAt: new Date() }
            : inv
        )
      );

    } catch (error) {
      console.error('Error paying invoice:', error);
      throw error;
    }
  };

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
            amount: invoice.amount + purchase.amount
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