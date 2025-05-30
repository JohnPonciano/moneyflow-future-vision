
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';
import { Transaction } from '@/lib/types';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function Transactions({ transactions, onAddTransaction, onDeleteTransaction }: TransactionsProps) {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lançamentos</h1>
        <p className="text-slate-600 mt-1">Gerencie suas receitas e despesas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TransactionForm onAddTransaction={onAddTransaction} />
        </div>
        
        <div className="lg:col-span-2">
          <TransactionsList 
            transactions={transactions} 
            onDeleteTransaction={onDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
