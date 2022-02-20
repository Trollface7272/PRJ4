import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId,
    username: string
    name: string
    password: string
    sessions: string[]
    groups: Types.ObjectId[]
    level: number
    xp: number
    coins: number
}

export interface IUserPermissions {
    profile: IProfilePermissions
    
}

export interface IProfilePermissions {
    usernameChange: boolean
    passwordChange: boolean
    nameChange: boolean
    avatarChange: boolean
}

export interface IQuestRequirements {
    groups: Types.ObjectId[]
    level: number
}

export interface IQuestRewards {
    xp: number
    coins: number
}

export interface IQuestSubmission {
    userId: string,
    files: string[],
    text: string,
    submitedAt: Date
}

export interface IQuest {
    _id: Types.ObjectId
    name: string
    description: string
    requirements: IQuestRequirements
    rewards: IQuestRewards
    submissions: IQuestSubmission[]
}

export interface IGroupProfilePermissions {
    usernameChange: boolean,
    passwordChange: boolean,
    nameChange: boolean,
    avatarChange: boolean
}

export interface IGroupsPermissions {
    profile: IGroupProfilePermissions
}


export interface IGroup {
    _id: Types.ObjectId
    name: string
    admin: boolean
    teacher: boolean
    student: boolean
    permissions: IGroupsPermissions
}

export interface IShopItemRequirements {
    groups: Types.ObjectId[]
    level: number
}

export interface IShopItem {
    _id: Types.ObjectId
    name: string
    description: string
    requirements: IShopItemRequirements
    cost: number
    stock: number
}

export interface IMessage {
    _id: Types.ObjectId,
    from: Types.ObjectId,
    to: Types.ObjectId,
    text: string,
    fileNames: string[],
    originalNames: string[]
}