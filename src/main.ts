import { getTransactions, saveTransactions, clearTransactions } from './storage';
import {
  calcBalance,
  calcMonthlyIncome,
  calcMonthlyExpenses,
  calcMonthlySavings,
  getCurrentMonthKey,
} from './finance';
import { renderTransactionList, renderSummary, showError, clearAllErrors } from './ui';
import { validateTransaction } from './validators';
import { renderChart } from './chart';
import type { Transaction, TransactionFormData } from './types';

const form = document.getElementById('transaction-form') as HTMLFormElement;
const transactionList = document.getElementById('transaction-list') as HTMLUListElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const resetModal = document.getElementById('reset-modal') as HTMLDivElement;
const resetConfirmBtn = document.getElementById('reset-confirm') as HTMLButtonElement;
const resetCancelBtn = document.getElementById('reset-cancel') as HTMLButtonElement;
const monthFilter = document.getElementById('month-filter') as HTMLSelectElement;

function buildMonthOptions(): void {
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
    const option = document.createElement('option');
    option.value = key;
    option.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    if (i === 0) option.selected = true;
    monthFilter.appendChild(option);
  }
}

function getActiveMonthKey(): string {
  return monthFilter.value || getCurrentMonthKey();
}

function refreshUI(): void {
  const transactions = getTransactions();
  const monthKey = getActiveMonthKey();

  renderTransactionList(
    transactions.filter((t) => t.date.startsWith(monthKey)),
    transactionList
  );

  renderSummary({
    balance: calcBalance(transactions),
    monthlyIncome: calcMonthlyIncome(transactions, monthKey),
    monthlyExpenses: calcMonthlyExpenses(transactions, monthKey),
    monthlySavings: calcMonthlySavings(transactions, monthKey),
  });

  renderChart(transactions, 'monthly-chart');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function handleFormSubmit(event: Event): void {
  event.preventDefault();
  clearAllErrors();

  const formData: TransactionFormData = {
    type: (document.getElementById('type') as HTMLSelectElement).value,
    amount: (document.getElementById('amount') as HTMLInputElement).value,
    description: (document.getElementById('description') as HTMLInputElement).value,
    date: (document.getElementById('date') as HTMLInputElement).value,
  };

  const { valid, errors } = validateTransaction(formData);

  if (!valid) {
    errors.forEach((msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('tipo')) showError('type', msg);
      else if (lower.includes('monto')) showError('amount', msg);
      else if (lower.includes('descripción')) showError('description', msg);
      else if (lower.includes('fecha')) showError('date', msg);
    });
    return;
  }

  const transaction: Transaction = {
    id: generateId(),
    type: formData.type as Transaction['type'],
    amount: parseFloat(formData.amount),
    description: formData.description.trim(),
    date: formData.date,
  };

  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);

  form.reset();
  setDefaultDate();
  refreshUI();
}

function handleDeleteTransaction(event: Event): void {
  const target = event.target as HTMLElement;
  const deleteBtn = target.closest('.transaction__delete');
  if (!deleteBtn) return;

  const li = deleteBtn.closest<HTMLLIElement>('.transaction');
  if (!li?.dataset['id']) return;

  const transactions = getTransactions().filter((t) => t.id !== li.dataset['id']);
  saveTransactions(transactions);
  refreshUI();
}

function openResetModal(): void {
  resetModal.classList.add('modal--open');
  resetModal.setAttribute('aria-hidden', 'false');
}

function closeResetModal(): void {
  resetModal.classList.remove('modal--open');
  resetModal.setAttribute('aria-hidden', 'true');
}

function handleResetConfirm(): void {
  clearTransactions();
  closeResetModal();
  refreshUI();
}

function setDefaultDate(): void {
  const dateInput = document.getElementById('date') as HTMLInputElement | null;
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
}

function init(): void {
  buildMonthOptions();
  setDefaultDate();
  refreshUI();

  form.addEventListener('submit', handleFormSubmit);
  transactionList.addEventListener('click', handleDeleteTransaction);
  resetBtn.addEventListener('click', openResetModal);
  resetConfirmBtn.addEventListener('click', handleResetConfirm);
  resetCancelBtn.addEventListener('click', closeResetModal);
  monthFilter.addEventListener('change', refreshUI);

  resetModal.addEventListener('click', (e: Event) => {
    if (e.target === resetModal) closeResetModal();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeResetModal();
  });
}

init();
