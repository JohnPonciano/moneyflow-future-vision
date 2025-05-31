
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, CreditCard as CreditCardIcon } from 'lucide-react';
import { Transaction, CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';

interface PaymentsOverviewProps {
  transactions: Transaction[];
  creditCards: CreditCard[];
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
}

export function PaymentsOverview({ 
  transactions, 
  creditCards, 
  purchases, 
  subscriptions 
}: PaymentsOverviewProps) {
  const { isItemPaid } = usePaymentRecords();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Calcular faturas do mês atual
  const monthlyInvoices = creditCards.map(card => {
    const cardPurchases = purchases.filter(p => p.cardId === card.id);
    const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id && s.isActive);
    
    const purchasesAmount = cardPurchases.reduce((sum, p) => {
      const installmentAmount = p.amount / p.installments;
      return sum + installmentAmount;
    }, 0);
    
    const subscriptionsAmount = cardSubscriptions.reduce((sum, s) => sum + s.amount, 0);
    
    const totalAmount = purchasesAmount + subscriptionsAmount;
    
    // Calcular data de vencimento
    const dueDate = new Date(currentYear, currentMonth, card.dueDay);
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const isOverdue = dueDate < today;
    const isDueSoon = dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const invoiceId = `${card.id}-${currentYear}-${currentMonth}`;
    const isPaid = isItemPaid('invoice', invoiceId, currentMonth, currentYear);
    
    return {
      card,
      amount: totalAmount,
      dueDate,
      isOverdue: !isPaid && isOverdue,
      isDueSoon: !isPaid && isDueSoon,
      isPaid
    };
  }).filter(inv => inv.amount > 0);

  // Contas recorrentes vencendo
  const recurringTransactions = transactions
    .filter(t => t.isRecurring && t.type === 'expense')
    .map(transaction => ({
      ...transaction,
      isPaid: isItemPaid('transaction', transaction.id, currentMonth, currentYear)
    }));

  const overdueInvoices = monthlyInvoices.filter(inv => inv.isOverdue);
  const dueSoonInvoices = monthlyInvoices.filter(inv => inv.isDueSoon);
  const unpaidInvoices = monthlyInvoices.filter(inv => !inv.isPaid);
  const unpaidRecurring = recurringTransactions.filter(t => !t.isPaid);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Faturas em Atraso</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
          <p className="text-xs text-muted-foreground">
            R$ {overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2 
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vence em 7 Dias</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{dueSoonInvoices.length}</div>
          <p className="text-xs text-muted-foreground">
            R$ {dueSoonInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2 
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes do Mês</CardTitle>
          <CreditCardIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {unpaidInvoices.length} faturas não pagas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contas Recorrentes</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unpaidRecurring.length}</div>
          <p className="text-xs text-muted-foreground">
            Pendentes este mês
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
