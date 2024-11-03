import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";

export class BalanceService {
    static async getBalance() {
        try {
            const result = await HttpUtils.request(config.api + '/balance');
            console.log(result);

            return result;
        } catch (error) {
            return error;
        }
    }
}