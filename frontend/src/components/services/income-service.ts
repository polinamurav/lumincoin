import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";
import {CategoryIncomeType} from "../../types/category-income.type";
import {DefaultResponseType} from "../../types/default-response.type";

//done
export class IncomeService {
    public static async getIncomes(): Promise<CategoryIncomeType[] | undefined> {
        try {
            const result: CategoryIncomeType[] = await HttpUtils.request(config.api + '/categories/income');

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async getIncome(id: string): Promise<CategoryIncomeType | undefined> {
        try {
            const result: CategoryIncomeType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/income/' + id);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryIncomeType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async createIncome(data: CategoryIncomeType): Promise<CategoryIncomeType | undefined> {
        try {
            const result: CategoryIncomeType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/income', 'POST', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryIncomeType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async deleteIncome(id: string): Promise<boolean> {
        try {
            const result: DefaultResponseType = await HttpUtils.request(config.api + '/categories/income/' + id, 'DELETE');

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return false;
            }

            return true;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return false;
        }
    }

    public static async updateIncome(id: number, data: CategoryIncomeType): Promise<CategoryIncomeType | undefined> {
        try {
            const result: CategoryIncomeType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/income/' + id, 'PUT', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryIncomeType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }
}