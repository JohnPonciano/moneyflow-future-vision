
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, Clock, CreditCard, Receipt } from 'lucide-react';
import { Transaction, CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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
  const [paidInvoices, setPaidInvoices] = useState<Set<string>>(new Set());
  const [paidRecurring, setPaidRecurring] = useState<Set<string>>(new Set());
  const { toast } = useToast();

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
    
    const isOverdue = dueDate < today;
    const isDueSoon = dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: `${card.id}-${currentYear}-${currentMonth}`,
      card,
      amount: totalAmount,
      dueDate,
      isOverdue,
      isDueSoon,
      isPaid: paidInvoices.has(`${card.id}-${currentYear}-${currentMonth}`)
    };
  }).filter(inv => inv.amount > 0);

  // Contas recorrentes
  const recurringBills = transactions
    .filter(t => t.isRecurring && t.type === 'expense')
    .map(transaction => ({
      ...transaction,
      isPaid: paidRecurring.has(transaction.id),
      isOverdue: false, // Por simplicidade, considerar que não estão em atraso
      isDueSoon: true // Considerar que sempre estão próximas do vencimento
    }));

  const handleMarkAsPaid = (id: string, type: 'invoice' | 'recurring') => {
    if (type === 'invoice') {
      setPaidInvoices(prev => new Set([...prev, id]));
    } else {
      setPaidRecurring(prev => new Set([...prev, id]));
    }
    
    toast({
      title: "Pagamento registrado",
      description: "O item foi marcado como pago com sucesso.",
    });
  };

  const getStatusBadge = (isOverdue: boolean, isDueSoon: boolean, isPaid: boolean) => {
    if (isPaid) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Pago</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Em Atraso</Badge>;
    }
    if (isDueSoon) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Vence em breve</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  return (
    <Tabs defaultValue="invoices" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="invoices" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Faturas de Cartão
        </TabsTrigger>
        <TabsTrigger value="recurring" className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Contas Recorrentes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Faturas dos Cartões de Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cartão</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: invoice.card.color }}
                        />
                        {invoice.card.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.isOverdue, invoice.isDueSoon, invoice.isPaid)}
                    </TableCell>
                    <TableCell>
                      {!invoice.isPaid && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.id, 'invoice')}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Marcar como Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma fatura encontrada para este mês
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recurring">
        <Card>
          <CardHeader>
            <CardTitle>Contas Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.description}</TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell>
                      R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="capitalize">{bill.recurringPattern || 'Mensal'}</TableCell>
                    <TableCell>
                      {getStatusBadge(bill.isOverdue, bill.isDueSoon, bill.isPaid)}
                    </TableCell>
                    <TableCell>
                      {!bill.isPaid && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(bill.id, 'recurring')}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Marcar como Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {recurringBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma conta recorrente cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
