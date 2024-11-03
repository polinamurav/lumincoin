import {IncomeExpensesService} from "../services/income&expenses-service";
import {UrlUtils} from "../services/url-utils";
import {IncomeService} from "../services/income-service";
import {ExpenseService} from "../services/expense-service";

export class IncomeExpensesCreate {
    constructor() {
        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            window.location.href = '/#';
        }

        document.getElementById('createButton').addEventListener('click', this.saveIncomeExpenses.bind(this));

        this.typeInputElement = document.getElementById('typeInput');
        this.categoryInputElement = document.getElementById('categoryInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');

        if (type && (type === 'income' || type === 'expense')) {
            this.typeInputElement.value = type;
            if (type === 'income') {
                this.getIncomes().then();
            } else if (type === 'expense') {
                this.getExpenses().then();
            }
        }
    }

    async getIncomes() {
        const response = await IncomeService.getIncomes();

        if (!response) {
            alert(response);
            return window.location.href = '#/';
        }

        this.showOptions(response);
    }

    async getExpenses() {
        const response = await ExpenseService.getExpenses();

        if (!response) {
            alert(response);
            return window.location.href = '#/';
        }

        this.showOptions(response);
    }

    showOptions(result) {
        this.categoryInputElement.innerHTML = '';

        for (let i = 0; i < result.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.value = result[i].id;
            optionElement.textContent = result[i].title;

            this.categoryInputElement.appendChild(optionElement);
        }
    }

    validateForm() {
        let isValid = true;
        let textInputArray = [this.typeInputElement, this.categoryInputElement, this.amountInputElement,
            this.dateInputElement, this.commentInputElement];
        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }


    async saveIncomeExpenses(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                type: this.typeInputElement.value,
                category_id: parseInt(this.categoryInputElement.value),
                amount: parseFloat(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
            };

            const response = await IncomeExpensesService.createIncomeExpenses(createData);

            if (!response) {
                alert("Произошла ошибка");
            }

            return window.location.href = '#/income&expenses';
        }
    }
}