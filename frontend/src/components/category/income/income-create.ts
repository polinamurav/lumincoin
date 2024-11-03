import {IncomeService} from "../../services/income-service";
import {CategoryIncomeType} from "../../../types/category-income.type";

//done
export class IncomeCreate {
    readonly titleInputElement: HTMLInputElement | null;

    constructor() {
        const createButton: HTMLElement | null = document.getElementById('createButton');
        if (createButton) {
            createButton.addEventListener('click', this.saveIncome.bind(this));
        }

        this.titleInputElement = document.getElementById('titleInput') as HTMLInputElement;
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

    private async saveIncome(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            if (!this.titleInputElement) {
                window.location.href = '#/income';
                return;
            }
            const createData: CategoryIncomeType = {
                title: this.titleInputElement.value,
            };

            const response: CategoryIncomeType = await IncomeService.createIncome(createData);

            if (!response) {
                alert("Произошла ошибка");
            }

            window.location.href = '#/income';
        }
    }
}