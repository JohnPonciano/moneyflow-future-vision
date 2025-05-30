
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FinancialGoal } from '@/lib/types';
import { Target, Plus, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface GoalsProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  onUpdateGoal: (id: string, currentAmount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function Goals({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'other' as 'emergency' | 'investment' | 'purchase' | 'debt' | 'other'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'investment': return '📈';
      case 'purchase': return '🛒';
      case 'debt': return '💳';
      default: return '🎯';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      return;
    }

    const goal: Omit<FinancialGoal, 'id'> = {
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: new Date(formData.deadline),
      priority: formData.priority,
      category: formData.category
    };

    onAddGoal(goal);
    
    // Reset form
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'medium',
      category: 'other'
    });
    setShowForm(false);
  };

  const handleUpdateAmount = (goalId: string, newAmount: string) => {
    const amount = parseFloat(newAmount) || 0;
    onUpdateGoal(goalId, amount);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Metas Financeiras</h1>
          <p className="text-slate-600 mt-1">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Reserva de emergência"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">🚨 Emergência</SelectItem>
                      <SelectItem value="investment">📈 Investimento</SelectItem>
                      <SelectItem value="purchase">🛒 Compra</SelectItem>
                      <SelectItem value="debt">💳 Quitação de Dívida</SelectItem>
                      <SelectItem value="other">🎯 Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAmount">Valor Objetivo</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentAmount">Valor Atual</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Data Limite</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Criar Meta</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysToDeadline = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-white text-xs ${getPriorityColor(goal.priority)}`}>
                          {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Progresso</span>
                    <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Atual:</span>
                    <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Objetivo:</span>
                    <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Restante:</span>
                    <span className="font-medium text-red-600">{formatCurrency(remaining)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Meta: {formatDate(goal.deadline)}</span>
                    <span className={`ml-auto ${daysToDeadline < 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {daysToDeadline} dias
                    </span>
                  </div>

                  <div>
                    <Label htmlFor={`update-${goal.id}`} className="text-xs">Atualizar valor atual</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={`update-${goal.id}`}
                        type="number"
                        step="0.01"
                        placeholder="Novo valor"
                        className="h-8 text-xs"
                      />
                      <Button 
                        size="sm" 
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          const input = document.getElementById(`update-${goal.id}`) as HTMLInputElement;
                          if (input.value) {
                            handleUpdateAmount(goal.id, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma meta cadastrada</h3>
            <p className="text-slate-600 mb-4">Defina suas metas financeiras para começar a acompanhar seu progresso</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
