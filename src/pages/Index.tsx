
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Transactions } from "@/components/transactions/Transactions";
import { Cards } from "@/components/cards/Cards";
import { Goals } from "@/components/goals/Goals";
import { Purchases } from "@/components/purchases/Purchases";
import { Payments } from "@/components/payments/Payments";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { usePlannedPurchases } from "@/hooks/usePlannedPurchases";
import { FinancialSummary } from "@/lib/types";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { 
    creditCards, 
    purchases, 
    subscriptions, 
    loading: cardsLoading, 
    addCard, 
    deleteCard, 
    addPurchase, 
    editPurchase,
    deletePurchase, 
    addSubscription, 
    deleteSubscription, 
    toggleSubscription 
  } = useCreditCards();
  
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

  // Calculate financial summary
  const calculateFinancialSummary = (): FinancialSummary => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && 
        new Date(t.date).getMonth() === currentMonth && 
        new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && 
        new Date(t.date).getMonth() === currentMonth && 
        new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentBalance = monthlyIncome - monthlyExpenses;
    const projectedBalance = currentBalance;

    return {
      currentBalance,
      monthlyIncome,
      monthlyExpenses,
      projectedBalance
    };
  };

  const summary = calculateFinancialSummary();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            summary={summary}
            transactions={transactions}
            goals={goals}
            plannedPurchases={plannedPurchases}
            onPageChange={setActiveTab}
          />
        );
      case "transactions":
        return (
          <Transactions 
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case "cards":
        return (
          <Cards
            cards={creditCards}
            purchases={purchases}
            subscriptions={subscriptions}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onAddPurchase={addPurchase}
            onEditPurchase={editPurchase}
            onDeletePurchase={deletePurchase}
            onAddSubscription={addSubscription}
            onDeleteSubscription={deleteSubscription}
            onToggleSubscription={toggleSubscription}
          />
        );
      case "goals":
        return (
          <Goals
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoal}
            onDeleteGoal={deleteGoal}
          />
        );
      case "purchases":
        return (
          <Purchases
            purchases={plannedPurchases}
            summary={summary}
            onAddPurchase={addPlannedPurchase}
            onDeletePurchase={deletePlannedPurchase}
          />
        );
      case "payments":
        return (
          <Payments />
        );
      default:
        return (
          <Dashboard 
            summary={summary}
            transactions={transactions} 
            goals={goals} 
            plannedPurchases={plannedPurchases}
            onPageChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={activeTab} onPageChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
