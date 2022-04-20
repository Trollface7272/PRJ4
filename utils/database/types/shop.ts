import { Types } from "mongoose"
export namespace ServerShopTypes {
    export interface Requirements {
        groups: Types.ObjectId[]
        level: number
    }
    export interface Item {
        _id: Types.ObjectId
        name: string
        description: string
        requirements: Requirements
        cost: number
        stock: number
    }
}

export namespace ClientShopTypes {
    export interface Requirements {
        groups: string[]
        level: number
    }
    export interface Item {
        _id: string
        name: string
        description: string
        requirements?: Requirements
        cost: number
        stock: number
    }
}