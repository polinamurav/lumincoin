import {IncomeExpensesService} from "../services/income&expenses-service";

export class IncomeExpensesList {
    constructor() {
        this.buttonFilters();
        this.getIncomeExpenses('all').then();
        this.activeButton('today');
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

        this.showRecords(response);
    }

    showRecords(incomeExpenses) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        for (let i = 0; i < incomeExpenses.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerText = incomeExpenses[i].type;
            trElement.insertCell().innerText = incomeExpenses[i].category;
            trElement.insertCell().innerText = incomeExpenses[i].amount;
            trElement.insertCell().innerText = incomeExpenses[i].date;
            trElement.insertCell().innerText = incomeExpenses[i].comment;
            trElement.insertCell().innerHTML = '<a href="#/income&expenses/delete?id=' + incomeExpenses[i].id + '" class="btn border-0 p-0 me-2">' +
                '<i class="bi bi-trash me-2"></i></a>' +
                '<a href="#/income&expenses/edit?id=' + incomeExpenses[i].id + '" class="btn border-0 p-0 me-2">' +
                '<i class="bi bi-pencil"></i></a>';

            recordsElement.appendChild(trElement);
        }

    }
}