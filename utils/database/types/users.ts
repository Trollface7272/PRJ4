import { Types } from "mongoose"
export namespace ServerUserTypes {
    export interface UserPermissions {
        admin: boolean
        teacher: boolean
        student: boolean
        profile: {
            avatarChange: boolean
            nameChange: boolean
            passwordChange: boolean
            usernameChange: boolean
        }
        users: {
            addUsers: boolean
            assignGroups: boolean
        }
        
    }
    export interface User {
        _id: Types.ObjectId
        name: string
        username: string
        password: string
        coins: number
        level: number
        xp: number
        groups: Types.ObjectId[]
        sessions: string[]
        permissions: UserPermissions
    }
}

export namespace ClientUserTypes {
    export interface UserPermissions {
        admin: boolean
        teacher: boolean
        student: boolean
        profile: {
            avatarChange: boolean
            nameChange: boolean
            passwordChange: boolean
            usernameChange: boolean
        }
        users: {
            addUsers: boolean
            assignGroups: boolean
        }
        
    }
    export interface User {
        _id: string
        name: string
        username: string
        coins: number
        level: number
        xp: number
        permissions: UserPermissions
    }
}