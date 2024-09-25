export class IncomeExpensesEdit {
    constructor() {
        document.getElementById('myModal').addEventListener('shown.bs.modal', function () {
            document.getElementById('myInput').focus();
        });
    }
}