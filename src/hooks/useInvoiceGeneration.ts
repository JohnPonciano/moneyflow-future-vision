
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/useTransactions';
import { useCreditCards } from '@/hooks/useCreditCards';
import { usePaymentRecords } from '@/hooks/usePaymentRecords';
import { Transaction } from '@/lib/types';

export const useInvoiceGeneration = () => {
  const { toast } = useToast();
  const { addTransaction } = useTransactions();
  const { creditCards, purchases, subscriptions } = useCreditCards();
  const { addPaymentRecord } = usePaymentRecords();

  const generateMonthlyInvoices = async () => {
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      for (const card of creditCards) {
        // Calcular compras do cartão (parcelas do mês atual)
        const cardPurchases = purchases.filter(p => p.cardId === card.id);
        const purchasesAmount = cardPurchases.reduce((sum, p) => {
          const installmentAmount = p.amount / p.installments;
          return sum + installmentAmount;
        }, 0);

        // Calcular assinaturas ativas do cartão
        const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id && s.isActive);
        const subscriptionsAmount = cardSubscriptions.reduce((sum, s) => sum + s.amount, 0);

        const totalAmount = purchasesAmount + subscriptionsAmount;

        if (totalAmount > 0) {
          // Criar transação para a fatura
          const dueDate = new Date(currentYear, currentMonth, card.dueDay);
          if (dueDate < today) {
            dueDate.setMonth(dueDate.getMonth() + 1);
          }

          const invoiceTransaction: Omit<Transaction, 'id'> = {
            type: 'expense',
            category: 'Fatura Cartão',
            amount: totalAmount,
            description: `Fatura ${card.name} - ${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`,
            date: dueDate,
            isRecurring: false,
            tags: ['fatura', 'cartao', card.name.toLowerCase()]
          };

          await addTransaction(invoiceTransaction);
        }
      }

      toast({
        title: "Faturas geradas",
        description: "As faturas dos cartões foram geradas com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar as faturas dos cartões.",
        variant: "destructive"
      });
    }
  };

  const markInvoiceAsPaid = async (cardId: string, amount: number) => {
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const invoiceId = `${cardId}-${currentYear}-${currentMonth}`;
      
      await addPaymentRecord({
        payment_type: 'invoice',
        reference_id: invoiceId,
        month: currentMonth,
        year: currentYear,
        amount
      });

      toast({
        title: "Fatura paga",
        description: "A fatura foi marcada como paga com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar a fatura como paga.",
        variant: "destructive"
      });
    }
  };

  return {
    generateMonthlyInvoices,
    markInvoiceAsPaid
  };
};
