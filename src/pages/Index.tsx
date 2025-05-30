
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Transactions } from '@/components/transactions/Transactions';
import { Goals } from '@/components/goals/Goals';
import { Purchases } from '@/components/purchases/Purchases';
import { Cards } from '@/components/cards/Cards';
import { Transaction, FinancialGoal, PlannedPurchase, CreditCard, CreditCardPurchase, FinancialSummary } from '@/lib/types';
import { FinancialEngine } from '@/lib/financial-engine';
import { mockTransactions, mockGoals, mockPlannedPurchases, mockCreditCards, mockCreditCardPurchases } from '@/lib/mock-data';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals);
  const [plannedPurchases, setPlannedPurchases] = useState<PlannedPurchase[]>(mockPlannedPurchases);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
  const [creditCardPurchases, setCreditCardPurchases] = useState<CreditCardPurchase[]>(mockCreditCardPurchases);

  // Generate financial summary
  const currentBalance = 8500; // Mock current balance
  const monthlyIncome = FinancialEngine.calculateMonthlyIncome(transactions);
  const monthlyExpenses = FinancialEngine.calculateMonthlyExpenses(transactions);
  const projectedBalance = FinancialEngine.calculateProjectedBalance(currentBalance, transactions, creditCardPurchases);
  const creditCardDebt = creditCardPurchases.reduce((sum, p) => sum + (p.amount / p.installments), 0);
  const totalDebts = creditCardDebt + 15000; // Mock additional debts
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;

  const summary: FinancialSummary = {
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    projectedBalance,
    creditCardDebt,
    totalDebts,
    savingsRate
  };

  // Event handlers
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoal = (id: string, currentAmount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddPurchase = (purchase: Omit<PlannedPurchase, 'id'>) => {
    const newPurchase = {
      ...purchase,
      id: Date.now().toString()
    };
    setPlannedPurchases([...plannedPurchases, newPurchase]);
  };

  const handleDeletePurchase = (id: string) => {
    setPlannedPurchases(plannedPurchases.filter(p => p.id !== id));
  };

  const handleAddCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard = {
      ...card,
      id: Date.now().toString()
    };
    setCreditCards([...creditCards, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    setCreditCards(creditCards.filter(c => c.id !== id));
    setCreditCardPurchases(creditCardPurchases.filter(p => p.cardId !== id));
  };

  const handleAddCreditCardPurchase = (purchase: Omit<CreditCardPurchase, 'id'>) => {
    const newPurchase = {
      ...purchase,
      id: Date.now().toString()
    };
    setCreditCardPurchases([...creditCardPurchases, newPurchase]);
  };

  const handleDeleteCreditCardPurchase = (id: string) => {
    setCreditCardPurchases(creditCardPurchases.filter(p => p.id !== id));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            summary={summary}
            transactions={transactions}
            goals={goals}
            plannedPurchases={plannedPurchases}
            onPageChange={setCurrentPage}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'goals':
        return (
          <Goals
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'purchases':
        return (
          <Purchases
            purchases={plannedPurchases}
            summary={summary}
            onAddPurchase={handleAddPurchase}
            onDeletePurchase={handleDeletePurchase}
          />
        );
      case 'cards':
        return (
          <Cards
            cards={creditCards}
            purchases={creditCardPurchases}
            onAddCard={handleAddCard}
            onAddPurchase={handleAddCreditCardPurchase}
            onDeleteCard={handleDeleteCard}
            onDeletePurchase={handleDeleteCreditCardPurchase}
          />
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Configurações</h1>
            <p className="text-slate-600">Página de configurações em desenvolvimento...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="lg:ml-64">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default Index;
