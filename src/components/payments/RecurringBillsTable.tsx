
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/lib/types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentActionButton } from './PaymentActionButton';

interface RecurringBill extends Transaction {
  isPaid: boolean;
  isOverdue: boolean;
  isDueSoon: boolean;
}

interface RecurringBillsTableProps {
  recurringBills: RecurringBill[];
  onMarkAsPaid: (id: string, amount: number) => void;
  onUnmarkAsPaid: (id: string) => void;
}

export function RecurringBillsTable({ recurringBills, onMarkAsPaid, onUnmarkAsPaid }: RecurringBillsTableProps) {
  return (
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
                  <PaymentStatusBadge 
                    isOverdue={bill.isOverdue}
                    isDueSoon={bill.isDueSoon}
                    isPaid={bill.isPaid}
                  />
                </TableCell>
                <TableCell>
                  <PaymentActionButton
                    isPaid={bill.isPaid}
                    onMarkAsPaid={() => onMarkAsPaid(bill.id, bill.amount)}
                    onUnmarkAsPaid={() => onUnmarkAsPaid(bill.id)}
                  />
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
  );
}
