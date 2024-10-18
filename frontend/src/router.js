import {Main} from "./components/main.js";
import {IncomeExpensesEdit} from "./components/income & expenses/income&Expenses-edit.js";
import {Form} from "./components/auth/form.js";
import {Auth} from "./components/services/auth";

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
                load: () => {
                    // new Logout();
                },
            },
            {
                route: '#/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/income/create',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/income/edit',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/category/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/income/delete',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/expenses/create',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/expenses/edit',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/category/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/expenses/delete',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/income&expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income & expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
                },
            },
            {
                route: '#/income&expenses/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income & expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new SignUp();
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
                    // new SignUp();
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
            // if (!Auth.getAuthInfo(Auth.accessTokenKey)) {
            //     location.href = '#/login';
            //     return false;
            // }

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
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            window.location.href = '#/';
        }
    }
}