
import { FinancialSummaryCards } from './FinancialSummaryCards';
import { RecentTransactions } from './RecentTransactions';
import { GoalsProgress } from './GoalsProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FinancialSummary, FinancialLight, Transaction, FinancialGoal, PlannedPurchase } from '@/lib/types';
import { FinancialEngine } from '@/lib/financial-engine';
import { ShoppingCart, Lightbulb, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  goals: FinancialGoal[];
  plannedPurchases: PlannedPurchase[];
  onPageChange: (page: string) => void;
}

export function Dashboard({ summary, transactions, goals, plannedPurchases, onPageChange }: DashboardProps) {
  const financialLight = FinancialEngine.getFinancialLight(summary);
  const recommendations = FinancialEngine.generateRecommendations(summary, goals);

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

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Financeiro</h1>
        <p className="text-slate-600 mt-1">Acompanhe sua saúde financeira em tempo real</p>
      </div>

      {/* Cards de Resumo */}
      <FinancialSummaryCards summary={summary} financialLight={financialLight} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transações Recentes */}
          <RecentTransactions transactions={transactions} />

          {/* Recomendações Inteligentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Recomendações Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{recommendation}</p>
                  </div>
                ))}
                
                {recommendations.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Parabéns! Sua situação financeira está ótima!</p>
                    <p className="text-sm mt-1">Continue assim para manter a saúde financeira</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-8">
          {/* Progresso das Metas */}
          <GoalsProgress goals={goals} />

          {/* Compras Planejadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Compras Planejadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plannedPurchases.slice(0, 3).map((purchase) => {
                  const viability = FinancialEngine.calculatePurchaseViability(
                    { price: purchase.estimatedPrice, installments: purchase.maxInstallments },
                    summary
                  );
                  
                  return (
                    <div key={purchase.id} className="p-3 rounded-lg border bg-slate-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900">{purchase.item}</h4>
                        <Badge className={getUrgencyColor(purchase.urgency)}>
                          {purchase.urgency === 'high' ? 'Urgente' : 
                           purchase.urgency === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{formatCurrency(purchase.estimatedPrice)}</p>
                      <div className="mt-2">
                        <Badge variant={viability.canBuy ? 'default' : 'destructive'} className="text-xs">
                          {viability.canBuy ? 'Viável' : 'Aguardar'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {plannedPurchases.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma compra planejada</p>
                  </div>
                )}
                
                {plannedPurchases.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => onPageChange('purchases')}
                  >
                    Ver todas as compras
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
