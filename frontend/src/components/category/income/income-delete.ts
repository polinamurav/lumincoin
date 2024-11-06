import {UrlUtils} from "../../services/url-utils";
import {IncomeService} from "../../services/income-service";

//done
export class IncomeDelete {
    constructor() {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
            return;
        }

        this.deleteIncome(id).then();
    }

    private async deleteIncome(id: string): Promise<void> {
        const response: boolean = await IncomeService.deleteIncome(id);

        if (!response) {
            alert("Произошла ошибка");
        }

        window.location.href = '#/income';
    }
}