export type IncomeExpenseCreateType = {
    id?: number,
    type: string,
    amount: number,
    date: string
    comment: string
    category_id?: number,
    category?: string
};