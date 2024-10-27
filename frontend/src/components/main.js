import { Chart, registerables } from 'chart.js';
import {IncomeExpensesService} from "./services/income&expenses-service";

export class Main {
    constructor() {
        Chart.register(...registerables);

        this.buttonFilters();
        this.activeButton('today');
        this.initializeChart();
    }

    async initializeChart() {
        const result = await this.getIncomeExpenses('all');

        // фильтр на доходы и расходы
        const incomeData = result.filter(item => item.type === 'income');
        const expenseData = result.filter(item => item.type === 'expense');

        const incomeLabels = incomeData.map(item => item.category);
        const incomeValues = incomeData.map(item => item.amount);

        const incomeChartData = {
            labels: incomeLabels,
            datasets: [{
                label: 'Доходы',
                data: incomeValues,
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD',
                ],
                hoverOffset: 4
            }]
        };

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: incomeChartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
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
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD',
                ],
                hoverOffset: 4
            }]
        };

        const ctx2 = document.getElementById('diagram2').getContext('2d');
        new Chart(ctx2, {
            type: 'pie',
            data: expenseChartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });

    }

    buttonFilters() {
        document.querySelector('button[data-period="today"]').addEventListener('click', () => {
            this.getIncomeExpenses('all');
            this.activeButton('today');
        });

        document.querySelector('button[data-period="all"]').addEventListener('click', () => {
            this.getIncomeExpenses('all');
            this.activeButton('all');
        });

        document.querySelector('button[data-period="week"]').addEventListener('click', () => {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            this.getIncomeExpenses('interval', lastWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]);
            this.activeButton('week');
        });
        document.querySelector('button[data-period="month"]').addEventListener('click', () => {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);
            this.getIncomeExpenses('interval', lastMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
            this.activeButton('month');
        });
        document.querySelector('button[data-period="year"]').addEventListener('click', () => {
            const today = new Date();
            const lastYear = new Date();
            lastYear.setFullYear(today.getFullYear() - 1);
            this.getIncomeExpenses('interval', lastYear.toISOString().split('T')[0], today.toISOString().split('T')[0]);
            this.activeButton('year');
        });

        const fromDateInput = document.querySelector('input[name="dateFrom"]');
        const toDateInput = document.querySelector('input[name="dateTo"]');
        document.querySelector('button[data-period="interval"]').addEventListener('click', () => {
            const dateFrom = fromDateInput.value || 'null';
            const dateTo = toDateInput.value || 'null';
            this.getIncomeExpenses('interval', dateFrom, dateTo);
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

    async getIncomeExpenses(period = 'all', dateFrom = 'null', dateTo = 'null') {
        const response = await IncomeExpensesService.getIncomeExpenses(period, dateFrom, dateTo);

        if (!response) {
            alert('Произошла ошибка');
            return window.location.href = '#/';
        }

        return response;
    }

}
