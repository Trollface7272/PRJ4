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
    id: 0,
    username: "",
    name: "",
}

export interface Permissions {
    admin: boolean
    teacher: boolean
    student: boolean
    permissions: {
        profile: {
            usernameChange: boolean
            passwordChange: boolean
            nameChange: boolean
            avatarChange: boolean
        }
    }
}

export const EmptyPermissions = {
    admin: false,
    teacher: false,
    student: true,
    permissions: {
        profile: {
            usernameChange: false,
            passwordChange: false,
            nameChange: false,
            avatarChange: false
        }
    }
}