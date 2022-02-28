import { Types } from "mongoose"
export namespace ServerUserTypes {
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
    }
}

export namespace ClientUserTypes {
    export interface User {
        _id: string
        name: string
        username: string
        coins: number
        level: number
        xp: number
    }
}