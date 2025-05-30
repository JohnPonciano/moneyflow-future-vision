
import { Transaction, CreditCardPurchase, FinancialGoal, Debt, FinancialSummary, FinancialLight } from './types';

export class FinancialEngine {
  static calculateMonthlyIncome(transactions: Transaction[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => 
        t.type === 'income' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static calculateMonthlyExpenses(transactions: Transaction[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static calculateProjectedBalance(
    currentBalance: number,
    transactions: Transaction[],
    creditCardPurchases: CreditCardPurchase[],
    daysAhead: number = 30
  ): number {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    // Receitas e despesas futuras
    const futureTransactions = transactions.filter(t => t.date <= futureDate && t.date > new Date());
    const futureIncome = futureTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const futureExpenses = futureTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Faturas de cartão estimadas
    const creditCardDebt = creditCardPurchases.reduce((sum, purchase) => {
      const monthlyInstallment = purchase.amount / purchase.installments;
      return sum + monthlyInstallment;
    }, 0);
    
    return currentBalance + futureIncome - futureExpenses - creditCardDebt;
  }

  static getFinancialLight(summary: FinancialSummary): FinancialLight {
    const { projectedBalance, monthlyIncome, totalDebts } = summary;
    
    if (projectedBalance < 0) return 'red';
    if (projectedBalance < monthlyIncome * 0.3 || totalDebts > monthlyIncome * 5) return 'yellow';
    return 'green';
  }

  static calculatePurchaseViability(
    purchase: { price: number; installments?: number },
    summary: FinancialSummary
  ): { canBuy: boolean; recommendation: string; bestOption: 'cash' | 'installments' } {
    const { projectedBalance, monthlyIncome } = summary;
    const monthlyInstallment = purchase.installments ? purchase.price / purchase.installments : purchase.price;
    
    const canBuyCash = projectedBalance - purchase.price > monthlyIncome * 0.2;
    const canBuyInstallments = monthlyInstallment < monthlyIncome * 0.1;
    
    if (canBuyCash) {
      return {
        canBuy: true,
        recommendation: 'Você pode comprar à vista sem comprometer sua reserva de emergência.',
        bestOption: 'cash'
      };
    } else if (canBuyInstallments) {
      return {
        canBuy: true,
        recommendation: `Recomendamos parcelar em ${purchase.installments}x para não impactar seu fluxo de caixa.`,
        bestOption: 'installments'
      };
    } else {
      return {
        canBuy: false,
        recommendation: 'Aguarde alguns meses ou considere uma compra de menor valor.',
        bestOption: 'cash'
      };
    }
  }

  static generateRecommendations(summary: FinancialSummary, goals: FinancialGoal[]): string[] {
    const recommendations: string[] = [];
    const { monthlyIncome, monthlyExpenses, projectedBalance, savingsRate } = summary;
    
    if (savingsRate < 0.2) {
      recommendations.push('Tente economizar pelo menos 20% da sua renda mensal.');
    }
    
    if (monthlyExpenses > monthlyIncome * 0.8) {
      recommendations.push('Suas despesas estão muito altas. Considere revisar gastos desnecessários.');
    }
    
    if (projectedBalance < monthlyIncome * 0.3) {
      recommendations.push('Sua reserva de emergência está baixa. Priorize poupar nos próximos meses.');
    }
    
    const emergencyGoal = goals.find(g => g.category === 'emergency');
    if (!emergencyGoal || emergencyGoal.currentAmount < monthlyIncome * 6) {
      recommendations.push('Crie uma reserva de emergência equivalente a 6 meses de gastos.');
    }
    
    return recommendations;
  }
}
