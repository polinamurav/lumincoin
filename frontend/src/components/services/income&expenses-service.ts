import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class IncomeExpensesService {
    static async getIncomeExpenses(period = 'all') {
        try {
            const result = await HttpUtils.request(config.api + '/operations?period=' + period);

            if (!result) {
                throw new Error('Данные операций отсутствуют или некорректны.');
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async getIncomeExpense(id) {
        try {
            const result = await HttpUtils.request(config.api + '/operations/' + id);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
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

    static async updateIncomeExpense(id, data) {
        try {
            const result = await HttpUtils.request(config.api + '/operations/' + id, 'PUT', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async deleteIncomeExpense(id) {
        try {
            const result = await HttpUtils.request(config.api + '/operations/' + id, 'DELETE');

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }
}