export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
}

export interface AppData {
  transactions: Transaction[];
}

export interface Summary {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TransactionFormData {
  type: string;
  amount: string;
  description: string;
  date: string;
}
