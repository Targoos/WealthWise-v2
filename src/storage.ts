import type { Transaction, AppData } from './types';

const STORAGE_KEY = 'wealthwise_data';

export function getTransactions(): Transaction[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as AppData;
    return Array.isArray(data.transactions) ? data.transactions : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  const data: AppData = { transactions };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearTransactions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
