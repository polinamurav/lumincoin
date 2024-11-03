import {UrlUtils} from "../services/url-utils";
import {IncomeExpensesService} from "../services/income&expenses-service";

export class IncomeExpenseDelete {
    constructor() {
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteIncomeExpense(id).then();
    }

    async deleteIncomeExpense(id) {
        const response = await IncomeExpensesService.deleteIncomeExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            return window.location.href = '#/';
        }

        return window.location.href = '#/income&expenses';
    }
}