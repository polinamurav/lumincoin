import {ExpenseService} from "../../services/expense-service";

export class ExpenseCreate {
    constructor() {
        document.getElementById('createButton').addEventListener('click', this.saveIncome.bind(this));

        this.titleInputElement = document.getElementById('titleInput');

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

    async saveIncome(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                title: this.titleInputElement.value,
            };

            const response = await ExpenseService.createExpense(createData);

            if (!response) {
                alert("Произошла ошибка");
            }

            return window.location.href = '#/income';
        }
    }
}