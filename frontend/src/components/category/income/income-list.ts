import {IncomeService} from "../../services/income-service";
import {CategoryIncomeType} from "../../../types/category-income.type";

//done
export class IncomeList {
    constructor() {
        this.getIncomes().then();
    }

    private async getIncomes(): Promise<void> {
        const response: CategoryIncomeType[] | undefined = await IncomeService.getIncomes();

        if (!response) {
            alert(response);
            window.location.href = '#/';
            return;
        }

        this.showRecords(response);
    }

    private showRecords(income: CategoryIncomeType[]): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (recordsElement) {
            recordsElement.innerHTML = ''; // Очистка существующих записей
        }

        for (let i: number = 0; i < income.length; i++) {
            const colElement: HTMLElement | null = document.createElement('div');
            colElement.className = 'col-12 col-lg-4 col-md-6';
            const borderElement: HTMLElement | null = document.createElement('div');
            borderElement.className = 'border p-3 rounded-3';
            const nameElement: HTMLElement | null = document.createElement('h4');
            nameElement.innerText = income[i].title;
            const iconsElement: HTMLElement | null = document.createElement('div');

            const editButton: HTMLElement | null = document.createElement('a');
            editButton.setAttribute('href', '#/income/edit?id=' + income[i].id);
            editButton.className = 'btn btn-primary me-2';
            editButton.innerText = 'Редактировать';

            const deleteButton: HTMLElement | null = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('data-id', income[i].id?.toString() ?? ''); // Задание data-id с id записи
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';

            deleteButton.addEventListener('click', () => {
                const deleteLink: HTMLElement | null = document.querySelector('#deleteModal a[href="#/income/delete"]');
                if (deleteLink) {
                    deleteLink.setAttribute('href', `#/income/delete?id=${income[i].id}`);
                }
            });

            colElement.appendChild(borderElement);
            borderElement.appendChild(nameElement);
            borderElement.appendChild(iconsElement);
            iconsElement.appendChild(editButton);
            iconsElement.appendChild(deleteButton);

            if (recordsElement) {
                recordsElement.appendChild(colElement);
            }
        }

        //добавление записи
        const addRecordElement: HTMLElement | null = document.createElement('div');
        addRecordElement.className = 'col-12 col-lg-4 col-md-6';
        const addLink: HTMLElement | null = document.createElement('a');
        addLink.setAttribute('href', '#/income/create');
        addLink.className = 'border p-5 rounded-3 d-flex justify-content-center align-items-center';
        const addIcon: HTMLElement | null = document.createElement('i');
        addIcon.className = 'fs-5 bi-plus-lg';

        addLink.appendChild(addIcon);
        addRecordElement.appendChild(addLink);
        if (recordsElement) {
            recordsElement.appendChild(addRecordElement);
        }

        //очистка при закрытии модального окна
        const deleteModal: HTMLElement | null = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.addEventListener('hidden.bs.modal', () => {
                const deleteLink = document.querySelector('#deleteModal a[href^="#/income/delete"]');
                if (deleteLink) deleteLink.setAttribute('href', '#/income/delete');
            });
        }
    }
}