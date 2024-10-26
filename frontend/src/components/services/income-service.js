import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class IncomeService {
    static async getIncomes() {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income');

            // if (!result || !result.length) {
            //     throw new Error('Данные операций отсутствуют или некорректны.');
            // }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async createIncome(data) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income', 'POST', data);

            // if (!result || !result.length) {
            //     throw new Error('Данные операций отсутствуют или некорректны.');
            // }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async deleteIncome(id) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income/' + id, 'DELETE');

            // if (!result || !result.length) {
            //     throw new Error('Данные операций отсутствуют или некорректны.');
            // }

            return result;
        } catch (error) {
            return error;
        }
    }
}