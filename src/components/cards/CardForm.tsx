
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from '@/lib/types';
import { DollarSign } from 'lucide-react';

interface CardFormProps {
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
  onCancel: () => void;
}

export function CardForm({ onAddCard, onCancel }: CardFormProps) {
  const [cardForm, setCardForm] = useState({
    name: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    color: '#8A2BE2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardForm.name || !cardForm.limit || !cardForm.closingDay || !cardForm.dueDay) {
      return;
    }

    const card: Omit<CreditCard, 'id'> = {
      name: cardForm.name,
      limit: parseFloat(cardForm.limit),
      closingDay: parseInt(cardForm.closingDay),
      dueDay: parseInt(cardForm.dueDay),
      color: cardForm.color,
      currentBalance: 0,
      availableLimit: parseFloat(cardForm.limit)
    };

    onAddCard(card);
    
    setCardForm({
      name: '',
      limit: '',
      closingDay: '',
      dueDay: '',
      color: '#8A2BE2'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Cartão</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardName">Nome do Cartão</Label>
              <Input
                id="cardName"
                placeholder="Ex: Nubank, Itaú..."
                value={cardForm.name}
                onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="limit">Limite</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={cardForm.limit}
                  onChange={(e) => setCardForm({...cardForm, limit: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="closingDay">Dia do Fechamento</Label>
              <Input
                id="closingDay"
                type="number"
                min="1"
                max="31"
                placeholder="15"
                value={cardForm.closingDay}
                onChange={(e) => setCardForm({...cardForm, closingDay: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="dueDay">Dia do Vencimento</Label>
              <Input
                id="dueDay"
                type="number"
                min="1"
                max="31"
                placeholder="10"
                value={cardForm.dueDay}
                onChange={(e) => setCardForm({...cardForm, dueDay: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                type="color"
                value={cardForm.color}
                onChange={(e) => setCardForm({...cardForm, color: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Adicionar Cartão</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
