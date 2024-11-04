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
        const todayButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>('button[data-period="today"]');
        const allButton: HTMLButtonElement  = document.querySelector<HTMLButtonElement>('button[data-period="all"]');
        const weekButton: HTMLButtonElement  = document.querySelector<HTMLButtonElement>('button[data-period="week"]');
        const monthButton: HTMLButtonElement  = document.querySelector<HTMLButtonElement>('button[data-period="month"]');
        const yearButton: HTMLButtonElement  = document.querySelector<HTMLButtonElement>('button[data-period="year"]');
        const fromDateInput: HTMLInputElement | null  = document.querySelector<HTMLInputElement>('input[name="dateFrom"]');
        const toDateInput: HTMLInputElement | null  = document.querySelector<HTMLInputElement>('input[name="dateTo"]');
        const intervalButton: HTMLButtonElement  = document.querySelector<HTMLButtonElement>('button[data-period="interval"]');

        if (todayButton) {
            todayButton.addEventListener('click', () => {
                this.getIncomeExpenses('today');
                this.activeButton('today');
            });
        }

        if (allButton) {
            allButton.addEventListener('click', () => {
                this.getIncomeExpenses('all');
                this.activeButton('all');
            });
        }

        if (weekButton) {
            weekButton.addEventListener('click', () => {
                this.getIncomeExpenses('week');
                this.activeButton('week');
            });
        }

        if (monthButton) {
            monthButton.addEventListener('click', () => {
                this.getIncomeExpenses('month');
                this.activeButton('month');
            });
        }

        if (yearButton) {
            yearButton.addEventListener('click', () => {
                this.getIncomeExpenses('year');
                this.activeButton('year');
            });
        }

        if (intervalButton) {
            intervalButton.addEventListener('click', () => {
                const dateFrom: string = fromDateInput ? fromDateInput.value : 'null';
                const dateTo: string = toDateInput ? toDateInput.value : 'null';
                this.getIncomeExpenses(`interval&dateFrom=${dateFrom}&dateTo=${dateTo}`);
                this.activeButton('interval');
            });
        }
    }

    private createButtons(): void {
        document.querySelectorAll('.create-button').forEach(button => {
            button.addEventListener('click', (e: Event): void => {
                const target: HTMLElement | null = e.currentTarget as HTMLElement;
                const type: string | null = target.getAttribute('data-type');
                this.createOperation(type, '#/income&expenses/create');
            })
        })
    }

    private createOperation(type: string, link: string): void {
        window.location.href = `${link}?type=${type}`;
    }

    private activeButton(period: string): void {
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
        const response: IncomeExpenseType[] | void = await IncomeExpensesService.getIncomeExpenses(period);

        if (!response) {
            alert('Произошла ошибка');
            window.location.href = '#/';
            return;
        }

        this.showRecords(response as IncomeExpenseType);
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
                const deleteLink: HTMLElement | null = document.querySelector('#dateRangeModal a[href="#/income&expenses/delete"]');
                if (deleteLink){
                    deleteLink.setAttribute('href', `#/income&expenses/delete?id=${incomeExpenses[i].id}`);
                }
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
                const deleteLink: HTMLElement | null = document.querySelector('#dateRangeModal a[href^="#/income&expenses/delete"]');
                if (deleteLink) {
                    deleteLink.setAttribute('href', '#/income&expenses/delete');
                }
            });
        }
    }
}