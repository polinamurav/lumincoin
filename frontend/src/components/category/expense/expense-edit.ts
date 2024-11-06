import {UrlUtils} from "../../services/url-utils";
import {ExpenseService} from "../../services/expense-service";
import {CategoryExpenseType} from "../../../types/category-expense.type";

//done
export class ExpenseEdit {
    readonly titleInputElement: HTMLInputElement | null;
    private expenseOriginalData: CategoryExpenseType | null = null;

    constructor() {
        const updateButton: HTMLElement | null = document.getElementById('updateButton');
        if (updateButton) {
            updateButton.addEventListener('click', this.updateExpense.bind(this));
        }

        this.titleInputElement = document.getElementById('titleInput') as HTMLInputElement;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
            return;
        }

        this.getExpense(id).then();
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

    private async getExpense(id: string): Promise<void> {
        const response: CategoryExpenseType | undefined = await ExpenseService.getExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
            return;
        }

        this.expenseOriginalData = response;
        if (this.titleInputElement) {
            this.titleInputElement.value = response.title;
        }
    }

    private async updateExpense(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData: CategoryExpenseType = {title: ''};
            if (!this.titleInputElement || !this.expenseOriginalData) {
                window.location.href = '#/expense';
                return;
            }

            if (this.titleInputElement.value !== (this.expenseOriginalData as CategoryExpenseType).title) {
                changedData.title = this.titleInputElement.value;
            }
            if (Object.keys(changedData).length > 0) {
                const expenseId: number | undefined = this.expenseOriginalData.id;
                if (expenseId !== undefined) {
                    const response: CategoryExpenseType | undefined = await ExpenseService.updateExpense(expenseId, changedData);

                    if (!response) {
                        alert("Произошла ошибка");
                    }

                    window.location.href = '#/expense';
                    return;
                } else {
                    alert("Произошла ошибка");
                }
            }
        }
        window.location.href = '#/expense';
    }
}