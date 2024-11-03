export class UrlUtils {
    static getUrlParam(param) {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.split('?')[1]);
        return urlParams.get(param);
    }
}