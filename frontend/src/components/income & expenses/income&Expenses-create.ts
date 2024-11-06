import {IncomeExpensesService} from "../services/income&expenses-service";
import {UrlUtils} from "../services/url-utils";
import {IncomeService} from "../services/income-service";
import {ExpenseService} from "../services/expense-service";
import {CategoryIncomeType} from "../../types/category-income.type";
import {IncomeExpenseCreateType} from "../../types/income-expense-create.type";

//done
export class IncomeExpensesCreate {
    readonly typeInputElement: HTMLInputElement | null;
    readonly categoryInputElement: HTMLInputElement | null;
    readonly amountInputElement: HTMLInputElement | null;
    readonly dateInputElement: HTMLInputElement | null;
    readonly commentInputElement: HTMLInputElement | null;

    constructor() {
        const type: string | null = UrlUtils.getUrlParam('type');
        if (!type) {
            window.location.href = '/#';
        }

        const createButton: HTMLElement | null = document.getElementById('createButton');
        if (createButton) {
            createButton.addEventListener('click', this.saveIncomeExpenses.bind(this));
        }

        this.typeInputElement = document.getElementById('typeInput') as HTMLInputElement;
        this.categoryInputElement = document.getElementById('categoryInput') as HTMLInputElement;
        this.amountInputElement = document.getElementById('amountInput') as HTMLInputElement;
        this.dateInputElement = document.getElementById('dateInput') as HTMLInputElement;
        this.commentInputElement = document.getElementById('commentInput') as HTMLInputElement;

        if (type && (type === 'income' || type === 'expense')) {
            this.typeInputElement.value = type;
            if (type === 'income') {
                this.getIncomes().then();
            } else if (type === 'expense') {
                this.getExpenses().then();
            }
        }
    }

    private async getIncomes(): Promise<void> {
        const response: CategoryIncomeType[] | undefined = await IncomeService.getIncomes();

        if (!response) {
            alert(response);
            window.location.href = '#/';
            return;
        }

        this.showOptions(response);
    }

    private async getExpenses(): Promise<void> {
        const response: CategoryIncomeType[] | undefined = await ExpenseService.getExpenses();

        if (!response) {
            alert(response);
            window.location.href = '#/';
            return;
        }

        this.showOptions(response);
    }

    private showOptions(result: CategoryIncomeType[]): void {
        if (this.categoryInputElement) {
            this.categoryInputElement.innerHTML = '';
        }

        for (let i: number = 0; i < result.length; i++) {
            const optionElement: HTMLOptionElement | null = document.createElement('option');
            optionElement.value = result[i].id?.toString() ?? '';
            optionElement.textContent = result[i].title;

            if (this.categoryInputElement) {
                this.categoryInputElement.appendChild(optionElement);
            }
        }
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

    private async saveIncomeExpenses(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            const type: string = this.typeInputElement ? this.typeInputElement.value : '';
            const categoryId: number = this.categoryInputElement ? parseInt(this.categoryInputElement.value) : 0;
            const amount: number = this.amountInputElement ? parseFloat(this.amountInputElement.value) : 0;
            const date: string = this.dateInputElement ? this.dateInputElement.value : '';
            const comment: string = this.commentInputElement ? this.commentInputElement.value : '';

            const createData: IncomeExpenseCreateType = {
                type,
                category_id: categoryId,
                amount,
                date,
                comment,
            };

            const response: IncomeExpenseCreateType | undefined = await IncomeExpensesService.createIncomeExpenses(createData);

            if (!response) {
                alert("Произошла ошибка");
            }

            window.location.href = '#/income&expenses';
        }
    }
}