import { Chart, registerables } from 'chart.js';
import {IncomeExpensesService} from "./services/income&expenses-service";
import {IncomeExpenseChartType} from "../types/income-expense-chart.type";
import { IncomeExpenseType } from '../types/income-expense.type';
import { ActionPeriodType } from '../types/action-period.type';

export class Main {
    private incomeChart: Chart<'pie', number[], string | undefined> | null;
    private expenseChart: Chart<'pie', number[], string | undefined> | null;

    constructor() {
        Chart.register(...registerables);

        this.incomeChart = null;
        this.expenseChart = null;

        this.buttonFilters();
        this.activeButton(ActionPeriodType.all);
        this.initializeChart();
    }

    private async initializeChart(): Promise<void> {
        const result: IncomeExpenseType[] | undefined = await this.getIncomeExpenses(ActionPeriodType.all);
        if (result) this.renderCharts(result);
    }

    private renderCharts(result: IncomeExpenseType[]): void {
        const incomeData = result.filter(item => item.type === 'income');
        const expenseData = result.filter(item => item.type === 'expense');

        const incomeLabels = incomeData.map(item => item.category);
        const incomeValues = incomeData.map(item => item.amount);

        const incomeChartData = {
            labels: incomeLabels,
            datasets: [{
                label: 'Доходы',
                data: incomeValues,
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                hoverOffset: 4
            }]
        };

        const myChart: HTMLCanvasElement | null = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx = myChart.getContext('2d');
        if (ctx) {
            this.incomeChart = new Chart(ctx, {
                type: 'pie',
                data: incomeChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }

        const expenseLabels = expenseData.map(item => item.category);
        const expenseValues = expenseData.map(item => item.amount);

        const expenseChartData = {
            labels: expenseLabels,
            datasets: [{
                label: 'Расходы',
                data: expenseValues,
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                hoverOffset: 4
            }]
        };

        const diagram2: HTMLCanvasElement | null = document.getElementById('diagram2') as HTMLCanvasElement;
        if (diagram2) {
            const ctx2 = diagram2.getContext('2d');
            if (ctx2) {
                this.expenseChart = new Chart(ctx2, {
                    type: 'pie',
                    data: expenseChartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' }
                        }
                    }
                });
            }
        }
    }

    async updateCharts(period: ActionPeriodType | string) {
        const result = await this.getIncomeExpenses(period);

        if (result === undefined) {
            alert('Произошла ошибка');
            return;
        } 
        const incomeData = result.filter(item => item.type === 'income');
        const expenseData = result.filter(item => item.type === 'expense');

        if (this.incomeChart) {
            this.incomeChart.data.labels = incomeData.map(item => item.category);
            this.incomeChart.data.datasets[0].data = incomeData.map(item => item.amount);
            this.incomeChart.update();
        }

        if (this.expenseChart) {
            this.expenseChart.data.labels = expenseData.map(item => item.category);
            this.expenseChart.data.datasets[0].data = expenseData.map(item => item.amount);
            this.expenseChart.update();
        }
    }

    buttonFilters() {
        document.querySelectorAll('button[data-period]').forEach(button => {
            button.addEventListener('click', () => {
                const period = button.getAttribute('data-period');
                if (period && Object.values(ActionPeriodType).includes(period as ActionPeriodType)) {
                    this.updateCharts(period as ActionPeriodType);
                    this.activeButton(period as ActionPeriodType);
                }
            });
        });

        const fromDateInput: HTMLInputElement | null = document.querySelector('input[name="dateFrom"]');
        const toDateInput: HTMLInputElement | null = document.querySelector('input[name="dateTo"]');
        const interval = document.querySelector('button[data-period="interval"]');
        if (interval && fromDateInput && toDateInput) {
            interval.addEventListener('click', () => {
                const dateFrom = fromDateInput.value || 'null';
                const dateTo = toDateInput.value || 'null';
                this.updateCharts(`interval&dateFrom=${dateFrom}&dateTo=${dateTo}`);
                this.activeButton(ActionPeriodType.interval);
            });
        }
    }

    activeButton(period: ActionPeriodType) {
        const buttons = document.querySelectorAll('button[data-period]');
        buttons.forEach(button => {
            button.classList.remove('btn-secondary');
        })

        const activeButton = document.querySelector(`button[data-period="${period}"]`);
        if (activeButton) {
            activeButton.classList.add('btn-secondary');
        }
    }

    async getIncomeExpenses(period: ActionPeriodType | string = ActionPeriodType.all) {
        const response: IncomeExpenseType[] | undefined = await IncomeExpensesService.getIncomeExpenses(period);

        if (!response) {
            alert('Произошла ошибка');
            window.location.href = '#/';
            return;
        }

        return response;
    }
}