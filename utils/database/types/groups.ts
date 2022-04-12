import { Types } from "mongoose"
export namespace ServerGroupTypes {
    export interface ProfilePermissions {
        avatarChange: boolean
        nameChange: boolean
        passwordChange: boolean
        usernameChange: boolean
    }
    export interface UserPermissions {
        addUsers: boolean
        assignGroups: boolean
    }
    export interface Group {
        _id: Types.ObjectId
        name: string
        admin: boolean
        teacher: boolean
        student: boolean
        profile: ProfilePermissions
        users: UserPermissions
    }
}

export namespace ClientGroupTypes {
    export interface ProfilePermissions {
        avatarChange: boolean
        nameChange: boolean
        passwordChange: boolean
        usernameChange: boolean
    }
    export interface UserPermissions {
        addUsers: boolean
        assignGroups: boolean
    }
    export interface Group {
        _id: string
        name: string
        admin: boolean
        teacher: boolean
        student: boolean
        profile: ProfilePermissions
        users: UserPermissions
    }
}