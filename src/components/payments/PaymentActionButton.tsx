
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

interface PaymentActionButtonProps {
  isPaid: boolean;
  onMarkAsPaid: () => void;
  onUnmarkAsPaid: () => void;
}

export function PaymentActionButton({ isPaid, onMarkAsPaid, onUnmarkAsPaid }: PaymentActionButtonProps) {
  if (isPaid) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={onUnmarkAsPaid}
        className="flex items-center gap-1"
      >
        <X className="h-3 w-3" />
        Desmarcar
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={onMarkAsPaid}
      className="flex items-center gap-1"
    >
      <CheckCircle className="h-3 w-3" />
      Marcar como Pago
    </Button>
  );
}
