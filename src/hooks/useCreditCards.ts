
import { useEffect } from 'react';
import { calculateCardFinancials } from '@/lib/creditCardUtils';
import { useCreditCardsData } from './useCreditCardsData';
import { usePurchasesData } from './usePurchasesData';
import { useSubscriptionsData } from './useSubscriptionsData';

export const useCreditCards = () => {
  const {
    creditCards,
    setCreditCards,
    loading,
    setLoading,
    fetchCreditCards,
    addCard,
    deleteCard
  } = useCreditCardsData();

  const {
    purchases,
    setPurchases,
    fetchPurchases,
    addPurchase,
    editPurchase,
    deletePurchase
  } = usePurchasesData();

  const {
    subscriptions,
    setSubscriptions,
    fetchSubscriptions,
    addSubscription,
    deleteSubscription,
    toggleSubscription
  } = useSubscriptionsData();

  // Função para recalcular os valores dos cartões
  const updateCardFinancials = () => {
    setCreditCards(prevCards => 
      prevCards.map(card => calculateCardFinancials(card, purchases, subscriptions))
    );
  };

  // Sobrescrever deleteCard para também deletar purchases e subscriptions relacionadas
  const deleteCardWithRelated = async (id: string) => {
    try {
      await deleteCard(id);
      setPurchases(prev => prev.filter(p => p.cardId !== id));
      setSubscriptions(prev => prev.filter(s => s.cardId !== id));
    } catch (error) {
      console.error('Error deleting credit card with related data:', error);
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

  // Recalcular valores sempre que purchases ou subscriptions mudarem
  useEffect(() => {
    updateCardFinancials();
  }, [purchases, subscriptions]);

  return {
    creditCards,
    purchases,
    subscriptions,
    loading,
    addCard,
    deleteCard: deleteCardWithRelated,
    addPurchase,
    editPurchase,
    deletePurchase,
    addSubscription,
    deleteSubscription,
    toggleSubscription,
    fetchAll
  };
};
