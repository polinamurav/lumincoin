import {Main} from "./components/main.js";
import {IncomeExpensesEdit} from "./components/income & expenses/income&Expenses-edit.js";
import {Form} from "./components/auth/form.js";
import {Auth} from "./components/services/auth";
import {CustomHttp, CustomHttp as HttpUtils} from "./components/services/custom-http";
import config from "./config/config";
import {IncomeExpensesList} from "./components/income & expenses/income&Expenses-list";
import {IncomeExpensesCreate} from "./components/income & expenses/income&Expenses-create";
import {IncomeList} from "./components/category/income/income-list";
import {IncomeCreate} from "./components/category/income/income-create";
import {IncomeDelete} from "./components/category/income/income-delete";
import {IncomeEdit} from "./components/category/income/income-edit";
import {ExpenseList} from "./components/category/expense/expense-list";
import {ExpenseCreate} from "./components/category/expense/expense-create";
import {ExpenseEdit} from "./components/category/expense/expense-edit";
import {ExpenseDelete} from "./components/category/expense/expense-delete";
import {IncomeExpenseDelete} from "./components/income & expenses/income&Expense-delete";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                filePathTemplate: 'templates/pages/main.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new Main();
                },
            },
            {
                route: '#/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '#/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Form('login');
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'vh-100');
                },
            },
            {
                route: '#/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new Form('signup');
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'vh-100');
                },
            },
            {
                route: '#/logout',
            },
            {
                route: '#/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeList();
                },
            },
            {
                route: '#/income/create',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                },
            },
            {
                route: '#/income/edit',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                   new IncomeEdit();
                },
            },
            {
                route: '#/income/delete',
                load: () => {
                    new IncomeDelete();
                },
            },
            {
                route: '#/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseList();
                },
            },
            {
                route: '#/expense/create',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate();
                },
            },
            {
                route: '#/expense/edit',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit();
                },
            },
            {
                route: '#/expense/delete',
                load: () => {
                    new ExpenseDelete();
                },
            },
            {
                route: '#/income&expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income & expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesList();
                },
            },
            {
                route: '#/income&expenses/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income & expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesCreate();
                },
            },
            {
                route: '#/income&expenses/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income & expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesEdit();
                },
            },
            {
                route: '#/income&expenses/delete',
                load: () => {
                    new IncomeExpenseDelete();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (urlRoute === '#/logout') {
            await Auth.logout();
            location.href = '#/login';
            return false;
        }

        if (newRoute) {
            if (urlRoute !== '#/login' && urlRoute !== '#/sign-up') {
                const accessTokenKey = localStorage.getItem(Auth.accessTokenKey);
                if (!accessTokenKey) {
                    window.location.href = '#/login';
                    return;
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                document.body.className = '';
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());

                this.profileNameElement = document.getElementById('user-name');
                if (!this.userName) {
                    let userInfo = Auth.getAuthInfo(Auth.userInfoKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo);
                        if (userInfo.fullName) {
                            this.userName = userInfo.fullName;
                        }
                    }
                }
                if (this.profileNameElement) {
                    this.profileNameElement.innerText = this.userName;
                }
                this.activateMenuItem(newRoute);

                // await this.getBalance();
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            window.location.href = '#/login';
        }
    }

    async getBalance() {
        const result = await CustomHttp.request(config.api + '/balance');

        // if (result.status === 401) {
        //     window.location.href = '#/login';
        //     return;
        // }

        if (result.error || !result.response) {
            alert('Ошибка при запросе баланса. Обратитесь в поддержку');
            return;
        }

        document.getElementById('balance').innerText = result.balance || 0;
    }

    activateMenuItem(route) {
        let openedDropdown = null;

        document.querySelectorAll('.nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.startsWith(href) && href !== '#/') || (route.route === '#/' && href === '#/')) {
                item.classList.add('active');
                item.classList.remove('link-dark');
                if (href === '#/income' || href === '#/expense') {
                    const dropdownMenu = item.closest('.dropdown').querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.add('show');
                        openedDropdown = dropdownMenu;
                    }
                }
            } else {
                item.classList.remove('active');
                item.classList.add('link-dark');
                if (href === '#/income' || href === '#/expense') {
                    const dropdownMenu = item.closest('.dropdown').querySelector('.dropdown-menu');
                    if (dropdownMenu && openedDropdown !== dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                }
            }
        });
    }
}