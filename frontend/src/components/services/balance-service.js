import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class BalanceService {
    static async getBalance() {
        try {
            const result = await HttpUtils.request(config.api + '/balance');

            if (!result || !result.length || result.error) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            return error;
        }
    }
}