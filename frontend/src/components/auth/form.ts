import config from "../../config/config";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";

export class Form {
    constructor(page) {
        this.page = page;

        //если пользователь уже зарегистрирован
        if (Auth.getAuthInfo(Auth.accessTokenKey)) {
            return location.href = '#/';
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: 'lastName',
                    id: 'lastName',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                }
            )
            this.fields.push({
                name: 'passwordRepeat',
                id: 'password-repeat',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            })
        }

        const that = this;

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        if (field.name === 'passwordRepeat') {
            const password = this.fields.find(item => item.name === 'password').element.value;
            if (element.value !== password) {
                element.classList.add('is-invalid');
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                field.valid = true;
            }
        }

        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.api + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        localStorage.setItem('userEmail', email);
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await CustomHttp.request(config.api + '/login', 'POST', {
                    email: email,
                    password: password,
                });

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' +  result.user.lastName,
                        userId: result.user.id,
                        email: result.email
                    })
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}