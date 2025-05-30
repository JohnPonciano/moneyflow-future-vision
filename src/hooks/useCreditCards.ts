import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [purchases, setPurchases] = useState<CreditCardPurchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<CreditCardSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateCardLimits = (card: any, purchases: CreditCardPurchase[], subscriptions: CreditCardSubscription[]) => {
    // Calcula o total de compras não pagas
    const unpaidPurchases = purchases
      .filter(p => p.cardId === card.id && !p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    // Calcula o total de assinaturas ativas
    const activeSubscriptions = subscriptions
      .filter(s => s.cardId === card.id && s.isActive)
      .reduce((sum, s) => sum + s.amount, 0);

    // Calcula o saldo atual (compras + assinaturas)
    const currentBalance = unpaidPurchases + activeSubscriptions;

    // Calcula o limite disponível
    const availableLimit = Math.max(0, card.limit - currentBalance);

    return {
      ...card,
      currentBalance,
      availableLimit
    };
  };

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
        availableLimit: Number(item.limit_amount)
      }));

      // Atualiza os limites após carregar as compras e assinaturas
      const updatedCards = formattedCards.map(card => 
        calculateCardLimits(card, purchases, subscriptions)
      );

      setCreditCards(updatedCards);
    } catch (error) {
      console.error('Error fetching credit cards:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_card_purchases')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      const formattedPurchases: CreditCardPurchase[] = data.map(item => ({
        id: item.id,
        cardId: item.card_id,
        description: item.description,
        amount: Number(item.amount),
        installments: item.installments,
        purchaseDate: new Date(item.purchase_date),
        category: item.category,
        currentInstallment: 1,
        remainingAmount: Number(item.amount),
        isPaid: item.is_paid || false
      }));

      setPurchases(formattedPurchases);

      // Atualiza os limites dos cartões após carregar as compras
      setCreditCards(prevCards => 
        prevCards.map(card => calculateCardLimits(card, formattedPurchases, subscriptions))
      );
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

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
        color: data.color
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
      setPurchases(prev => prev.filter(p => p.cardId !== id));
      setSubscriptions(prev => prev.filter(s => s.cardId !== id));
    } catch (error) {
      console.error('Error deleting credit card:', error);
    }
  };

  const addPurchase = async (purchase: Omit<CreditCardPurchase, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('credit_card_purchases')
        .insert({
          card_id: purchase.cardId,
          description: purchase.description,
          amount: purchase.amount,
          installments: purchase.installments,
          purchase_date: purchase.purchaseDate.toISOString().split('T')[0],
          category: purchase.category
        })
        .select()
        .single();

      if (error) throw error;

      const newPurchase: CreditCardPurchase = {
        id: data.id,
        cardId: data.card_id,
        description: data.description,
        amount: Number(data.amount),
        currentInstallment: 1,
        remainingAmount: Number(data.amount),
        isPaid: false,
        installments: data.installments,
        purchaseDate: new Date(data.purchase_date),
        category: data.category
      };

      setPurchases(prev => [newPurchase, ...prev]);
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_card_purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPurchases(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting purchase:', error);
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

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCreditCards(),
        fetchPurchases(),
        fetchSubscriptions()
      ]);
    } catch (error) {
      console.error('Error fetching credit card data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    creditCards,
    purchases,
    subscriptions,
    loading,
    addCard,
    deleteCard,
    addPurchase,
    deletePurchase,
    addSubscription,
    deleteSubscription,
    toggleSubscription,
    fetchAll
  };
};
