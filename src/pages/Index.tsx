
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
    updatePurchase: updatePlannedPurchase, 
    deletePurchase: deletePlannedPurchase 
  } = usePlannedPurchases();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            transactions={transactions}
            goals={goals}
          />
        );
      case "transactions":
        return (
          <Transactions 
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            loading={transactionsLoading}
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
            onAddPurchase={addPlannedPurchase}
            onUpdatePurchase={updatePlannedPurchase}
            onDeletePurchase={deletePlannedPurchase}
            loading={purchasesLoading}
          />
        );
      case "payments":
        return (
          <Payments
            transactions={transactions}
            creditCards={creditCards}
            purchases={purchases}
            subscriptions={subscriptions}
          />
        );
      default:
        return <Dashboard transactions={transactions} goals={goals} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
