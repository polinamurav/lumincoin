import {UrlUtils} from "../../services/url-utils";
import {ExpenseService} from "../../services/expense-service";

export class ExpenseEdit {
    constructor() {
        document.getElementById('updateButton').addEventListener('click', this.updateExpense.bind(this));

        this.titleInputElement = document.getElementById('titleInput');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.getExpense(id).then();
    }

    validateForm() {
        let isValid = true;
        if (this.titleInputElement.value) {
            this.titleInputElement.classList.remove('is-invalid');
        } else {
            this.titleInputElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async getExpense(id) {
        const response = await ExpenseService.getExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
        }

        this.expenseOriginalData = response;
        this.titleInputElement.value = response.title;
    }

    async updateExpense(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            if (this.titleInputElement.value !== this.expenseOriginalData.title) {
                changedData.title = this.titleInputElement.value;
            }
            if (Object.keys(changedData).length > 0) {
                const response = await ExpenseService.updateExpense(this.expenseOriginalData.id, changedData);

                if (!response) {
                    alert("Произошла ошибка");
                }

                return window.location.href = '#/expense';
            }
        }
        return window.location.href = '#/expense';
    }
}