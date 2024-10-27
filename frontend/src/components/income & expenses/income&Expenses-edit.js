import {UrlUtils} from "../services/url-utils";
import {ExpenseService} from "../services/expense-service";
import {IncomeExpensesService} from "../services/income&expenses-service";
import {IncomeService} from "../services/income-service";

export class IncomeExpensesEdit {
    constructor() {
        document.getElementById('updateButton').addEventListener('click', this.updateIncomeExpense.bind(this));

        this.typeInputElement = document.getElementById('typeInput');
        this.categoryInputElement = document.getElementById('categoryInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.getIncomeExpense(id).then();
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

    async getIncomeExpense(id) {
        const response = await IncomeExpensesService.getIncomeExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
        }

        this.incomeExpenseOriginalData = response;
        this.showIncomeExpenses(response);
    }

    showIncomeExpenses(incomeExpense) {
        this.typeInputElement.value = incomeExpense.type;
        // this.categoryInputElement.textContent = incomeExpense.category;
        this.amountInputElement.value = incomeExpense.amount;
        this.dateInputElement.value = incomeExpense.date;
        this.commentInputElement.value = incomeExpense.comment;
        if (incomeExpense.type === 'income') {
            this.getIncomes().then();
        } else if (incomeExpense.type === 'expense') {
            this.getExpenses().then();
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

        const currentCategory = result.find(cat => cat.title === this.incomeExpenseOriginalData.category);
        if (currentCategory) {
            const optionElement = document.createElement('option');
            optionElement.value = currentCategory.id;
            optionElement.textContent = currentCategory.title;
            this.categoryInputElement.appendChild(optionElement);

            //обновляем список с уже id
            this.incomeExpenseOriginalData.category_id = currentCategory.id;
        }

        for (let i = 0; i < result.length; i++) {
            if (result[i].id !== this.incomeExpenseOriginalData.category_id) {
                const optionElement = document.createElement('option');
                optionElement.value = result[i].id;
                optionElement.textContent = result[i].title;
                this.categoryInputElement.appendChild(optionElement);
            }
        }
    }

    async updateIncomeExpense(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            if (this.typeInputElement.value !== this.incomeExpenseOriginalData.type) {
                changedData.type = this.typeInputElement.value;
            }
            if (parseInt(this.categoryInputElement.value) !== parseInt(this.incomeExpenseOriginalData.category_id)) {
                changedData.category_id = parseInt(this.categoryInputElement.value);
            }
            if (parseFloat(this.amountInputElement.value) !== parseFloat(this.incomeExpenseOriginalData.amount)) {
                changedData.amount = parseFloat(this.amountInputElement.value);
            }
            if (this.dateInputElement.value !== this.incomeExpenseOriginalData.date) {
                changedData.date = this.dateInputElement.value;
            }
            if (this.commentInputElement.value !== this.incomeExpenseOriginalData.comment) {
                changedData.comment = this.commentInputElement.value;
            }
            if (Object.keys(changedData).length > 0) {
                const response = await IncomeExpensesService.updateIncomeExpense(this.incomeExpenseOriginalData.id, changedData);

                if (!response) {
                    alert("Произошла ошибка");
                }

                return window.location.href = '#/income&expenses';
            }
        }
        return window.location.href = '#/income&expenses';
    }
}