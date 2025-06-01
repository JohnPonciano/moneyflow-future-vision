
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, CreditCardPurchase } from '@/lib/types';
import { Edit, Trash2, Plus } from 'lucide-react';

interface PurchaseManagerProps {
  purchases: CreditCardPurchase[];
  cards: CreditCard[];
  onAddPurchase: (purchase: Omit<CreditCardPurchase, 'id'>) => void;
  onEditPurchase: (id: string, purchase: Partial<CreditCardPurchase>) => void;
  onDeletePurchase: (id: string) => void;
}

export function PurchaseManager({ 
  purchases, 
  cards, 
  onAddPurchase, 
  onEditPurchase, 
  onDeletePurchase 
}: PurchaseManagerProps) {
  const [editingPurchase, setEditingPurchase] = useState<CreditCardPurchase | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [purchaseForm, setPurchaseForm] = useState({
    cardId: '',
    description: '',
    amount: '',
    installments: '1',
    purchaseDate: new Date().toISOString().split('T')[0],
    category: ''
  });

  const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Eletrônicos', 'Roupas', 'Casa', 'Entretenimento', 'Trabalho', 'Outros'];

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

  const handleAddSubmit = (e: React.FormEvent) => {
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
      category: purchaseForm.category,
      currentInstallment: 1,
      remainingAmount: parseFloat(purchaseForm.amount),
      isPaid: false
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
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPurchase || !purchaseForm.description || !purchaseForm.amount || !purchaseForm.category) {
      return;
    }

    const updatedPurchase: Partial<CreditCardPurchase> = {
      description: purchaseForm.description,
      amount: parseFloat(purchaseForm.amount),
      installments: parseInt(purchaseForm.installments),
      purchaseDate: new Date(purchaseForm.purchaseDate),
      category: purchaseForm.category
    };

    onEditPurchase(editingPurchase.id, updatedPurchase);
    setEditingPurchase(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (purchase: CreditCardPurchase) => {
    setEditingPurchase(purchase);
    setPurchaseForm({
      cardId: purchase.cardId,
      description: purchase.description,
      amount: purchase.amount.toString(),
      installments: purchase.installments.toString(),
      purchaseDate: purchase.purchaseDate.toISOString().split('T')[0],
      category: purchase.category
    });
    setIsEditDialogOpen(true);
  };

  const getCardName = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? card.name : 'Cartão não encontrado';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Compras</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Compra
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Compra</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
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
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={purchaseForm.amount}
                      onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})}
                    />
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
                  <Button type="submit">Adicionar Compra</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhuma compra encontrada
            </p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{purchase.description}</h4>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {purchase.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getCardName(purchase.cardId)} • {formatDate(purchase.purchaseDate)}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-medium">{formatCurrency(purchase.amount)}</span>
                    {purchase.installments > 1 && (
                      <span className="text-sm text-muted-foreground">
                        {purchase.installments}x de {formatCurrency(purchase.amount / purchase.installments)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(purchase)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePurchase(purchase.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Compra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCategory">Categoria</Label>
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
                  <Label htmlFor="editDescription">Descrição</Label>
                  <Input
                    id="editDescription"
                    placeholder="Ex: Supermercado, iPhone..."
                    value={purchaseForm.description}
                    onChange={(e) => setPurchaseForm({...purchaseForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="editAmount">Valor</Label>
                  <Input
                    id="editAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={purchaseForm.amount}
                    onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="editInstallments">Parcelas</Label>
                  <Input
                    id="editInstallments"
                    type="number"
                    min="1"
                    max="24"
                    placeholder="1"
                    value={purchaseForm.installments}
                    onChange={(e) => setPurchaseForm({...purchaseForm, installments: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="editPurchaseDate">Data da Compra</Label>
                  <Input
                    id="editPurchaseDate"
                    type="date"
                    value={purchaseForm.purchaseDate}
                    onChange={(e) => setPurchaseForm({...purchaseForm, purchaseDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Salvar Alterações</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
