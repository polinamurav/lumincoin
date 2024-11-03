//done
export class UrlUtils {
    public static getUrlParam(param: string): string | null {
        const hash: string = window.location.hash;
        const urlParams: URLSearchParams = new URLSearchParams(hash.split('?')[1]);
        return urlParams.get(param);
    }
}