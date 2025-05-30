
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal } from '@/lib/types';

export const useGoals = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .order('deadline');

      if (error) throw error;

      const formattedGoals: FinancialGoal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        targetAmount: Number(item.target_amount),
        currentAmount: Number(item.current_amount),
        deadline: new Date(item.deadline),
        priority: item.priority as 'high' | 'medium' | 'low',
        category: item.category as 'emergency' | 'investment' | 'purchase' | 'debt' | 'other'
      }));

      setGoals(formattedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<FinancialGoal, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert({
          title: goal.title,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline.toISOString().split('T')[0],
          priority: goal.priority,
          category: goal.category
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal: FinancialGoal = {
        id: data.id,
        title: data.title,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        deadline: new Date(data.deadline),
        priority: data.priority as 'high' | 'medium' | 'low',
        category: data.category as 'emergency' | 'investment' | 'purchase' | 'debt' | 'other'
      };

      setGoals(prev => [...prev, newGoal]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (id: string, currentAmount: number) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update({ current_amount: currentAmount })
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.map(goal =>
        goal.id === id ? { ...goal, currentAmount } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
