
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard, CreditCardPurchase, CreditCardSubscription, Invoice } from '@/lib/types';
import { CreditCard as CreditCardIcon, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/creditCardUtils';

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
  const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id);
  const usagePercentage = (card.committedAmount / card.limit) * 100;

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
        {/* Informações do Limite */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Limite Comprometido</span>
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
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mt-2">
              <div className="text-center">
                <p className="font-medium text-slate-700">Comprometido</p>
                <p>{formatCurrency(card.committedAmount)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-700">Disponível</p>
                <p>{formatCurrency(card.availableLimit)}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-700">Fatura Atual</p>
                <p className="text-blue-600 font-medium">{formatCurrency(card.currentInvoiceAmount)}</p>
              </div>
            </div>
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

        {/* Fatura Atual - Informações Detalhadas */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Próxima Fatura</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Valor:</span>
              <span className="font-medium">{formatCurrency(card.currentInvoiceAmount)}</span>
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
              .filter(p => p.cardId === card.id && !p.isPaid)
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
                      <p className="text-slate-500">
                        {purchase.installments}x de {formatCurrency(purchase.amount / purchase.installments)}
                      </p>
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
