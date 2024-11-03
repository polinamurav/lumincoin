import config from "../../config/config";
import {UserInfoType} from "../../types/user-info.type";
import {LogoutResponseType} from "../../types/logout-response.type";
import {RefreshResponseType} from "../../types/refresh-response.type";
import {AuthInfoType} from "../../types/auth-info.type";

export class Auth {
    public static accessTokenKey: string = 'accessToken';
    private static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static setUserInfo(info: UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    private static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    private static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static getAuthInfo(key: string | null = null): string | AuthInfoType | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
            }
        }
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static async logout(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/logout', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })

            if (response && response.status === 200) {
                const result: LogoutResponseType | null = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    localStorage.removeItem('userEmail')
                    return true;
                }
            }
        }
        return false;
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey) as string | null;
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            if (response && response.status === 200) {
                const resultToken: RefreshResponseType | null = await response.json();
                if (resultToken && !resultToken.error && resultToken.tokens) {
                    if (resultToken.tokens.accessToken && resultToken.tokens.refreshToken) {
                        this.setAuthInfo(resultToken.tokens.accessToken, resultToken.tokens.refreshToken);
                    }
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}