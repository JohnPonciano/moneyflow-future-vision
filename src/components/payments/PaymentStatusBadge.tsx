
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  isOverdue: boolean;
  isDueSoon: boolean;
  isPaid: boolean;
}

export function PaymentStatusBadge({ isOverdue, isDueSoon, isPaid }: PaymentStatusBadgeProps) {
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
}
