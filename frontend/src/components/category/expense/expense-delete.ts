import {UrlUtils} from "../../services/url-utils";
import {ExpenseService} from "../../services/expense-service";

//done
export class ExpenseDelete {
    constructor() {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
            return;
        }

        this.deleteExpense(id).then();
    }

    private async deleteExpense(id): Promise<void> {
        const response: boolean = await ExpenseService.deleteExpense(id);

        if (!response) {
            alert("Произошла ошибка");
            window.location.href = '#/';
            return;
        }

        window.location.href = '#/expense';
    }
}