import {IncomeExpensesService} from "../services/income&expenses-service";

export class IncomeExpensesCreate {
    constructor() {
        document.getElementById('createButton').addEventListener('click', this.saveIncomeExpenses.bind(this));

        this.typeInputElement = document.getElementById('typeInput');
        this.categoryInputElement = document.getElementById('categoryInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');

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