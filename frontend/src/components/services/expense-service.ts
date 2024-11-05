import {CustomHttp as HttpUtils} from "./custom-http";
import config from "../../config/config";
import {CategoryExpenseType} from "../../types/category-expense.type";
import {DefaultResponseType} from "../../types/default-response.type";

//done
export class ExpenseService {
    public static async getExpenses(): Promise<CategoryExpenseType[] | undefined> {
        try {
            const result: CategoryExpenseType[] = await HttpUtils.request(config.api + '/categories/expense');

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            return result;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async getExpense(id: number): Promise<CategoryExpenseType | undefined> {
        try {
            const result: CategoryExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/expense/' + id);

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async createExpense(data: CategoryExpenseType): Promise<CategoryExpenseType | undefined> {
        try {
            const result: CategoryExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/expense', 'POST', data);

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async updateExpense(id: number, data: CategoryExpenseType): Promise<CategoryExpenseType | undefined> {
        try {
            const result: CategoryExpenseType | DefaultResponseType = await HttpUtils.request(config.api + '/categories/expense/' + id, 'PUT', data);

            if (!result) {
                alert('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
            }

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            return result as CategoryExpenseType;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    public static async deleteExpense(id: number): Promise<boolean> {
        try {
            const result: DefaultResponseType = await HttpUtils.request(config.api + '/categories/expense/' + id, 'DELETE');

            if (!result) {
                alert ('Данные операций отсутствуют или некорректны.');
                window.location.href = '/#';
                return false;
            }

            return true;
        } catch (error) {
            alert('Произошла ошибка при удалении.');
            return false;
        }
    }
}