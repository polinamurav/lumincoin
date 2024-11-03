import {IncomeExpensesService} from "../services/income&expenses-service";

export class IncomeExpensesList {
    constructor() {
        this.buttonFilters();
        this.createButtons();
        this.getIncomeExpenses('all').then();
        this.activeButton('all');
    }

    buttonFilters() {
        document.querySelector('button[data-period="today"]').addEventListener('click', () => {
            this.getIncomeExpenses('today');
            this.activeButton('today');
        });

        document.querySelector('button[data-period="all"]').addEventListener('click', () => {
            this.getIncomeExpenses('all');
            this.activeButton('all');
        });

        document.querySelector('button[data-period="week"]').addEventListener('click', () => {
            this.getIncomeExpenses('week');
            this.activeButton('week');
        });
        document.querySelector('button[data-period="month"]').addEventListener('click', () => {
            this.getIncomeExpenses('month');
            this.activeButton('month');
        });
        document.querySelector('button[data-period="year"]').addEventListener('click', () => {
            this.getIncomeExpenses('year');
            this.activeButton('year');
        });

        const fromDateInput = document.querySelector('input[name="dateFrom"]');
        const toDateInput = document.querySelector('input[name="dateTo"]');
        document.querySelector('button[data-period="interval"]').addEventListener('click', () => {
            const dateFrom = fromDateInput.value || 'null';
            const dateTo = toDateInput.value || 'null';
            this.getIncomeExpenses('interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
            this.activeButton('interval');
        });
    }

    createButtons() {
        document.querySelectorAll('.create-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-type');
                this.createOperation(type, '#/income&expenses/create');
            })
        })
    }

    createOperation(type, link) {
        window.location.href = `${link}?type=${type}`;
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

        this.showRecords(response);
    }

    showRecords(incomeExpenses) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        for (let i = 0; i < incomeExpenses.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;

            const typeCell = trElement.insertCell();
            if (incomeExpenses[i].type === 'expense') {
                typeCell.innerText = 'расход';
                typeCell.className = 'text-danger';
            } else if (incomeExpenses[i].type === 'income') {
                typeCell.innerText = 'доход';
                typeCell.className = 'text-success';
            }
            trElement.insertCell().innerText = incomeExpenses[i].category;
            trElement.insertCell().innerText = incomeExpenses[i].amount;
            trElement.insertCell().innerText = incomeExpenses[i].date;
            trElement.insertCell().innerText = incomeExpenses[i].comment;
            // trElement.insertCell().innerHTML = '<a href="#/income&expenses/delete?id=' + incomeExpenses[i].id + '" class="btn border-0 p-0 me-2">' +
            //     '<i class="bi bi-trash me-2"></i></a>' +
            //     '<a href="#/income&expenses/edit?id=' + incomeExpenses[i].id + '" class="btn border-0 p-0 me-2">' +
            //     '<i class="bi bi-pencil"></i></a>';

            const actionCell = trElement.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn border-0 p-0 me-2';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#dateRangeModal');
            deleteButton.innerHTML = '<i class="bi bi-trash me-2"></i>';

            deleteButton.addEventListener('click', () => {
                const deleteLink = document.querySelector('#dateRangeModal a[href="#/income&expenses/delete"]');
                deleteLink.setAttribute('href', `#/income&expenses/delete?id=${incomeExpenses[i].id}`);
            });

            const editLink = document.createElement('a');
            editLink.href = `#/income&expenses/edit?id=${incomeExpenses[i].id}`;
            editLink.className = 'btn border-0 p-0';
            editLink.innerHTML = '<i class="bi bi-pencil"></i>';
            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editLink);

            recordsElement.appendChild(trElement);
        }

        const deleteModal = document.getElementById('dateRangeModal');
        deleteModal.addEventListener('hidden.bs.modal', () => {
            const deleteLink = document.querySelector('#dateRangeModal a[href^="#/income&expenses/delete"]');
            deleteLink.setAttribute('href', '#/income&expenses/delete');
        });

    }
}