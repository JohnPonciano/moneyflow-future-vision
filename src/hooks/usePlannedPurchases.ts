
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlannedPurchase } from '@/lib/types';

export const usePlannedPurchases = () => {
  const [purchases, setPurchases] = useState<PlannedPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('planned_purchases')
        .select('*')
        .order('urgency');

      if (error) throw error;

      const formattedPurchases: PlannedPurchase[] = data.map(item => ({
        id: item.id,
        item: item.item,
        estimatedPrice: Number(item.estimated_price),
        urgency: item.urgency as 'high' | 'medium' | 'low',
        canInstall: item.can_install,
        maxInstallments: item.max_installments || undefined,
        category: item.category,
        notes: item.notes || undefined
      }));

      setPurchases(formattedPurchases);
    } catch (error) {
      console.error('Error fetching planned purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (purchase: Omit<PlannedPurchase, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('planned_purchases')
        .insert({
          item: purchase.item,
          estimated_price: purchase.estimatedPrice,
          urgency: purchase.urgency,
          can_install: purchase.canInstall,
          max_installments: purchase.maxInstallments,
          category: purchase.category,
          notes: purchase.notes
        })
        .select()
        .single();

      if (error) throw error;

      const newPurchase: PlannedPurchase = {
        id: data.id,
        item: data.item,
        estimatedPrice: Number(data.estimated_price),
        urgency: data.urgency as 'high' | 'medium' | 'low',
        canInstall: data.can_install,
        maxInstallments: data.max_installments || undefined,
        category: data.category,
        notes: data.notes || undefined
      };

      setPurchases(prev => [...prev, newPurchase]);
    } catch (error) {
      console.error('Error adding planned purchase:', error);
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('planned_purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPurchases(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting planned purchase:', error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    addPurchase,
    deletePurchase,
    refetch: fetchPurchases
  };
};
