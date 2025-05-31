
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard as CreditCardIcon, Receipt } from 'lucide-react';
import { Transaction, CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';
import { usePaymentActions } from '@/hooks/usePaymentActions';
import { InvoicesTable } from './InvoicesTable';
import { RecurringBillsTable } from './RecurringBillsTable';

interface PaymentsListProps {
  transactions: Transaction[];
  creditCards: CreditCard[];
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
}

export function PaymentsList({ 
  transactions, 
  creditCards, 
  purchases, 
  subscriptions 
}: PaymentsListProps) {
  const { isItemPaid } = usePaymentRecords();
  const { handleMarkAsPaid, handleUnmarkAsPaid } = usePaymentActions();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Gerar faturas dos cartões
  const invoices = creditCards.map(card => {
    const cardPurchases = purchases.filter(p => p.cardId === card.id);
    const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id && s.isActive);
    
    const purchasesAmount = cardPurchases.reduce((sum, p) => {
      const installmentAmount = p.amount / p.installments;
      return sum + installmentAmount;
    }, 0);
    
    const subscriptionsAmount = cardSubscriptions.reduce((sum, s) => sum + s.amount, 0);
    
    const totalAmount = purchasesAmount + subscriptionsAmount;
    
    const dueDate = new Date(currentYear, currentMonth, card.dueDay);
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const invoiceId = `${card.id}-${currentYear}-${currentMonth}`;
    const isPaid = isItemPaid('invoice', invoiceId, currentMonth, currentYear);
    const isOverdue = !isPaid && dueDate < today;
    const isDueSoon = !isPaid && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: invoiceId,
      card,
      amount: totalAmount,
      dueDate,
      isOverdue,
      isDueSoon,
      isPaid
    };
  }).filter(inv => inv.amount > 0);

  // Contas recorrentes
  const recurringBills = transactions
    .filter(t => t.isRecurring && t.type === 'expense')
    .map(transaction => {
      const isPaid = isItemPaid('transaction', transaction.id, currentMonth, currentYear);
      return {
        ...transaction,
        isPaid,
        isOverdue: false,
        isDueSoon: !isPaid
      };
    });

  const handleInvoiceMarkAsPaid = (id: string, amount: number) => {
    handleMarkAsPaid(id, 'invoice', amount);
  };

  const handleInvoiceUnmarkAsPaid = (id: string) => {
    handleUnmarkAsPaid(id, 'invoice');
  };

  const handleBillMarkAsPaid = (id: string, amount: number) => {
    handleMarkAsPaid(id, 'transaction', amount);
  };

  const handleBillUnmarkAsPaid = (id: string) => {
    handleUnmarkAsPaid(id, 'transaction');
  };

  return (
    <Tabs defaultValue="invoices" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="invoices" className="flex items-center gap-2">
          <CreditCardIcon className="h-4 w-4" />
          Faturas de Cartão
        </TabsTrigger>
        <TabsTrigger value="recurring" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Contas Recorrentes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <InvoicesTable 
          invoices={invoices}
          onMarkAsPaid={handleInvoiceMarkAsPaid}
          onUnmarkAsPaid={handleInvoiceUnmarkAsPaid}
        />
      </TabsContent>

      <TabsContent value="recurring">
        <RecurringBillsTable 
          recurringBills={recurringBills}
          onMarkAsPaid={handleBillMarkAsPaid}
          onUnmarkAsPaid={handleBillUnmarkAsPaid}
        />
      </TabsContent>
    </Tabs>
  );
}
