import axios, { AxiosResponse } from "axios"

type body = {
    [key: string]: any
}
export const PostRequest = async (url: string, body: body): Promise<AxiosResponse> => {
    return await axios.post(url, body)
}

export enum ENDPOINTS {
    LOGIN="/api/users/login",
    LOGOUT="/api/users/logout",
    IS_SESSION_VALID="/api/users/session",

}