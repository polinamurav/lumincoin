import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);
        // let token = Auth.getAuthInfo(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                if (!token) {
                    //     1 - токена нет
                    window.location.href = '#/login';
                } else {
                    //     2 - токен устарел (надо обновить)
                    const updateTokenResult = await Auth.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return await this.request(url, method, body);
                    } else {
                        window.location.href = '#/login';
                    }
                }
            }

            throw new Error(response.message);
        }

        return await response.json();
    }
}