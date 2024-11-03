import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";
import {IncomeExpenseType} from "../../types/income-expense.type";
import {DefaultResponseType} from "../../types/default-response.type";

//done
export class IncomeExpensesService {
    public static async getIncomeExpenses(period: string = 'all'): Promise<IncomeExpenseType[]> {
        try {
            const result: IncomeExpenseType[] = await HttpUtils.request(config.api + '/operations?period=' + period);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return;
            }

            return result;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return;
        }
    }

    public static async getIncomeExpense(id: number): Promise<IncomeExpenseType> {
        try {
            const result: IncomeExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/operations/' + id);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return;
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return;
        }
    }

    public static async createIncomeExpenses(data: IncomeExpenseType): Promise<IncomeExpenseType> {
        try {
            const result: IncomeExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/operations', 'POST', data);

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return;
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return;
        }
    }

    public static async updateIncomeExpense(id: number, data): Promise<IncomeExpenseType> {
        try {
            const result: IncomeExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/operations/' + id, 'PUT', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return;
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return;
        }
    }

    public static async deleteIncomeExpense(id: number): Promise<boolean> {
        try {
            const result: DefaultResponseType = await HttpUtils.request(config.api + '/operations/' + id, 'DELETE');

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return false;
            }

            return true;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return false;
        }
    }
}