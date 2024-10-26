import {IncomeService} from "../../services/income-service";

export class IncomeList {
    constructor() {
        this.getIncomes().then();
    }

    async getIncomes() {
        const response = await IncomeService.getIncomes();

        if (!response) {
            alert(response);
            return window.location.href = '#/';
        }

        this.showRecords(response);
    }

    showRecords(income) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = ''; // Очистка существующих записей

        for (let i = 0; i < income.length; i++) {
            const colElement = document.createElement('div');
            colElement.className = 'col-12 col-lg-4 col-md-6';
            const borderElement = document.createElement('div');
            borderElement.className = 'border p-3 rounded-3';
            const nameElement = document.createElement('h4');
            nameElement.innerText = income[i].title;
            const iconsElement = document.createElement('div');

            const editButton = document.createElement('a');
            editButton.setAttribute('href', '#/income/edit?id=' + income[i].id);
            editButton.className = 'btn btn-primary me-2';
            editButton.innerText = 'Редактировать';

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('data-id', income[i].id); // Задание data-id с id записи
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';

            deleteButton.addEventListener('click', () => {
                const deleteLink = document.querySelector('#deleteModal a[href="#/income/delete"]');
                deleteLink.setAttribute('href', `#/income/delete?id=${income[i].id}`);
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
        addLink.setAttribute('href', '#/income/create');
        addLink.className = 'border p-5 rounded-3 d-flex justify-content-center align-items-center';
        const addIcon = document.createElement('i');
        addIcon.className = 'fs-5 bi-plus-lg';

        addLink.appendChild(addIcon);
        addRecordElement.appendChild(addLink);
        recordsElement.appendChild(addRecordElement);

        //очистка при закрытии модального окна
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.addEventListener('hidden.bs.modal', () => {
            const deleteLink = document.querySelector('#deleteModal a[href^="#/income/delete"]');
            deleteLink.setAttribute('href', '#/income/delete');
        });

    }
}