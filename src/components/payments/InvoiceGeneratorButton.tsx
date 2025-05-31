
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useInvoiceGeneration } from '@/hooks/useInvoiceGeneration';

export function InvoiceGeneratorButton() {
  const { generateMonthlyInvoices } = useInvoiceGeneration();

  return (
    <Button 
      onClick={generateMonthlyInvoices}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      <FileText className="h-4 w-4" />
      Gerar Faturas do Mês
    </Button>
  );
}
