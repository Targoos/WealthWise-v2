import type { Transaction } from './types';

export function calcBalance(transactions: Transaction[]): number {
  return transactions.reduce(
    (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
    0
  );
}

export function getMonthKey(dateString: string): string {
  return dateString.slice(0, 7); // YYYY-MM
}

export function getCurrentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function filterByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((t) => getMonthKey(t.date) === monthKey);
}

export function calcMonthlyIncome(transactions: Transaction[], monthKey: string): number {
  return filterByMonth(transactions, monthKey)
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
}

export function calcMonthlyExpenses(transactions: Transaction[], monthKey: string): number {
  return filterByMonth(transactions, monthKey)
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
}

export function calcMonthlySavings(transactions: Transaction[], monthKey: string): number {
  return calcMonthlyIncome(transactions, monthKey) - calcMonthlyExpenses(transactions, monthKey);
}

export function getLastNMonthKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(d.toISOString().slice(0, 7));
  }
  return keys;
}
