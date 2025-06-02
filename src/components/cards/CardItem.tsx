import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard, CreditCardPurchase, CreditCardSubscription, Invoice } from '@/lib/types';
import { CreditCard as CreditCardIcon, Trash2 } from 'lucide-react';

interface CardItemProps {
  card: CreditCard;
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
  currentInvoice: Invoice;
  onDeleteCard: (id: string) => void;
  onDeleteSubscription: (id: string) => void;
  onToggleSubscription: (id: string) => void;
}

export function CardItem({ 
  card, 
  purchases, 
  subscriptions, 
  currentInvoice,
  onDeleteCard, 
  onDeleteSubscription, 
  onToggleSubscription 
}: CardItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const calculateUsedLimit = () => {
    const cardPurchases = purchases.filter(p => p.cardId === card.id);
    const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id && s.isActive);
    
    const now = new Date();
    
    // Calcular compras (valor total das compras ainda sendo pagas)
    const purchasesUsedLimit = cardPurchases.reduce((sum, purchase) => {
      const purchaseDate = new Date(purchase.purchaseDate);
      const monthsSincePurchase = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                                  (now.getMonth() - purchaseDate.getMonth());
      
      if (purchase.installments === 1) {
        // Compra à vista - conta o valor total no mês da compra
        if (monthsSincePurchase === 0) {
          return sum + purchase.amount;
        }
      } else {
        // Compra parcelada - conta o valor total se ainda não foi totalmente paga
        if (monthsSincePurchase >= 0 && monthsSincePurchase < purchase.installments) {
          return sum + purchase.amount;
        }
      }
      return sum;
    }, 0);
    
    // Calcular assinaturas ativas (valor mensal)
    const subscriptionsUsedLimit = cardSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
    
    return purchasesUsedLimit + subscriptionsUsedLimit;
  };

  const usedLimit = calculateUsedLimit();
  const availableLimit = Math.max(0, card.limit - usedLimit);
  const usagePercentage = (usedLimit / card.limit) * 100;
  const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id);

  return (
    <Card className="relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: card.color }}
      />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: card.color }}
            >
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{card.name}</CardTitle>
              <p className="text-sm text-slate-600">
                Limite: {formatCurrency(card.limit)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteCard(card.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Limite usado</span>
            <span className="text-sm font-medium">{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(usagePercentage, 100)}%`,
                backgroundColor: usagePercentage > 80 ? '#ef4444' : usagePercentage > 60 ? '#f59e0b' : card.color
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Usado: {formatCurrency(usedLimit)}</span>
            <span>Disponível: {formatCurrency(availableLimit)}</span>
          </div>
        </div>

        {/* Assinaturas Ativas */}
        {cardSubscriptions.filter(s => s.isActive).length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Assinaturas Ativas</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {cardSubscriptions
                .filter(s => s.isActive)
                .map((subscription) => (
                  <div key={subscription.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{subscription.description}</p>
                      <Switch
                        checked={subscription.isActive}
                        onCheckedChange={() => onToggleSubscription(subscription.id)}
                        className="scale-75"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{formatCurrency(subscription.amount)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSubscription(subscription.id)}
                        className="h-4 w-4 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Fatura Atual */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Fatura Atual</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Valor:</span>
              <span className="font-medium">{formatCurrency(currentInvoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Vencimento:</span>
              <span className="font-medium">{formatDate(currentInvoice.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Fechamento:</span>
              <span className="font-medium">Dia {card.closingDay}</span>
            </div>
          </div>
        </div>

        {/* Últimas Compras */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Últimas Compras</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {purchases
              .filter(p => p.cardId === card.id)
              .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
              .slice(0, 3)
              .map((purchase) => (
                <div key={purchase.id} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-medium">{purchase.description}</p>
                    <p className="text-slate-500">{formatDate(purchase.purchaseDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(purchase.amount)}</p>
                    {purchase.installments > 1 && (
                      <p className="text-slate-500">{purchase.installments}x</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
