
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentRecord {
  id: string;
  payment_type: 'invoice' | 'transaction';
  reference_id: string;
  month: number;
  year: number;
  amount: number;
  paid_date: string;
}

export const usePaymentRecords = () => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecords: PaymentRecord[] = data.map(item => ({
        id: item.id,
        payment_type: item.payment_type as 'invoice' | 'transaction',
        reference_id: item.reference_id,
        month: item.month,
        year: item.year,
        amount: Number(item.amount),
        paid_date: item.paid_date
      }));

      setPaymentRecords(formattedRecords);
    } catch (error) {
      console.error('Error fetching payment records:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentRecord = async (record: Omit<PaymentRecord, 'id' | 'paid_date'>) => {
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .insert({
          payment_type: record.payment_type,
          reference_id: record.reference_id,
          month: record.month,
          year: record.year,
          amount: record.amount
        })
        .select()
        .single();

      if (error) throw error;

      const newRecord: PaymentRecord = {
        id: data.id,
        payment_type: data.payment_type as 'invoice' | 'transaction',
        reference_id: data.reference_id,
        month: data.month,
        year: data.year,
        amount: Number(data.amount),
        paid_date: data.paid_date
      };

      setPaymentRecords(prev => [newRecord, ...prev]);
    } catch (error) {
      console.error('Error adding payment record:', error);
    }
  };

  const removePaymentRecord = async (paymentType: 'invoice' | 'transaction', referenceId: string, month: number, year: number) => {
    try {
      const { error } = await supabase
        .from('payment_records')
        .delete()
        .eq('payment_type', paymentType)
        .eq('reference_id', referenceId)
        .eq('month', month)
        .eq('year', year);

      if (error) throw error;

      setPaymentRecords(prev => 
        prev.filter(record => 
          !(record.payment_type === paymentType && 
            record.reference_id === referenceId && 
            record.month === month && 
            record.year === year)
        )
      );
    } catch (error) {
      console.error('Error removing payment record:', error);
    }
  };

  const isItemPaid = (paymentType: 'invoice' | 'transaction', referenceId: string, month: number, year: number): boolean => {
    return paymentRecords.some(record => 
      record.payment_type === paymentType &&
      record.reference_id === referenceId &&
      record.month === month &&
      record.year === year
    );
  };

  useEffect(() => {
    fetchPaymentRecords();
  }, []);

  return {
    paymentRecords,
    loading,
    addPaymentRecord,
    removePaymentRecord,
    isItemPaid,
    refetch: fetchPaymentRecords
  };
};
