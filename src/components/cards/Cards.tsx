
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, CreditCardPurchase, CreditCardSubscription } from '@/lib/types';
import { Plus, CreditCard as CreditCardIcon, RotateCcw, ShoppingCart } from 'lucide-react';
import { CardForm } from './CardForm';
import { SubscriptionForm } from './SubscriptionForm';
import { CardsList } from './CardsList';
import { PurchaseManager } from './PurchaseManager';

interface CardsProps {
  cards: CreditCard[];
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
  onAddPurchase: (purchase: Omit<CreditCardPurchase, 'id'>) => void;
  onEditPurchase: (id: string, purchase: Partial<CreditCardPurchase>) => void;
  onAddSubscription: (subscription: Omit<CreditCardSubscription, 'id'>) => void;
  onDeleteCard: (id: string) => void;
  onDeletePurchase: (id: string) => void;
  onDeleteSubscription: (id: string) => void;
  onToggleSubscription: (id: string) => void;
}

export function Cards({ 
  cards, 
  purchases, 
  subscriptions, 
  onAddCard, 
  onAddPurchase, 
  onEditPurchase,
  onAddSubscription, 
  onDeleteCard, 
  onDeletePurchase, 
  onDeleteSubscription,
  onToggleSubscription 
}: CardsProps) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  const handleAddCard = (card: Omit<CreditCard, 'id'>) => {
    onAddCard(card);
    setShowCardForm(false);
  };

  const handleAddSubscription = (subscription: Omit<CreditCardSubscription, 'id'>) => {
    onAddSubscription(subscription);
    setShowSubscriptionForm(false);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cartões de Crédito</h1>
          <p className="text-slate-600 mt-1">Gerencie seus cartões, compras e assinaturas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCardForm(!showCardForm)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cartão
          </Button>
          <Button onClick={() => setShowSubscriptionForm(!showSubscriptionForm)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova Assinatura
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Cartões
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Compras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          {showCardForm && (
            <CardForm 
              onAddCard={handleAddCard}
              onCancel={() => setShowCardForm(false)}
            />
          )}

          {showSubscriptionForm && (
            <SubscriptionForm 
              cards={cards}
              onAddSubscription={handleAddSubscription}
              onCancel={() => setShowSubscriptionForm(false)}
            />
          )}

          <CardsList
            cards={cards}
            purchases={purchases}
            subscriptions={subscriptions}
            onDeleteCard={onDeleteCard}
            onDeleteSubscription={onDeleteSubscription}
            onToggleSubscription={onToggleSubscription}
            onShowCardForm={() => setShowCardForm(true)}
          />
        </TabsContent>

        <TabsContent value="purchases">
          <PurchaseManager
            purchases={purchases}
            cards={cards}
            onAddPurchase={onAddPurchase}
            onEditPurchase={onEditPurchase}
            onDeletePurchase={onDeletePurchase}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
