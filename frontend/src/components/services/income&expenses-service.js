import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class IncomeExpensesService {
    // static async getIncomeExpenses() {
    //     const returnObject = {
    //         error: false,
    //         redirect: null,
    //         incomeExpenses: null
    //     };
    //
    //     const result = await HttpUtils.request(config.api + '/operations');
    //
    //     if (result.redirect || result.error || !result.response) {
    //         returnObject.error = 'Возникла ошибка при запросе операций. Обратитесь в поддержку';
    //         if (result.redirect) {
    //             returnObject.redirect = result.redirect;
    //             return returnObject;
    //         }
    //         return returnObject;
    //     }
    //
    //     returnObject.freelancers = result.response.freelancers;
    //     return returnObject;
    // }


    static async getIncomeExpenses() {
        try {
            const result = await HttpUtils.request(config.api + '/operations');

            // if (!result || !result.length) {
            //     throw new Error('Данные операций отсутствуют или некорректны.');
            // }

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