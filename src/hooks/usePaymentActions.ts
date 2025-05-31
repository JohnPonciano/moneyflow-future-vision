
import { useToast } from '@/hooks/use-toast';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';

export const usePaymentActions = () => {
  const { toast } = useToast();
  const { addPaymentRecord, removePaymentRecord, refetch } = usePaymentRecords();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleMarkAsPaid = async (id: string, type: 'invoice' | 'transaction', amount: number) => {
    try {
      await addPaymentRecord({
        payment_type: type,
        reference_id: id,
        month: currentMonth,
        year: currentYear,
        amount
      });
      
      // Refaz a consulta para atualizar os dados
      await refetch();
      
      toast({
        title: "Pagamento registrado",
        description: "O item foi marcado como pago com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o pagamento.",
        variant: "destructive"
      });
    }
  };

  const handleUnmarkAsPaid = async (id: string, type: 'invoice' | 'transaction') => {
    try {
      await removePaymentRecord(type, id, currentMonth, currentYear);
      
      // Refaz a consulta para atualizar os dados
      await refetch();
      
      toast({
        title: "Pagamento removido",
        description: "O item foi marcado como pendente novamente.",
      });
    } catch (error) {
      console.error('Erro ao desmarcar pagamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o pagamento.",
        variant: "destructive"
      });
    }
  };

  return {
    handleMarkAsPaid,
    handleUnmarkAsPaid
  };
};
