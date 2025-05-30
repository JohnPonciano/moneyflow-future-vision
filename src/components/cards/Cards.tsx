import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CreditCard, CreditCardPurchase, CreditCardSubscription, Invoice } from '@/lib/types';
import { Plus, CreditCard as CreditCardIcon, Calendar, DollarSign, Trash2, RotateCcw } from 'lucide-react';

interface CardsProps {
  cards: CreditCard[];
  purchases: CreditCardPurchase[];
  subscriptions: CreditCardSubscription[];
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
  onAddPurchase: (purchase: Omit<CreditCardPurchase, 'id'>) => void;
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
  onAddSubscription, 
  onDeleteCard, 
  onDeletePurchase, 
  onDeleteSubscription,
  onToggleSubscription 
}: CardsProps) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  
  const [cardForm, setCardForm] = useState({
    name: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    color: '#8A2BE2'
  });
  const [purchaseForm, setPurchaseForm] = useState({
    cardId: '',
    description: '',
    amount: '',
    installments: '1',
    purchaseDate: new Date().toISOString().split('T')[0],
    category: ''
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    cardId: '',
    description: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    category: ''
  });

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

  const calculateUsedLimit = (cardId: string) => {
    const cardPurchases = purchases.filter(p => p.cardId === cardId);
    const cardSubscriptions = subscriptions.filter(s => s.cardId === cardId && s.isActive);
    
    // Calcula o valor das parcelas ainda não pagas
    const now = new Date();
    const purchasesUsedLimit = cardPurchases.reduce((sum, purchase) => {
      const monthsSincePurchase = (now.getFullYear() - purchase.purchaseDate.getFullYear()) * 12 + 
                                  (now.getMonth() - purchase.purchaseDate.getMonth());
      const remainingInstallments = Math.max(0, purchase.installments - monthsSincePurchase);
      const monthlyInstallment = purchase.amount / purchase.installments;
      return sum + (monthlyInstallment * remainingInstallments);
    }, 0);
    
    // Soma as assinaturas ativas (cada assinatura ocupa seu valor integral no limite)
    const subscriptionsUsedLimit = cardSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
    
    return purchasesUsedLimit + subscriptionsUsedLimit;
  };

  const calculateAvailableLimit = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return 0;
    
    const usedLimit = calculateUsedLimit(cardId);
    return Math.max(0, card.limit - usedLimit);
  };

  const generateInvoice = (cardId: string, month: number, year: number): Invoice => {
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
      purchases: cardPurchases,
      subscriptions: cardSubscriptions
    };
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardForm.name || !cardForm.limit || !cardForm.closingDay || !cardForm.dueDay) {
      return;
    }

    const card: Omit<CreditCard, 'id'> = {
      name: cardForm.name,
      limit: parseFloat(cardForm.limit),
      closingDay: parseInt(cardForm.closingDay),
      dueDay: parseInt(cardForm.dueDay),
      color: cardForm.color
    };

    onAddCard(card);
    
    setCardForm({
      name: '',
      limit: '',
      closingDay: '',
      dueDay: '',
      color: '#8A2BE2'
    });
    setShowCardForm(false);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchaseForm.cardId || !purchaseForm.description || !purchaseForm.amount || !purchaseForm.category) {
      return;
    }

    const purchase: Omit<CreditCardPurchase, 'id'> = {
      cardId: purchaseForm.cardId,
      description: purchaseForm.description,
      amount: parseFloat(purchaseForm.amount),
      installments: parseInt(purchaseForm.installments),
      purchaseDate: new Date(purchaseForm.purchaseDate),
      category: purchaseForm.category
    };

    onAddPurchase(purchase);
    
    setPurchaseForm({
      cardId: '',
      description: '',
      amount: '',
      installments: '1',
      purchaseDate: new Date().toISOString().split('T')[0],
      category: ''
    });
    setShowPurchaseForm(false);
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
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
    setShowSubscriptionForm(false);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Eletrônicos', 'Roupas', 'Casa', 'Entretenimento', 'Trabalho', 'Outros'];

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
          <Button onClick={() => setShowPurchaseForm(!showPurchaseForm)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Compra
          </Button>
          <Button onClick={() => setShowSubscriptionForm(!showSubscriptionForm)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova Assinatura
          </Button>
        </div>
      </div>

      {/* Formulário de Cartão */}
      {showCardForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCardSubmit} className="space-y-4">
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
                <Button type="button" variant="outline" onClick={() => setShowCardForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Compra */}
      {showPurchaseForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Compra no Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardSelect">Cartão</Label>
                  <Select value={purchaseForm.cardId} onValueChange={(value) => setPurchaseForm({...purchaseForm, cardId: value})}>
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
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={purchaseForm.category} onValueChange={(value) => setPurchaseForm({...purchaseForm, category: value})}>
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
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Supermercado, iPhone..."
                    value={purchaseForm.description}
                    onChange={(e) => setPurchaseForm({...purchaseForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={purchaseForm.amount}
                      onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="installments">Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    max="24"
                    placeholder="1"
                    value={purchaseForm.installments}
                    onChange={(e) => setPurchaseForm({...purchaseForm, installments: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="purchaseDate">Data da Compra</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={purchaseForm.purchaseDate}
                    onChange={(e) => setPurchaseForm({...purchaseForm, purchaseDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Registrar Compra</Button>
                <Button type="button" variant="outline" onClick={() => setShowPurchaseForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Assinatura */}
      {showSubscriptionForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
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
                <Button type="button" variant="outline" onClick={() => setShowSubscriptionForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Cartões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const usedLimit = calculateUsedLimit(card.id);
          const availableLimit = calculateAvailableLimit(card.id);
          const usagePercentage = (usedLimit / card.limit) * 100;
          const currentInvoice = generateInvoice(card.id, currentMonth, currentYear);
          const cardSubscriptions = subscriptions.filter(s => s.cardId === card.id);
          
          return (
            <Card key={card.id} className="relative overflow-hidden">
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
        })}
      </div>

      {cards.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCardIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-slate-600 mb-4">Adicione seus cartões de crédito para controlar as faturas</p>
            <Button onClick={() => setShowCardForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Primeiro Cartão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
