import {UrlUtils} from "../services/url-utils";
import {ExpenseService} from "../services/expense-service";
import {IncomeExpensesService} from "../services/income&expenses-service";
import {IncomeService} from "../services/income-service";
import {IncomeExpenseType} from "../../types/income-expense.type";
import {CategoryExpenseType} from "../../types/category-expense.type";
import {CategoryIncomeType} from "../../types/category-income.type";
import {IncomeExpenseCreateType} from "../../types/income-expense-create.type";

//error
export class IncomeExpensesEdit {
    readonly typeInputElement: HTMLInputElement | null;
    readonly categoryInputElement: HTMLInputElement | null;
    readonly amountInputElement: HTMLInputElement | null;
    readonly dateInputElement: HTMLInputElement | null;
    readonly commentInputElement: HTMLInputElement | null;
    private incomeExpenseOriginalData: IncomeExpenseCreateType | null;

    constructor() {
        document.getElementById('updateButton').addEventListener('click', this.updateIncomeExpense.bind(this));

        this.typeInputElement = document.getElementById('typeInput') as HTMLInputElement;
        this.categoryInputElement = document.getElementById('categoryInput') as HTMLInputElement;
        this.amountInputElement = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.getIncomeExpense(id).then();
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        let textInputArray: (HTMLInputElement | null)[] = [this.typeInputElement, this.categoryInputElement, this.amountInputElement,
            this.dateInputElement, this.commentInputElement];
        for (let i: number = 0; i < textInputArray.length; i++) {
            const inputElement: HTMLInputElement | null = textInputArray[i];
            if (inputElement) {
                if (inputElement.value) {
                    inputElement.classList.remove('is-invalid');
                } else {
                    inputElement.classList.add('is-invalid');
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    private async getIncomeExpense(id): Promise<void> {
        const response: IncomeExpenseType = await IncomeExpensesService.getIncomeExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '/#';
            return;
        }

        this.incomeExpenseOriginalData = response;
        this.showIncomeExpenses(response);
    }

    private showIncomeExpenses(incomeExpense: IncomeExpenseType): void {
        this.typeInputElement.value = incomeExpense.type;
        this.amountInputElement.value = incomeExpense.amount;
        this.dateInputElement.value = incomeExpense.date;
        this.commentInputElement.value = incomeExpense.comment;
        if (incomeExpense.type === 'income') {
            this.getIncomes().then();
        } else if (incomeExpense.type === 'expense') {
            this.getExpenses().then();
        }
    }

    private async getIncomes(): Promise<void> {
        const response: CategoryIncomeType[] = await IncomeService.getIncomes();

        if (!response) {
            alert(response);
            window.location.href = '#/';
            return;
        }

        this.showOptions(response);
    }

    private async getExpenses(): Promise<void> {
        const response: CategoryExpenseType[] = await ExpenseService.getExpenses();

        if (!response) {
            alert(response);
            window.location.href = '#/';
            return;
        }

        this.showOptions(response);
    }

    private showOptions(result): void {
        if (this.categoryInputElement) {
            this.categoryInputElement.innerHTML = '';
        }

        const currentCategory: IncomeExpenseCreateType = result.find(cat => cat.title === this.incomeExpenseOriginalData.category);
        if (currentCategory) {
            const optionElement: HTMLOptionElement | null = document.createElement('option');
            optionElement.value = currentCategory.id;
            optionElement.textContent = currentCategory.title;
            if (this.categoryInputElement) {
                this.categoryInputElement.appendChild(optionElement);
            }

            //обновляем список с уже id
            this.incomeExpenseOriginalData.category_id = currentCategory.id;
        }

        for (let i: number = 0; i < result.length; i++) {
            if (result[i].id !== this.incomeExpenseOriginalData.category_id) {
                const optionElement: HTMLOptionElement = document.createElement('option');
                optionElement.value = result[i].id.toString();
                optionElement.textContent = result[i].title;

                if (this.categoryInputElement) {
                    this.categoryInputElement.appendChild(optionElement);
                }
            }
        }

    }

    private async updateIncomeExpense(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            if (this.typeInputElement.value !== this.incomeExpenseOriginalData.type) {
                this.incomeExpenseOriginalData.type = this.typeInputElement.value;
            }
            if (parseInt(this.categoryInputElement.value) !== parseInt(this.incomeExpenseOriginalData.category_id)) {
                this.incomeExpenseOriginalData.category_id = parseInt(this.categoryInputElement.value);
            }
            if (parseFloat(this.amountInputElement.value) !== parseFloat(this.incomeExpenseOriginalData.amount)) {
                this.incomeExpenseOriginalData.amount = parseFloat(this.amountInputElement.value);
            }
            if (this.dateInputElement.value !== this.incomeExpenseOriginalData.date) {
                this.incomeExpenseOriginalData.date = this.dateInputElement.value;
            }
            if (this.commentInputElement.value !== this.incomeExpenseOriginalData.comment) {
                this.incomeExpenseOriginalData.comment = this.commentInputElement.value;
            }
            const response: IncomeExpenseCreateType = await IncomeExpensesService.updateIncomeExpense(this.incomeExpenseOriginalData.id, this.incomeExpenseOriginalData);

            if (!response) {
                alert("Произошла ошибка");
            }

            window.location.href = '#/income&expenses';
        }
        window.location.href = '#/income&expenses';
    }
}