
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditCardPurchase } from '@/lib/types';

export const usePurchasesData = () => {
  const [purchases, setPurchases] = useState<CreditCardPurchase[]>([]);

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
    } catch (error) {
      console.error('Error fetching purchases:', error);
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

  const editPurchase = async (id: string, purchase: Partial<CreditCardPurchase>) => {
    try {
      const updateData: any = {};
      
      if (purchase.description) updateData.description = purchase.description;
      if (purchase.amount) updateData.amount = purchase.amount;
      if (purchase.installments) updateData.installments = purchase.installments;
      if (purchase.purchaseDate) updateData.purchase_date = purchase.purchaseDate.toISOString().split('T')[0];
      if (purchase.category) updateData.category = purchase.category;

      const { data, error } = await supabase
        .from('credit_card_purchases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPurchase: CreditCardPurchase = {
        id: data.id,
        cardId: data.card_id,
        description: data.description,
        amount: Number(data.amount),
        currentInstallment: 1,
        remainingAmount: Number(data.amount),
        isPaid: data.is_paid || false,
        installments: data.installments,
        purchaseDate: new Date(data.purchase_date),
        category: data.category
      };

      setPurchases(prev => prev.map(p => p.id === id ? updatedPurchase : p));
    } catch (error) {
      console.error('Error editing purchase:', error);
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

  return {
    purchases,
    setPurchases,
    fetchPurchases,
    addPurchase,
    editPurchase,
    deletePurchase
  };
};
