
import { CreditCard, CreditCardPurchase, CreditCardSubscription } from './types';

export const calculateCardFinancials = (
  card: CreditCard,
  purchases: CreditCardPurchase[],
  subscriptions: CreditCardSubscription[]
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const cardPurchases = purchases.filter(p => p.cardId === card.id && !p.isPaid);
  const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id && s.isActive);

  // 1. Calcular valor total comprometido (valor total das compras não pagas)
  const committedAmount = cardPurchases.reduce((sum, purchase) => {
    return sum + purchase.amount;
  }, 0);

  // 2. Calcular valor da fatura atual (parcelas que vencem no mês corrente)
  const currentInvoiceFromPurchases = cardPurchases.reduce((sum, purchase) => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const monthsSincePurchase = (currentYear - purchaseDate.getFullYear()) * 12 + 
                               (currentMonth - purchaseDate.getMonth());
    
    // Verifica se a parcela do mês corrente ainda está pendente
    if (monthsSincePurchase >= 0 && monthsSincePurchase < purchase.installments) {
      const monthlyInstallment = purchase.amount / purchase.installments;
      return sum + monthlyInstallment;
    }
    return sum;
  }, 0);

  // 3. Adicionar assinaturas à fatura atual
  const currentInvoiceFromSubscriptions = cardSubscriptions.reduce((sum, subscription) => {
    return sum + subscription.amount;
  }, 0);

  const currentInvoiceAmount = currentInvoiceFromPurchases + currentInvoiceFromSubscriptions;

  // 4. Calcular limite disponível
  const availableLimit = Math.max(0, card.limit - committedAmount);

  return {
    ...card,
    committedAmount,
    currentInvoiceAmount,
    availableLimit,
    currentBalance: committedAmount // Manter compatibilidade
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};
