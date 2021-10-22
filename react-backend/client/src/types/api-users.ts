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
    permissions: {
        profile: {
            usernameChange: boolean
            passwordChange: boolean
            nameChange: boolean
            avatarChange: boolean
        }
    }
}
export const EmptyUser: User = {
    id: 0,
    username: "",
    name: "",
    permissions: {
        profile: {
            usernameChange: true,
            passwordChange: true,
            nameChange: true,
            avatarChange: true
        }
    }
}
