import {ExpenseService} from "../../services/expense-service";

export class ExpenseList {
    constructor() {
        this.getExpenses().then();
    }

    async getExpenses() {
        const response = await ExpenseService.getExpenses();

        if (!response) {
            alert(response);
            return window.location.href = '#/';
        }

        this.showRecords(response);
    }

    showRecords(expense) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        for (let i = 0; i < expense.length; i++) {
            const colElement = document.createElement('div');
            colElement.className = 'col-12 col-lg-4 col-md-6';
            const borderElement = document.createElement('div');
            borderElement.className = 'border p-3 rounded-3';
            const nameElement = document.createElement('h4');
            nameElement.innerText = expense[i].title;
            const iconsElement = document.createElement('div');

            const editButton = document.createElement('a');
            editButton.setAttribute('href', '#/expense/edit?id=' + expense[i].id);
            editButton.className = 'btn btn-primary me-2';
            editButton.innerText = 'Редактировать';

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('data-id', expense[i].id);
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';

            deleteButton.addEventListener('click', () => {
                const deleteLink = document.querySelector('#deleteModal a[href="#/expense/delete"]');
                deleteLink.setAttribute('href', `#/expense/delete?id=${expense[i].id}`);
            });

            colElement.appendChild(borderElement);
            borderElement.appendChild(nameElement);
            borderElement.appendChild(iconsElement);
            iconsElement.appendChild(editButton);
            iconsElement.appendChild(deleteButton);

            recordsElement.appendChild(colElement);
        }

        //добавление записи
        const addRecordElement = document.createElement('div');
        addRecordElement.className = 'col-12 col-lg-4 col-md-6';
        const addLink = document.createElement('a');
        addLink.setAttribute('href', '#/expense/create');
        addLink.className = 'border p-5 rounded-3 d-flex justify-content-center align-items-center';
        const addIcon = document.createElement('i');
        addIcon.className = 'fs-5 bi-plus-lg';

        addLink.appendChild(addIcon);
        addRecordElement.appendChild(addLink);
        recordsElement.appendChild(addRecordElement);

        //очистка при закрытии модального окна
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.addEventListener('hidden.bs.modal', () => {
            const deleteLink = document.querySelector('#deleteModal a[href^="#/expense/delete"]');
            deleteLink.setAttribute('href', '#/expense/delete');
        });

    }
}