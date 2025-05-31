
import { useState } from 'react';
import { PaymentsList } from './PaymentsList';
import { PaymentsOverview } from './PaymentsOverview';
import { InvoiceGeneratorButton } from './InvoiceGeneratorButton';
import { useTransactions } from '@/hooks/useTransactions';
import { useCreditCards } from '@/hooks/useCreditCards';

export function Payments() {
  const { transactions } = useTransactions();
  const { creditCards, purchases, subscriptions } = useCreditCards();

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Controle de Pagamentos</h1>
          <p className="text-slate-600 mt-1">Gerencie suas faturas, contas e pagamentos pendentes</p>
        </div>
        <InvoiceGeneratorButton />
      </div>

      <PaymentsOverview 
        transactions={transactions}
        creditCards={creditCards}
        purchases={purchases}
        subscriptions={subscriptions}
      />

      <PaymentsList 
        transactions={transactions}
        creditCards={creditCards}
        purchases={purchases}
        subscriptions={subscriptions}
      />
    </div>
  );
}
