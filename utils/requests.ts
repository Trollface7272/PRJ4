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
    CHANGE_USERNAME = `/api/users/changeusername`,
    CHANGE_NAME = `/api/users/changename`,
    CHANGE_PASSWORD = `/api/users/changepassword`,
    QUESTS_BY_GROUP = `/api/quests/groups/{id}`,
    USERS_BY_GROUP = `/api/users/groups/{id}`,
    GRADE_QUEST_SUBMISSION = `/api/quests/grade/{quest}/{user}`,
    SUBMIT_QUEST = `/api/quests/submit/{quest}`,
    SHOP_ITEMS_BY_GROUP = `/api/shop/groups/{id}`,
    SHOP_PURCHASE = `/api/shop/purchase/{item}`,
    ADD_QUEST = `/api/quests/add`,
    ADD_SHOP_ITEM = `/api/shop/add`,
    ADD_USER = `/api/users/add`,
}