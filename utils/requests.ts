import axios, { AxiosResponse } from "axios"

type body = {
    [key: string]: any
}
export const PostRequest = async (url: string, body: body): Promise<AxiosResponse> => {
    return await axios.post(url, body)
}

export enum ENDPOINTS {
    LOGIN = "/api/users/login",
    LOGOUT = "/api/users/logout",
    IS_SESSION_VALID = "/api/users/session",
    SEND_MESSAGE = `/api/messages/send`,
    GET_USER = `/api/users/lookup`,
    CHANGE_USERNAME =  `/api/users/changeusername`,
    CHANGE_NAME = `/api/users/changename`,
    CHANGE_PASSWORD = `/api/users/changepassword`
}