import { describe, it, expect } from 'vitest';
import {
  calcBalance,
  calcMonthlyIncome,
  calcMonthlyExpenses,
  calcMonthlySavings,
  getLastNMonthKeys,
  getMonthKey,
} from '../finance';
import type { Transaction } from '../types';

const txs: Transaction[] = [
  { id: '1', type: 'income', amount: 100000, description: 'Sueldo', date: '2026-06-01' },
  { id: '2', type: 'expense', amount: 30000, description: 'Alquiler', date: '2026-06-05' },
  { id: '3', type: 'income', amount: 50000, description: 'Freelance', date: '2026-05-15' },
  { id: '4', type: 'expense', amount: 20000, description: 'Supermercado', date: '2026-05-20' },
];

describe('calcBalance', () => {
  it('returns 0 for empty array', () => {
    expect(calcBalance([])).toBe(0);
  });

  it('sums incomes and subtracts expenses across all transactions', () => {
    expect(calcBalance(txs)).toBe(100000);
  });

  it('returns negative value when expenses exceed incomes', () => {
    const data: Transaction[] = [
      { id: 'a', type: 'income', amount: 1000, description: 'x', date: '2026-01-01' },
      { id: 'b', type: 'expense', amount: 3000, description: 'y', date: '2026-01-02' },
    ];
    expect(calcBalance(data)).toBe(-2000);
  });
});

describe('calcMonthlyIncome', () => {
  it('returns only incomes for the given month', () => {
    expect(calcMonthlyIncome(txs, '2026-06')).toBe(100000);
  });

  it('returns 0 when no incomes in the month', () => {
    expect(calcMonthlyIncome(txs, '2026-04')).toBe(0);
  });
});

describe('calcMonthlyExpenses', () => {
  it('returns only expenses for the given month', () => {
    expect(calcMonthlyExpenses(txs, '2026-06')).toBe(30000);
  });

  it('returns 0 when no expenses in the month', () => {
    expect(calcMonthlyExpenses(txs, '2026-04')).toBe(0);
  });
});

describe('calcMonthlySavings', () => {
  it('returns income minus expenses for the month', () => {
    expect(calcMonthlySavings(txs, '2026-06')).toBe(70000);
  });

  it('returns negative value when expenses exceed incomes in a month', () => {
    const data: Transaction[] = [
      { id: 'a', type: 'income', amount: 1000, description: 'x', date: '2026-03-01' },
      { id: 'b', type: 'expense', amount: 4000, description: 'y', date: '2026-03-02' },
    ];
    expect(calcMonthlySavings(data, '2026-03')).toBe(-3000);
  });
});

describe('getMonthKey', () => {
  it('extracts YYYY-MM from a date string', () => {
    expect(getMonthKey('2026-06-15')).toBe('2026-06');
  });
});

describe('getLastNMonthKeys', () => {
  it('returns the correct number of keys', () => {
    expect(getLastNMonthKeys(6)).toHaveLength(6);
  });

  it('returns keys in ascending order', () => {
    const keys = getLastNMonthKeys(3);
    expect(keys[0] < keys[1]).toBe(true);
    expect(keys[1] < keys[2]).toBe(true);
  });
});
