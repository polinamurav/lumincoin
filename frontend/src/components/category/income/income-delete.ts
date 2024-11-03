import {UrlUtils} from "../../services/url-utils";
import {IncomeService} from "../../services/income-service";

//done
export class IncomeDelete {
    constructor() {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteIncome(id).then();
    }

    private async deleteIncome(id): Promise<void> {
        const response: boolean = await IncomeService.deleteIncome(id);

        if (!response) {
            alert("Произошла ошибка");
        }

        window.location.href = '#/income';
    }
}