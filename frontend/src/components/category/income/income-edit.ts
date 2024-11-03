import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../services/url-utils";
import {CategoryIncomeType} from "../../../types/category-income.type";
import {ExpenseService} from "../../services/expense-service";

//done
export class IncomeEdit {
    readonly titleInputElement: HTMLInputElement | null;
    private incomeOriginalData: CategoryIncomeType | null;

    constructor() {
        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if (updateButton) {
            updateButton.addEventListener('click', this.updateIncome.bind(this));
        }

        this.titleInputElement = document.getElementById('titleInput') as HTMLInputElement;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.getIncome(id).then();
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.titleInputElement) {
            if (this.titleInputElement.value) {
                this.titleInputElement.classList.remove('is-invalid');
            } else {
                this.titleInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    private async getIncome(id: number): Promise<void> {
        const response: CategoryIncomeType = await IncomeService.getIncome(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
            return;
        }

        this.incomeOriginalData = response;
        if (this.titleInputElement) {
            this.titleInputElement.value = response.title;
        }
    }

    private async updateIncome(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData: CategoryIncomeType = {title: ''};
            if (!this.titleInputElement || !this.incomeOriginalData) {
                window.location.href = '#/expense';
                return;
            }

            if (this.titleInputElement.value !== this.incomeOriginalData.title) {
                changedData.title = this.titleInputElement.value;
            }
            if (Object.keys(changedData).length > 0) {
                const incomeId: number | undefined = this.incomeOriginalData.id;
                if (incomeId !== undefined) {
                    const response: CategoryIncomeType = await ExpenseService.updateExpense(incomeId, changedData);

                    if (!response) {
                        alert("Произошла ошибка");
                    }

                    window.location.href = '#/income';
                    return;
                } else {
                    alert("Произошла ошибка");
                }
            }
        }
        window.location.href = '#/income';
    }
}