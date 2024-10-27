import {UrlUtils} from "../../services/url-utils";
import {ExpenseService} from "../../services/expense-service";

export class ExpenseDelete {
    constructor() {
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteExpense(id).then();
    }


    async deleteExpense(id) {
        const response = await ExpenseService.deleteExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            return window.location.href = '#/';
        }

        return window.location.href = '#/expense';
    }
}