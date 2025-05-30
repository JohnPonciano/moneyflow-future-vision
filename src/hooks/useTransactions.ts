
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/lib/types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        category: item.category,
        amount: Number(item.amount),
        description: item.description,
        date: new Date(item.date),
        isRecurring: item.is_recurring,
        recurringPattern: item.recurring_pattern as 'monthly' | 'weekly' | 'yearly' | undefined,
        tags: item.tags || []
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date.toISOString().split('T')[0],
          is_recurring: transaction.isRecurring,
          recurring_pattern: transaction.recurringPattern,
          tags: transaction.tags
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        category: data.category,
        amount: Number(data.amount),
        description: data.description,
        date: new Date(data.date),
        isRecurring: data.is_recurring,
        recurringPattern: data.recurring_pattern as 'monthly' | 'weekly' | 'yearly' | undefined,
        tags: data.tags || []
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
