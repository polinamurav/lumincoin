import config from "../../config/config";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {FormFieldType} from "../../types/form-field.type";
import {LoginResponseType} from "../../types/login-response.type";
import { ActionPageType } from "../../types/action-page.type";

export class Form {
    readonly page: ActionPageType.signup | ActionPageType.login;
    private fields: FormFieldType[] = [];
    readonly processElement: HTMLElement | null;

    constructor(page: ActionPageType.signup | ActionPageType.login) {
        this.page = page;
        this.processElement = null;

        //если пользователь уже зарегистрирован
        if (Auth.getAuthInfo(Auth.accessTokenKey)) {
            location.href = '#/';
            return;
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

        const that: Form = this;

        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this);
            }
        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }

        if (field.name === 'passwordRepeat') {
            const passwordField: FormFieldType | undefined = this.fields.find((item: FormFieldType): boolean => item.name === 'password');
            if (passwordField && passwordField.element) {
                const password: string = passwordField.element.value;
                if (element.value !== password) {
                    element.classList.add('is-invalid');
                    field.valid = false;
                } else {
                    element.classList.remove('is-invalid');
                    field.valid = true;
                }
            } else {
                console.error('Password field not found.');
                element.classList.add('is-invalid');
                field.valid = false;
            }
        }

        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every((item: FormFieldType) => item.valid);
        if (!this.processElement) {
            console.log('Элемент не найден!');
            return false;
        }

        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }

        return validForm;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email: string | undefined  = this.fields.find((item: FormFieldType): boolean => item.name === 'email')?.element?.value;
            const password: string | undefined  = this.fields.find((item: FormFieldType): boolean => item.name === 'password')?.element?.value;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.api + '/signup', 'POST', {
                        name: this.fields.find((item: FormFieldType): boolean => item.name === 'name')?.element?.value,
                        lastName: this.fields.find((item: FormFieldType): boolean => item.name === 'lastName')?.element?.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find((item: FormFieldType): boolean => item.name === 'passwordRepeat')?.element?.value,
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        if (email) {
                            localStorage.setItem('userEmail', email);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result: LoginResponseType = await CustomHttp.request(config.api + '/login', 'POST', {
                    email: email,
                    password: password,
                });

                if (result) {
                    if (result.error || !result.tokens?.accessToken || !result.tokens?.refreshToken || !result.user?.name || !result.user?.lastName || !result.user?.id) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id,
                        email: email
                    })
                    location.href = '#/';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}