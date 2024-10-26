import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class IncomeService {
    static async getIncomes() {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income');

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async getIncome(id) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income/' + id);

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async createIncome(data) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income', 'POST', data);

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async deleteIncome(id) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income/' + id, 'DELETE');

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async updateIncome(id, data) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/income/' + id, 'PUT', data);

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }
}