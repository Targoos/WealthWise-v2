import { describe, it, expect } from 'vitest';
import { validateTransaction } from '../validators';

describe('validateTransaction', () => {
  const valid = {
    type: 'income',
    amount: '1000',
    description: 'Sueldo',
    date: '2026-06-01',
  };

  it('returns valid for correct data', () => {
    expect(validateTransaction(valid).valid).toBe(true);
    expect(validateTransaction(valid).errors).toHaveLength(0);
  });

  it('fails when type is empty', () => {
    const result = validateTransaction({ ...valid, type: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('tipo'))).toBe(true);
  });

  it('fails when type is invalid string', () => {
    const result = validateTransaction({ ...valid, type: 'other' });
    expect(result.valid).toBe(false);
  });

  it('accepts expense as valid type', () => {
    expect(validateTransaction({ ...valid, type: 'expense' }).valid).toBe(true);
  });

  it('fails when amount is 0', () => {
    const result = validateTransaction({ ...valid, amount: '0' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('monto'))).toBe(true);
  });

  it('fails when amount is negative', () => {
    const result = validateTransaction({ ...valid, amount: '-100' });
    expect(result.valid).toBe(false);
  });

  it('fails when amount is not a number', () => {
    const result = validateTransaction({ ...valid, amount: 'abc' });
    expect(result.valid).toBe(false);
  });

  it('fails when description is empty', () => {
    const result = validateTransaction({ ...valid, description: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('descripción'))).toBe(true);
  });

  it('fails when date is empty', () => {
    const result = validateTransaction({ ...valid, date: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('fecha'))).toBe(true);
  });

  it('fails when date has wrong format', () => {
    const result = validateTransaction({ ...valid, date: '01/06/2026' });
    expect(result.valid).toBe(false);
  });

  it('accumulates multiple errors', () => {
    const result = validateTransaction({ type: '', amount: '0', description: '', date: '' });
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
