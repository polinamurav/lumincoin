import {UrlUtils} from "../../services/url-utils";

export class IncomeDelete {
    constructor() {
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            window.location.href = '/#';
        }

        this.deleteIncome(id).then();
    }


}