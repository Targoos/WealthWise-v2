import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Transaction } from './types';
import { calcMonthlyIncome, calcMonthlyExpenses, getLastNMonthKeys } from './finance';

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

let chartInstance: Chart | null = null;

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString('es-AR', { month: 'short', year: '2-digit' });
}

export function renderChart(transactions: Transaction[], canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  const monthKeys = getLastNMonthKeys(6);
  const labels = monthKeys.map(formatMonthLabel);
  const incomes = monthKeys.map((k) => calcMonthlyIncome(transactions, k));
  const expenses = monthKeys.map((k) => calcMonthlyExpenses(transactions, k));

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: incomes,
          backgroundColor: 'rgba(22, 163, 74, 0.75)',
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Gastos',
          data: expenses,
          backgroundColor: 'rgba(220, 38, 38, 0.75)',
          borderColor: 'rgba(220, 38, 38, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'system-ui', size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx: import('chart.js').TooltipItem<'bar'>) => {
              const value = ctx.parsed.y;
              if (value === null || value === undefined) return '';
              return ` ${value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: string | number) =>
              Number(value).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
            font: { size: 11 },
          },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
  });
}
