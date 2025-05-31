
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';

interface PaidInvoicesIndicatorProps {
  cardId: string;
  cardName: string;
}

export function PaidInvoicesIndicator({ cardId, cardName }: PaidInvoicesIndicatorProps) {
  const { isItemPaid } = usePaymentRecords();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const invoiceId = `${cardId}-${currentYear}-${currentMonth}`;
  const isPaid = isItemPaid('invoice', invoiceId, currentMonth, currentYear);

  if (!isPaid) return null;

  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Fatura Paga
    </Badge>
  );
}
