import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Transactions } from '@/components/transactions/Transactions';
import { Goals } from '@/components/goals/Goals';
import { Purchases } from '@/components/purchases/Purchases';
import { Cards } from '@/components/cards/Cards';
import { Payments } from '@/components/payments/Payments';
import { FinancialSummary } from '@/lib/types';
import { FinancialEngine } from '@/lib/financial-engine';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import { usePlannedPurchases } from '@/hooks/usePlannedPurchases';
import { useCreditCards } from '@/hooks/useCreditCards';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Use custom hooks for data management
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    deleteTransaction
  } = useTransactions();

  const {
    goals,
    loading: goalsLoading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  const {
    purchases: plannedPurchases,
    loading: purchasesLoading,
    addPurchase: addPlannedPurchase,
    deletePurchase: deletePlannedPurchase
  } = usePlannedPurchases();

  const {
    creditCards,
    purchases: creditCardPurchases,
    subscriptions: creditCardSubscriptions,
    loading: cardsLoading,
    addCard,
    deleteCard,
    addPurchase: addCreditCardPurchase,
    deletePurchase: deleteCreditCardPurchase,
    addSubscription: addCreditCardSubscription,
    deleteSubscription: deleteCreditCardSubscription,
    toggleSubscription: toggleCreditCardSubscription
  } = useCreditCards();

  // Generate financial summary usando a nova lógica simplificada
  const monthlyIncome = FinancialEngine.calculateMonthlyIncome(transactions);
  const monthlyExpenses = FinancialEngine.calculateMonthlyExpenses(transactions);
  const currentBalance = FinancialEngine.calculateCurrentBalance(transactions);
  const projectedBalance = FinancialEngine.calculateProjectedBalance(transactions);

  const summary: FinancialSummary = {
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    projectedBalance
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
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'goals':
        return (
          <Goals
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        );
      case 'purchases':
        return (
          <Purchases
            purchases={plannedPurchases}
            summary={summary}
            onAddPurchase={addPlannedPurchase}
            onDeletePurchase={deletePlannedPurchase}
          />
        );
      case 'cards':
        return (
          <Cards
            cards={creditCards}
            purchases={creditCardPurchases}
            subscriptions={creditCardSubscriptions}
            onAddCard={addCard}
            onAddPurchase={addCreditCardPurchase}
            onAddSubscription={addCreditCardSubscription}
            onDeleteCard={deleteCard}
            onDeletePurchase={deleteCreditCardPurchase}
            onDeleteSubscription={deleteCreditCardSubscription}
            onToggleSubscription={toggleCreditCardSubscription}
          />
        );
      case 'payments':
        return (
          <Payments />
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

  // Show loading state if any data is still loading
  if (transactionsLoading || goalsLoading || purchasesLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

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
