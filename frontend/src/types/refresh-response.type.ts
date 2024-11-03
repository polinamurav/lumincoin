export type RefreshResponseType = {
    error: boolean,
    message: string,
    tokens?: {
        accessToken,
        refreshToken,
    },
}