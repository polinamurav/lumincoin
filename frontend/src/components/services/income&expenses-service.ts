import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";
import {IncomeExpenseType} from "../../types/income-expense.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {IncomeExpenseCreateType} from "../../types/income-expense-create.type";

//done
export class IncomeExpensesService {
    public static async getIncomeExpenses(period: string = 'all'): Promise<IncomeExpenseType[] | undefined> {
        try {
            const result: IncomeExpenseType[] = await HttpUtils.request(config.api + '/operations?period=' + period);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async getIncomeExpense(id: string): Promise<IncomeExpenseType | undefined> {
        try {
            const result: IncomeExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/operations/' + id);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async createIncomeExpenses(data: IncomeExpenseCreateType): Promise<IncomeExpenseCreateType | undefined> {
        try {
            const result: IncomeExpenseCreateType | DefaultResponseType = await HttpUtils.request(config.api + '/operations', 'POST', data);

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseCreateType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async updateIncomeExpense(id: number, data: IncomeExpenseCreateType): Promise<IncomeExpenseCreateType | undefined> {
        try {
            const result: IncomeExpenseCreateType | DefaultResponseType = await HttpUtils.request(config.api + '/operations/' + id, 'PUT', data);

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as IncomeExpenseCreateType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async deleteIncomeExpense(id: string): Promise<boolean> {
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