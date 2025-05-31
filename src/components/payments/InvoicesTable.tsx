
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard } from '@/lib/types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentActionButton } from './PaymentActionButton';

interface Invoice {
  id: string;
  card: CreditCard;
  amount: number;
  dueDate: Date;
  isOverdue: boolean;
  isDueSoon: boolean;
  isPaid: boolean;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  onMarkAsPaid: (id: string, amount: number) => void;
  onUnmarkAsPaid: (id: string) => void;
}

export function InvoicesTable({ invoices, onMarkAsPaid, onUnmarkAsPaid }: InvoicesTableProps) {
  return (
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
                  <PaymentStatusBadge 
                    isOverdue={invoice.isOverdue}
                    isDueSoon={invoice.isDueSoon}
                    isPaid={invoice.isPaid}
                  />
                </TableCell>
                <TableCell>
                  <PaymentActionButton
                    isPaid={invoice.isPaid}
                    onMarkAsPaid={() => onMarkAsPaid(invoice.id, invoice.amount)}
                    onUnmarkAsPaid={() => onUnmarkAsPaid(invoice.id)}
                  />
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
  );
}
