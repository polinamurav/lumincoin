import {Main} from "./components/main";
import {IncomeExpensesEdit} from "./components/income & expenses/income&Expenses-edit";
import {Form} from "./components/auth/form";
import {Auth} from "./components/services/auth";
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
import {BalanceService} from "./components/services/balance-service";
import {RouteType} from "./types/route.type";
import {BalanceType} from "./types/balance.type";
import {UserInfoType} from "./types/user-info.type";

//done
export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private profileNameElement: HTMLElement | null;
    private routes: RouteType [];
    private userName: string | null;

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.userName = null;

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
                title: 'Выход',
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
                title: 'Удалить',
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
                title: 'Удалить',
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
                title: 'Удалить',
                load: () => {
                    new IncomeExpenseDelete();
                },
            },
        ]
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    private async activateRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (urlRoute === '#/logout') {
            await Auth.logout();
            location.href = '#/login';
            return;
        }

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if (urlRoute !== '#/login' && urlRoute !== '#/sign-up') {
            const accessTokenKey: string | null = localStorage.getItem(Auth.accessTokenKey);
            if (!accessTokenKey) {
                window.location.href = '#/login';
                return;
            }
        }

        if (newRoute.title) {
            if (this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title;
            }
        }

        if (newRoute.filePathTemplate) {
            document.body.className = '';
            let contentBlock: HTMLElement | null = this.contentPageElement;
            if (contentBlock) {
                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then((response: Response) => response.text());
                    }
                    contentBlock = document.getElementById('content-layout');
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then((response: Response) => response.text());
                }
            }
            await this.getBalance();

            this.profileNameElement = document.getElementById('user-name');
            if (!this.userName) {
                let userInfoStr: string | null = Auth.getAuthInfo(Auth.userInfoKey) as string | null;
                if (userInfoStr) {
                    const userInfo: UserInfoType = JSON.parse(userInfoStr);
                    if (userInfo.fullName) {
                        this.userName = userInfo.fullName;
                    }
                }
            }

            if (this.profileNameElement) {
                if (typeof this.userName === "string") {
                    this.profileNameElement.innerText = this.userName;
                }
            }
            this.activateMenuItem(newRoute);
        }

        if (newRoute.load && typeof newRoute.load === 'function') {
            newRoute.load();
        }

    }

    private async getBalance(): Promise<void> {
        const response: BalanceType = await BalanceService.getBalance();

        if (!response) {
            alert("Баланс не получен");
            window.location.href = '#/';
            return;
        }

        const balanceElement: HTMLElement | null = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.innerText = response.balance ? response.balance + '$' : '0$';
        }

        const balancePhone: HTMLElement | null = document.getElementById('balance2');
        if (balancePhone) {
            balancePhone.innerText = response.balance + '$' || '0$';
        }
    }

    private activateMenuItem(route: RouteType): void {
        let openedDropdown: HTMLElement | null = null;

        document.querySelectorAll('.nav-link').forEach((item: HTMLElement) => {
            const href: string | null = item.getAttribute('href');
            if ((route.route.startsWith(href) && href !== '#/') || (route.route === '#/' && href === '#/')) {
                item.classList.add('active');
                item.classList.remove('link-dark');
                if (href === '#/income' || href === '#/expense') {
                    const dropdownMenu: HTMLElement | null = item.closest('.dropdown').querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.add('show');
                        openedDropdown = dropdownMenu;
                    }
                }
            } else {
                item.classList.remove('active');
                item.classList.add('link-dark');
                if (href === '#/income' || href === '#/expense') {
                    const dropdownMenu: HTMLElement | null = item.closest('.dropdown').querySelector('.dropdown-menu');
                    if (dropdownMenu && openedDropdown !== dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                }
            }
        });
    }
}