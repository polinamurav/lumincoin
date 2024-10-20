import {IncomeExpensesService} from "../services/income&expenses-service";

export class IncomeExpensesList {
    constructor() {
        // document.getElementById('')
        this.getIncomeExpenses().then();
    }

    async getIncomeExpenses() {
        const response = await IncomeExpensesService.getIncomeExpenses();

        if (response.error) {
            alert(response.error);
            return response.redirect ? window.location.href = '#/' : null;
        }

        this.showRecords(response.incomeExpenses);
    }

    showRecords(incomeExpenses) {
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < incomeExpenses.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerText = incomeExpenses[i].type;
            trElement.insertCell().innerText = incomeExpenses[i].category;
            trElement.insertCell().innerText = incomeExpenses[i].amount;
            trElement.insertCell().innerText = incomeExpenses[i].date;
            trElement.insertCell().innerText = incomeExpenses[i].comment;
            trElement.insertCell().innerHTML = '<a href="#/income&expenses/delete?id=' + id + '" class="btn border-0 p-0 me-2">' +
                '<i class="bi bi-trash me-2"></i></a>' +
                '<a href="#/income&expenses/edit?id=' + id + '" class="btn border-0 p-0 me-2">' +
                '<i class="bi bi-pencil"></i></a>';

            recordsElement.appendChild(trElement);
        }

    }


}