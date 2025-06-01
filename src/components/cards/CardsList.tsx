
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';
import { Plus, CreditCard as CreditCardIcon } from 'lucide-react';
import { CardItem } from './CardItem';

interface CardsListProps {
  cards: CreditCard[];
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
  onDeleteCard: (id: string) => void;
  onDeleteSubscription: (id: string) => void;
  onToggleSubscription: (id: string) => void;
  onShowCardForm: () => void;
}

export function CardsList({ 
  cards, 
  purchases, 
  subscriptions, 
  onDeleteCard, 
  onDeleteSubscription, 
  onToggleSubscription,
  onShowCardForm 
}: CardsListProps) {
  const generateInvoice = (cardId: string, month: number, year: number) => {
    const cardPurchases = purchases.filter(p => {
      const purchaseDate = new Date(p.purchaseDate);
      return p.cardId === cardId && 
             purchaseDate.getMonth() <= month && 
             purchaseDate.getFullYear() <= year;
    });

    const cardSubscriptions = subscriptions.filter(s => {
      const startDate = new Date(s.startDate);
      return s.cardId === cardId && 
             s.isActive &&
             startDate.getMonth() <= month && 
             startDate.getFullYear() <= year;
    });

    const purchasesAmount = cardPurchases.reduce((sum, purchase) => {
      const installmentValue = purchase.amount / purchase.installments;
      const monthsSincePurchase = (year - purchase.purchaseDate.getFullYear()) * 12 + 
                                  (month - purchase.purchaseDate.getMonth());
      
      if (monthsSincePurchase >= 0 && monthsSincePurchase < purchase.installments) {
        return sum + installmentValue;
      }
      return sum;
    }, 0);

    const subscriptionsAmount = cardSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
    const totalAmount = purchasesAmount + subscriptionsAmount;

    const card = cards.find(c => c.id === cardId)!;
    const dueDate = new Date(year, month, card.dueDay);

    return {
      id: `${cardId}-${month}-${year}`,
      cardId,
      month,
      year,
      amount: totalAmount,
      dueDate,
      isPaid: false,
      paymentStatus: 'pending' as const,
      paidAmount: 0,
      remainingAmount: totalAmount,
      purchases: cardPurchases,
      subscriptions: cardSubscriptions
    };
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const currentInvoice = generateInvoice(card.id, currentMonth, currentYear);
        
        return (
          <CardItem
            key={card.id}
            card={card}
            purchases={purchases}
            subscriptions={subscriptions}
            currentInvoice={currentInvoice}
            onDeleteCard={onDeleteCard}
            onDeleteSubscription={onDeleteSubscription}
            onToggleSubscription={onToggleSubscription}
          />
        );
      })}

      {cards.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCardIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-slate-600 mb-4">Adicione seus cartões de crédito para controlar as faturas</p>
            <Button onClick={onShowCardForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Primeiro Cartão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
