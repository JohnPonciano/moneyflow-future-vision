
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FinancialGoal } from '@/lib/types';
import { Target, Calendar } from 'lucide-react';

interface GoalsProgressProps {
  goals: FinancialGoal[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Progresso das Metas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            
            return (
              <div key={goal.id} className="p-4 rounded-lg border bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      className={`text-white text-xs ${getPriorityColor(goal.priority)}`}
                    >
                      {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progresso</span>
                    <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Meta: {formatDate(goal.deadline)}</span>
                  </div>
                  <span>Restam: {formatCurrency(remaining)}</span>
                </div>
              </div>
            );
          })}
          
          {goals.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma meta cadastrada</p>
              <p className="text-sm mt-1">Defina suas metas financeiras para acompanhar o progresso</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
