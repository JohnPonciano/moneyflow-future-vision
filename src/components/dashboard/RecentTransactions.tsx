
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
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
    }).format(date);
  };

  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Últimas Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-right ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                <p className="font-bold">
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.isRecurring && (
                  <Badge variant="outline" className="text-xs mt-1">
                    Recorrente
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>Nenhuma transação encontrada</p>
              <p className="text-sm mt-1">Adicione suas primeiras receitas e despesas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
