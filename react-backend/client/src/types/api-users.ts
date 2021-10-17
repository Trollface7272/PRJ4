export interface ApiSession {
    code: number
    valid: boolean
}


export interface ApiUser {
    code: number
    user: User
}


export interface User {
    id: number
    username: string
    name: string
}
export const EmptyUser: User = {
    id: -1,
    username: "",
    name: ""
}
