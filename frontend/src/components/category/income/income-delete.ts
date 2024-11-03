import {UrlUtils} from "../../services/url-utils";
import {IncomeService} from "../../services/income-service";

export class IncomeDelete {
    constructor() {
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteIncome(id).then();
    }

    async deleteIncome(id) {
        const response = await IncomeService.deleteIncome(id);

        if (!response) {
            alert("Произошла ошибка");
            return window.location.href = '#/';
        }

        return window.location.href = '#/income';
    }
}