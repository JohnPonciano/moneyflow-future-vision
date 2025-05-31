import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, CreditCard, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
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

  const getBalanceChange = () => {
    const change = (summary.projectedBalance - summary.currentBalance) / summary.currentBalance;
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      icon: change >= 0 ? ArrowUpRight : ArrowDownRight,
      color: change >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  const balanceChange = getBalanceChange();

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
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center text-xs ${getLightColor(financialLight) === 'bg-green-500' ? 'text-green-600' : getLightColor(financialLight) === 'bg-yellow-500' ? 'text-yellow-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${getLightColor(financialLight)}`} />
              {getLightMessage(financialLight)}
            </div>
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
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs text-slate-500">
              Taxa de poupança: <span className="font-medium text-green-600">{formatPercentage(summary.savingsRate)}</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(summary.savingsRate * 100, 100)}%` }}
              />
            </div>
          </div>
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
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs text-slate-500">
              {formatPercentage(summary.monthlyExpenses / summary.monthlyIncome)} da renda
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  summary.monthlyExpenses > summary.monthlyIncome * 0.7 
                    ? 'bg-red-500' 
                    : summary.monthlyExpenses > summary.monthlyIncome * 0.5 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((summary.monthlyExpenses / summary.monthlyIncome) * 100, 100)}%` }}
              />
            </div>
          </div>
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
          <div className="flex items-center justify-between mt-2">
            <div className={`flex items-center text-xs ${balanceChange.color}`}>
              <balanceChange.icon className="h-4 w-4 mr-1" />
              {formatPercentage(balanceChange.value)}
            </div>
            {summary.projectedBalance < 0 && (
              <div className="flex items-center text-xs text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Saldo negativo
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
