
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCardSubscription } from '@/lib/types';

export const useSubscriptionsData = () => {
  const [subscriptions, setSubscriptions] = useState<CreditCardSubscription[]>([]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_card_subscriptions')
        .select('*')
        .order('description');

      if (error) throw error;

      const formattedSubscriptions: CreditCardSubscription[] = data.map(item => ({
        id: item.id,
        cardId: item.card_id,
        description: item.description,
        amount: Number(item.amount),
        startDate: new Date(item.start_date),
        category: item.category,
        isActive: item.is_active
      }));

      setSubscriptions(formattedSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const addSubscription = async (subscription: Omit<CreditCardSubscription, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('credit_card_subscriptions')
        .insert({
          card_id: subscription.cardId,
          description: subscription.description,
          amount: subscription.amount,
          start_date: subscription.startDate.toISOString().split('T')[0],
          category: subscription.category,
          is_active: subscription.isActive
        })
        .select()
        .single();

      if (error) throw error;

      const newSubscription: CreditCardSubscription = {
        id: data.id,
        cardId: data.card_id,
        description: data.description,
        amount: Number(data.amount),
        startDate: new Date(data.start_date),
        category: data.category,
        isActive: data.is_active
      };

      setSubscriptions(prev => [...prev, newSubscription]);
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_card_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const toggleSubscription = async (id: string) => {
    try {
      const subscription = subscriptions.find(s => s.id === id);
      if (!subscription) return;

      const { error } = await supabase
        .from('credit_card_subscriptions')
        .update({ is_active: !subscription.isActive })
        .eq('id', id);

      if (error) throw error;

      setSubscriptions(prev => prev.map(s =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  return {
    subscriptions,
    setSubscriptions,
    fetchSubscriptions,
    addSubscription,
    deleteSubscription,
    toggleSubscription
  };
};
