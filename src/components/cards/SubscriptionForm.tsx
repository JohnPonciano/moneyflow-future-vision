
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CreditCardSubscription } from '@/lib/types';
import { DollarSign } from 'lucide-react';

interface SubscriptionFormProps {
  cards: CreditCard[];
  onAddSubscription: (subscription: Omit<CreditCardSubscription, 'id'>) => void;
  onCancel: () => void;
}

export function SubscriptionForm({ cards, onAddSubscription, onCancel }: SubscriptionFormProps) {
  const [subscriptionForm, setSubscriptionForm] = useState({
    cardId: '',
    description: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    category: ''
  });

  const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Eletrônicos', 'Roupas', 'Casa', 'Entretenimento', 'Trabalho', 'Outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriptionForm.cardId || !subscriptionForm.description || !subscriptionForm.amount || !subscriptionForm.category) {
      return;
    }

    const subscription: Omit<CreditCardSubscription, 'id'> = {
      cardId: subscriptionForm.cardId,
      description: subscriptionForm.description,
      amount: parseFloat(subscriptionForm.amount),
      startDate: new Date(subscriptionForm.startDate),
      category: subscriptionForm.category,
      isActive: true
    };

    onAddSubscription(subscription);
    
    setSubscriptionForm({
      cardId: '',
      description: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0],
      category: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subscriptionCardSelect">Cartão</Label>
              <Select value={subscriptionForm.cardId} onValueChange={(value) => setSubscriptionForm({...subscriptionForm, cardId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subscriptionCategory">Categoria</Label>
              <Select value={subscriptionForm.category} onValueChange={(value) => setSubscriptionForm({...subscriptionForm, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subscriptionDescription">Descrição</Label>
              <Input
                id="subscriptionDescription"
                placeholder="Ex: Netflix, Spotify..."
                value={subscriptionForm.description}
                onChange={(e) => setSubscriptionForm({...subscriptionForm, description: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="subscriptionAmount">Valor Mensal</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="subscriptionAmount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={subscriptionForm.amount}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, amount: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subscriptionStartDate">Data de Início</Label>
              <Input
                id="subscriptionStartDate"
                type="date"
                value={subscriptionForm.startDate}
                onChange={(e) => setSubscriptionForm({...subscriptionForm, startDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Adicionar Assinatura</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
