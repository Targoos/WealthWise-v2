import type { Transaction, Summary } from './types';

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function showError(fieldId: string, message: string): void {
  const field = document.getElementById(fieldId);
  if (!field) return;
  let errorEl = field.parentElement?.querySelector<HTMLSpanElement>('.form__error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form__error';
    field.parentElement?.appendChild(errorEl);
  }
  errorEl.textContent = message;
  field.classList.add('form__input--error');
}

export function clearAllErrors(): void {
  document.querySelectorAll('.form__error').forEach((el) => ((el as HTMLElement).textContent = ''));
  document
    .querySelectorAll('.form__input--error')
    .forEach((el) => el.classList.remove('form__input--error'));
}

export function buildTransactionItem(transaction: Transaction): HTMLLIElement {
  const li = document.createElement('li');
  li.className = `transaction transaction--${transaction.type}`;
  li.dataset['id'] = transaction.id;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'transaction__info';

  const descSpan = document.createElement('span');
  descSpan.className = 'transaction__description';
  descSpan.textContent = transaction.description;

  const dateSpan = document.createElement('span');
  dateSpan.className = 'transaction__date';
  dateSpan.textContent = formatDate(transaction.date);

  infoDiv.appendChild(descSpan);
  infoDiv.appendChild(dateSpan);

  const amountSpan = document.createElement('span');
  amountSpan.className = 'transaction__amount';
  const sign = transaction.type === 'income' ? '+' : '-';
  amountSpan.textContent = `${sign} ${formatCurrency(transaction.amount)}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'transaction__delete';
  deleteBtn.type = 'button';
  deleteBtn.setAttribute('aria-label', `Eliminar ${transaction.description}`);
  deleteBtn.textContent = '✕';

  li.appendChild(infoDiv);
  li.appendChild(amountSpan);
  li.appendChild(deleteBtn);

  return li;
}

export function renderTransactionList(transactions: Transaction[], listEl: HTMLUListElement): void {
  listEl.textContent = '';

  if (transactions.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'transaction-list__empty';
    empty.textContent = 'No hay transacciones registradas.';
    listEl.appendChild(empty);
    return;
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  sorted.forEach((t) => listEl.appendChild(buildTransactionItem(t)));
}

export function renderSummary(summary: Summary): void {
  const setEl = (id: string, value: number): void => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatCurrency(value);
  };

  const balanceEl = document.getElementById('summary-balance');
  if (balanceEl) {
    balanceEl.textContent = formatCurrency(summary.balance);
    balanceEl.className = 'summary__value';
    balanceEl.classList.add(
      summary.balance >= 0 ? 'summary__value--positive' : 'summary__value--negative'
    );
  }

  setEl('summary-income', summary.monthlyIncome);
  setEl('summary-expenses', summary.monthlyExpenses);

  const savingsEl = document.getElementById('summary-savings');
  if (savingsEl) {
    savingsEl.textContent = formatCurrency(summary.monthlySavings);
    savingsEl.className = 'summary__value';
    savingsEl.classList.add(
      summary.monthlySavings >= 0 ? 'summary__value--positive' : 'summary__value--negative'
    );
  }
}
