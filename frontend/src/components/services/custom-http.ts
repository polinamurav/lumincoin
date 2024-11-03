import {Auth} from "./auth";

//done
export class CustomHttp {
    public static async request(url: string, method: string = 'GET', body: any = null): Promise<any> {
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response: Response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                if (!token) {
                    //     1 - токена нет
                    window.location.href = '#/login';
                } else {
                    //     2 - токен устарел (надо обновить)
                    const updateTokenResult: boolean = await Auth.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return await this.request(url, method, body);
                    } else {
                        window.location.href = '#/login';
                    }
                }
            }

            throw new Error(response.statusText);
        }

        return await response.json();
    }
}