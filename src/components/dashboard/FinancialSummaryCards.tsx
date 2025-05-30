
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { FinancialSummary, FinancialLight } from '@/lib/types';

interface FinancialSummaryCardsProps {
  summary: FinancialSummary;
  financialLight: FinancialLight;
}

export function FinancialSummaryCards({ summary, financialLight }: FinancialSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getLightColor = (light: FinancialLight) => {
    switch (light) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
    }
  };

  const getLightMessage = (light: FinancialLight) => {
    switch (light) {
      case 'green': return 'Situação financeira saudável';
      case 'yellow': return 'Atenção: risco moderado';
      case 'red': return 'Alerta: situação crítica';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Saldo Atual */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-slate-600">Saldo Atual</CardTitle>
          <Wallet className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(summary.currentBalance)}</div>
          <div className={`flex items-center mt-2 text-xs ${
            summary.currentBalance > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${getLightColor(financialLight)}`} />
            {getLightMessage(financialLight)}
          </div>
        </CardContent>
      </Card>

      {/* Receitas do Mês */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-slate-600">Receitas do Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(summary.monthlyIncome)}</div>
          <p className="text-xs text-slate-500 mt-2">
            Taxa de poupança: {(summary.savingsRate * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Despesas do Mês */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-slate-600">Despesas do Mês</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(summary.monthlyExpenses)}</div>
          <p className="text-xs text-slate-500 mt-2">
            {((summary.monthlyExpenses / summary.monthlyIncome) * 100).toFixed(1)}% da renda
          </p>
        </CardContent>
      </Card>

      {/* Projeção */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-slate-600">Projeção 30 dias</CardTitle>
          <CreditCard className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(summary.projectedBalance)}</div>
          <p className="text-xs text-slate-500 mt-2">
            Inclui faturas e gastos previstos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
