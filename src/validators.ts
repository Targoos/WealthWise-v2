import type { TransactionFormData, ValidationResult } from './types';

export function validateTransaction(data: TransactionFormData): ValidationResult {
  const errors: string[] = [];

  if (!data.type || (data.type !== 'income' && data.type !== 'expense')) {
    errors.push('El tipo debe ser ingreso o gasto.');
  }

  const parsedAmount = parseFloat(data.amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('El monto debe ser un número mayor a 0.');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('La descripción no puede estar vacía.');
  }

  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push('La fecha debe tener el formato AAAA-MM-DD.');
  }

  return { valid: errors.length === 0, errors };
}
