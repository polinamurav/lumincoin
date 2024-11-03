import { Chart, registerables } from 'chart.js';
import {IncomeExpensesService} from "./services/income&expenses-service";

export class Main {
    constructor() {
        Chart.register(...registerables);

        this.incomeChart = null;
        this.expenseChart = null;

        this.buttonFilters();
        this.activeButton('all');
        this.initializeChart();
    }

    async initializeChart() {
        const result = await this.getIncomeExpenses('all');
        this.renderCharts(result);
    }

    renderCharts(result) {
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

        const ctx = document.getElementById('myChart').getContext('2d');
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

        const ctx2 = document.getElementById('diagram2').getContext('2d');
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

    async updateCharts(period) {
        const result = await this.getIncomeExpenses(period);

        const incomeData = result.filter(item => item.type === 'income');
        const expenseData = result.filter(item => item.type === 'expense');

        this.incomeChart.data.labels = incomeData.map(item => item.category);
        this.incomeChart.data.datasets[0].data = incomeData.map(item => item.amount);
        this.incomeChart.update();

        this.expenseChart.data.labels = expenseData.map(item => item.category);
        this.expenseChart.data.datasets[0].data = expenseData.map(item => item.amount);
        this.expenseChart.update();
    }

    buttonFilters() {
        document.querySelectorAll('button[data-period]').forEach(button => {
            button.addEventListener('click', () => {
                const period = button.getAttribute('data-period');
                this.updateCharts(period);
                this.activeButton(period);
            });
        });

        const fromDateInput = document.querySelector('input[name="dateFrom"]');
        const toDateInput = document.querySelector('input[name="dateTo"]');
        document.querySelector('button[data-period="interval"]').addEventListener('click', () => {
            const dateFrom = fromDateInput.value || 'null';
            const dateTo = toDateInput.value || 'null';
            this.updateCharts(`interval&dateFrom=${dateFrom}&dateTo=${dateTo}`);
            this.activeButton('interval');
        });
    }

    activeButton(period) {
        const buttons = document.querySelectorAll('button[data-period]');
        buttons.forEach(button => {
            button.classList.remove('btn-secondary');
        })

        const activeButton = document.querySelector(`button[data-period="${period}"]`);
        if (activeButton) {
            activeButton.classList.add('btn-secondary');
        }
    }

    async getIncomeExpenses(period = 'all') {
        const response = await IncomeExpensesService.getIncomeExpenses(period);

        if (!response) {
            alert('Произошла ошибка');
            return window.location.href = '#/';
        }

        return response;
    }
}