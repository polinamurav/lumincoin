import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class ExpenseService {
    static async getExpenses() {
        try {
            const result = await HttpUtils.request(config.api + '/categories/expense');

            if (!result || !result.length || result.error) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async getExpense(id) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/expense/' + id);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async createExpense(data) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/expense', 'POST', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async updateExpense(id, data) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/expense/' + id, 'PUT', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }

    static async deleteExpense(id) {
        try {
            const result = await HttpUtils.request(config.api + '/categories/expense/' + id, 'DELETE');

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }
}