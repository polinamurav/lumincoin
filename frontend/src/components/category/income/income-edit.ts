import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../services/url-utils";

export class IncomeEdit {
    constructor() {
        document.getElementById('updateButton').addEventListener('click', this.updateIncome.bind(this));

        this.titleInputElement = document.getElementById('titleInput');

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.getIncome(id).then();
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

    async getIncome(id) {
        const response = await IncomeService.getIncome(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
        }

        this.incomeOriginalData = response;
        this.titleInputElement.value = response.title;
    }

    async updateIncome(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            if (this.titleInputElement.value !== this.incomeOriginalData.title) {
                changedData.title = this.titleInputElement.value;
            }
            if (Object.keys(changedData).length > 0) {
                const response = await IncomeService.updateIncome(this.incomeOriginalData.id, changedData);

                if (!response) {
                    alert("Произошла ошибка");
                }

                return window.location.href = '#/income';
            }
        }
        return window.location.href = '#/income';
    }
}