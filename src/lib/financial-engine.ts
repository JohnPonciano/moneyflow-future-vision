import { Transaction, CreditCardPurchase, FinancialGoal, Debt, FinancialSummary, FinancialLight } from './types';

export class FinancialEngine {
  static calculateMonthlyIncome(transactions: Transaction[] | undefined): number {
    if (!transactions || !Array.isArray(transactions)) {
      return 0;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Todas as receitas do mês atual
    return transactions
      .filter(t => 
        t.type === 'income' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static calculateMonthlyExpenses(transactions: Transaction[] | undefined): number {
    if (!transactions || !Array.isArray(transactions)) {
      return 0;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Todas as despesas do mês atual
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date.getMonth() === currentMonth && 
        t.date.getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  static calculateCurrentBalance(transactions: Transaction[] | undefined): number {
    if (!transactions || !Array.isArray(transactions)) {
      return 0;
    }

    const monthlyIncome = this.calculateMonthlyIncome(transactions);
    const monthlyExpenses = this.calculateMonthlyExpenses(transactions);
    
    return monthlyIncome - monthlyExpenses;
  }

  static calculateProjectedBalance(
    transactions: Transaction[] | undefined,
    daysAhead: number = 30
  ): number {
    if (!transactions || !Array.isArray(transactions)) {
      return 0;
    }

    // Calcula receitas recorrentes mensais
    const recurringIncome = transactions
      .filter(t => t.type === 'income' && t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcula despesas recorrentes mensais
    const recurringExpenses = transactions
      .filter(t => t.type === 'expense' && t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0);

    // Projeção é simplesmente receitas recorrentes - despesas recorrentes
    return recurringIncome - recurringExpenses;
  }

  static getFinancialLight(summary: FinancialSummary): FinancialLight {
    const { 
      currentBalance,
      monthlyIncome, 
      monthlyExpenses,
      projectedBalance
    } = summary;
    
    // Situação crítica: saldo negativo ou despesas maiores que receitas
    if (currentBalance < 0 || monthlyExpenses > monthlyIncome) {
      return 'red';
    }
    
    // Situação de atenção: projeção negativa ou despesas próximas da receita
    if (projectedBalance < 0 || monthlyExpenses > monthlyIncome * 0.8) {
      return 'yellow';
    }
    
    return 'green';
  }

  static calculatePurchaseViability(
    purchase: { price: number; installments?: number },
    summary: FinancialSummary
  ): { canBuy: boolean; recommendation: string; bestOption: 'cash' | 'installments' } {
    const { currentBalance, monthlyIncome, monthlyExpenses } = summary;
    const monthlyInstallment = purchase.installments 
      ? purchase.price / purchase.installments
      : purchase.price;
    
    const disposableIncome = monthlyIncome - monthlyExpenses;
    
    // Pode comprar à vista se o valor não comprometer mais que 50% do saldo
    const canBuyCash = purchase.price <= currentBalance * 0.5;
    
    // Pode parcelar se a parcela não comprometer mais que 20% da renda disponível
    const canBuyInstallments = monthlyInstallment <= disposableIncome * 0.2;
    
    if (canBuyCash) {
      return {
        canBuy: true,
        recommendation: 'Você pode comprar à vista sem comprometer seu saldo.',
        bestOption: 'cash'
      };
    } else if (canBuyInstallments) {
      return {
        canBuy: true,
        recommendation: `Recomendamos parcelar em ${purchase.installments}x para não comprometer sua renda mensal.`,
        bestOption: 'installments'
      };
    } else {
      return {
        canBuy: false,
        recommendation: 'Não recomendamos a compra no momento. Considere juntar mais dinheiro ou buscar alternativas.',
        bestOption: 'cash'
      };
    }
  }

  static generateRecommendations(summary: FinancialSummary, goals: FinancialGoal[] | undefined): string[] {
    const recommendations: string[] = [];
    const { 
      monthlyIncome, 
      monthlyExpenses, 
      currentBalance,
      projectedBalance
    } = summary;
    
    // Recomendações baseadas na situação atual
    if (currentBalance < 0) {
      recommendations.push(
        'Situação crítica: Seu saldo está negativo. Priorize cortar gastos não essenciais imediatamente.'
      );
    }
    
    if (monthlyExpenses > monthlyIncome * 0.8) {
      const exceeding = monthlyExpenses - (monthlyIncome * 0.8);
      recommendations.push(
        `Reduza despesas em R$ ${exceeding.toFixed(2)} para manter gastos abaixo de 80% da sua renda.`
      );
    }
    
    if (projectedBalance < 0) {
      recommendations.push(
        'Atenção: Suas despesas fixas estão maiores que suas receitas fixas. Revise seus gastos recorrentes.'
      );
    }
    
    // Verifica se tem reserva de emergência
    if (goals && Array.isArray(goals)) {
      const emergencyGoal = goals.find(g => g.category === 'emergency');
      if (!emergencyGoal || emergencyGoal.currentAmount < monthlyExpenses * 3) {
        const needed = (monthlyExpenses * 3) - (emergencyGoal?.currentAmount || 0);
        recommendations.push(
          `Procure reservar R$ ${needed.toFixed(2)} para ter 3 meses de despesas guardados para emergências.`
        );
      }
    }
    
    return recommendations;
  }
}
