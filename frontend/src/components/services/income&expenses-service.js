import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class IncomeExpensesService {
    static async getIncomeExpenses(period = 'all', dateFrom = 'null', dateTo = 'null') {
        try {
            const result = await HttpUtils.request(config.api + '/operations?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo);

            if (!result) {
                throw new Error('Данные операций отсутствуют или некорректны.');
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async createIncomeExpenses(data) {
        try {
            const result = await HttpUtils.request(config.api + '/operations', 'POST', data);

            // if (!result || !result.length) {
            //     throw new Error('Данные операций отсутствуют или некорректны.');
            // }

            return result;
        } catch (error) {
            return error;
        }
    }
}