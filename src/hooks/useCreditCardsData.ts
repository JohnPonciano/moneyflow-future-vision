
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from '@/lib/types';

export const useCreditCardsData = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreditCards = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedCards: CreditCard[] = data.map(item => ({
        id: item.id,
        name: item.name,
        limit: Number(item.limit_amount),
        closingDay: item.closing_day,
        dueDay: item.due_day,
        color: item.color,
        currentBalance: 0,
        availableLimit: Number(item.limit_amount),
        committedAmount: 0,
        currentInvoiceAmount: 0
      }));

      setCreditCards(formattedCards);
    } catch (error) {
      console.error('Error fetching credit cards:', error);
    }
  };

  const addCard = async (card: Omit<CreditCard, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .insert({
          name: card.name,
          limit_amount: card.limit,
          closing_day: card.closingDay,
          due_day: card.dueDay,
          color: card.color
        })
        .select()
        .single();

      if (error) throw error;

      const newCard: CreditCard = {
        id: data.id,
        name: data.name,
        limit: Number(data.limit_amount),
        closingDay: data.closing_day,
        availableLimit: Number(data.limit_amount),
        currentBalance: 0,
        dueDay: data.due_day,
        color: data.color,
        committedAmount: 0,
        currentInvoiceAmount: 0
      };

      setCreditCards(prev => [...prev, newCard]);
    } catch (error) {
      console.error('Error adding credit card:', error);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCreditCards(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting credit card:', error);
    }
  };

  return {
    creditCards,
    setCreditCards,
    loading,
    setLoading,
    fetchCreditCards,
    addCard,
    deleteCard
  };
};
