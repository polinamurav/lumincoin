import {UrlUtils} from "../services/url-utils";
import {IncomeExpensesService} from "../services/income&expenses-service";

//done
export class IncomeExpenseDelete {
    constructor() {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteIncomeExpense(id).then();
    }

    async deleteIncomeExpense(id): Promise<void>  {
        const response: boolean = await IncomeExpensesService.deleteIncomeExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '#/';
        }

        window.location.href = '#/income&expenses';
    }
}