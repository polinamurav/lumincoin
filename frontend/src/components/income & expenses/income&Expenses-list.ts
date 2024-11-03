import {IncomeExpensesService} from "../services/income&expenses-service";
import {IncomeExpenseType} from "../../types/income-expense.type";

//done
export class IncomeExpensesList {
    constructor() {
        this.buttonFilters();
        this.createButtons();
        this.getIncomeExpenses('all').then();
        this.activeButton('all');
    }

    private buttonFilters(): void {
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

        const fromDateInput: HTMLInputElement | null = document.querySelector('input[name="dateFrom"]');
        const toDateInput: HTMLInputElement | null = document.querySelector('input[name="dateTo"]');
        document.querySelector('button[data-period="interval"]').addEventListener('click', () => {
            const dateFrom = (fromDateInput as HTMLInputElement).value || 'null';
            const dateTo = (toDateInput as HTMLInputElement).value || 'null';
            this.getIncomeExpenses('interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
            this.activeButton('interval');
        });
    }

    private createButtons(): void {
        document.querySelectorAll('.create-button').forEach(button => {
            button.addEventListener('click', (e: Event): void => {
                const target = e.currentTarget as HTMLElement;
                const type: string = target.getAttribute('data-type');
                this.createOperation(type, '#/income&expenses/create');
            })
        })
    }

    private createOperation(type, link): void {
        window.location.href = `${link}?type=${type}`;
    }

    private activeButton(period): void {
        const buttons: NodeListOf<Element> = document.querySelectorAll('button[data-period]');
        buttons.forEach(button => {
            button.classList.remove('btn-secondary');
        })

        const activeButton: HTMLElement | null = document.querySelector(`button[data-period="${period}"]`);
        if (activeButton) {
            activeButton.classList.add('btn-secondary');
        }
    }

    private async getIncomeExpenses(period: string = 'all'): Promise<void> {
        const response: IncomeExpenseType[] = await IncomeExpensesService.getIncomeExpenses(period);

        if (!response) {
            alert('Произошла ошибка');
            window.location.href = '#/';
            return;
        }

        this.showRecords(response);
    }

    private showRecords(incomeExpenses): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (recordsElement) {
            recordsElement.innerHTML = '';
        }

        for (let i: number = 0; i < incomeExpenses.length; i++) {
            const trElement: HTMLTableRowElement | null = document.createElement('tr');
            trElement.insertCell().innerText = i.toString() + 1;

            const typeCell: HTMLElement | null = trElement.insertCell();
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

            const actionCell: HTMLElement | null = trElement.insertCell();
            const deleteButton: HTMLButtonElement = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn border-0 p-0 me-2';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#dateRangeModal');
            deleteButton.innerHTML = '<i class="bi bi-trash me-2"></i>';

            deleteButton.addEventListener('click', () => {
                const deleteLink: Element = document.querySelector('#dateRangeModal a[href="#/income&expenses/delete"]');
                deleteLink.setAttribute('href', `#/income&expenses/delete?id=${incomeExpenses[i].id}`);
            });

            const editLink: HTMLAnchorElement = document.createElement('a');
            editLink.href = `#/income&expenses/edit?id=${incomeExpenses[i].id}`;
            editLink.className = 'btn border-0 p-0';
            editLink.innerHTML = '<i class="bi bi-pencil"></i>';
            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editLink);

            if (recordsElement) {
                recordsElement.appendChild(trElement);
            }
        }

        const deleteModal: HTMLElement | null = document.getElementById('dateRangeModal');
        if (deleteModal) {
            deleteModal.addEventListener('hidden.bs.modal', () => {
                const deleteLink = document.querySelector('#dateRangeModal a[href^="#/income&expenses/delete"]');
                deleteLink.setAttribute('href', '#/income&expenses/delete');
            });
        }
    }
}