import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";
import {BalanceType} from "../../types/balance.type";

//done
export class BalanceService {
    public static async getBalance(): Promise<BalanceType> {
        try {
            const result: BalanceType = await HttpUtils.request(config.api + '/balance');
            console.log(result);

            return result;
        } catch (error) {
            return error;
        }
    }
}