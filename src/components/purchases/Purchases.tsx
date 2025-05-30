
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PlannedPurchase, FinancialSummary } from '@/lib/types';
import { FinancialEngine } from '@/lib/financial-engine';
import { ShoppingCart, Plus, DollarSign, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface PurchasesProps {
  purchases: PlannedPurchase[];
  summary: FinancialSummary;
  onAddPurchase: (purchase: Omit<PlannedPurchase, 'id'>) => void;
  onDeletePurchase: (id: string) => void;
}

export function Purchases({ purchases, summary, onAddPurchase, onDeletePurchase }: PurchasesProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    estimatedPrice: '',
    urgency: 'medium' as 'high' | 'medium' | 'low',
    canInstall: false,
    maxInstallments: '',
    category: '',
    notes: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.estimatedPrice || !formData.category) {
      return;
    }

    const purchase: Omit<PlannedPurchase, 'id'> = {
      item: formData.item,
      estimatedPrice: parseFloat(formData.estimatedPrice),
      urgency: formData.urgency,
      canInstall: formData.canInstall,
      maxInstallments: formData.canInstall ? parseInt(formData.maxInstallments) : undefined,
      category: formData.category,
      notes: formData.notes || undefined
    };

    onAddPurchase(purchase);
    
    // Reset form
    setFormData({
      item: '',
      estimatedPrice: '',
      urgency: 'medium',
      canInstall: false,
      maxInstallments: '',
      category: '',
      notes: ''
    });
    setShowForm(false);
  };

  const categories = ['Eletrônicos', 'Eletrodomésticos', 'Móveis', 'Roupas', 'Automóvel', 'Casa', 'Lazer', 'Outros'];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planejamento de Compras</h1>
          <p className="text-slate-600 mt-1">Planeje suas compras e veja quando é viável comprá-las</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Compra
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Planejar Nova Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item">Item</Label>
                  <Input
                    id="item"
                    placeholder="Ex: iPhone 15, Geladeira, Sofá..."
                    value={formData.item}
                    onChange={(e) => setFormData({...formData, item: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                  <Label htmlFor="estimatedPrice">Preço Estimado</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="estimatedPrice"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.estimatedPrice}
                      onChange={(e) => setFormData({...formData, estimatedPrice: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="urgency">Urgência</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 Alta</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="canInstall"
                    checked={formData.canInstall}
                    onCheckedChange={(checked) => setFormData({...formData, canInstall: checked})}
                  />
                  <Label htmlFor="canInstall">Pode ser parcelado</Label>
                </div>

                {formData.canInstall && (
                  <div>
                    <Label htmlFor="maxInstallments">Máximo de parcelas</Label>
                    <Input
                      id="maxInstallments"
                      type="number"
                      min="2"
                      max="24"
                      placeholder="12"
                      value={formData.maxInstallments}
                      onChange={(e) => setFormData({...formData, maxInstallments: e.target.value})}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações sobre a compra..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Adicionar Compra</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Compras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase) => {
          const viability = FinancialEngine.calculatePurchaseViability(
            { price: purchase.estimatedPrice, installments: purchase.maxInstallments },
            summary
          );
          
          return (
            <Card key={purchase.id} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{getUrgencyIcon(purchase.urgency)}</span>
                      {purchase.item}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {purchase.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePurchase(purchase.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(purchase.estimatedPrice)}</p>
                  {purchase.canInstall && purchase.maxInstallments && (
                    <p className="text-sm text-slate-600">
                      ou {purchase.maxInstallments}x de {formatCurrency(purchase.estimatedPrice / purchase.maxInstallments)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Urgência:</span>
                    <Badge className={getUrgencyColor(purchase.urgency)}>
                      {purchase.urgency === 'high' ? 'Alta' : 
                       purchase.urgency === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Parcelável:</span>
                    <span className="text-sm">{purchase.canInstall ? 'Sim' : 'Não'}</span>
                  </div>
                </div>

                {/* Análise de Viabilidade */}
                <div className={`p-3 rounded-lg border ${
                  viability.canBuy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {viability.canBuy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      viability.canBuy ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {viability.canBuy ? 'Compra Viável' : 'Aguardar'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{viability.recommendation}</p>
                  
                  {viability.canBuy && (
                    <div className="mt-2">
                      <Badge variant={viability.bestOption === 'cash' ? 'default' : 'secondary'} className="text-xs">
                        Melhor opção: {viability.bestOption === 'cash' ? 'À vista' : 'Parcelado'}
                      </Badge>
                    </div>
                  )}
                </div>

                {purchase.notes && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-slate-600">{purchase.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {purchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma compra planejada</h3>
            <p className="text-slate-600 mb-4">Adicione itens que você deseja comprar para analisar a viabilidade</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Planejar Primeira Compra
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
