import { Types } from "mongoose"
export namespace ServerShopTypes {
    export interface Requirements {
        groups: Types.ObjectId[]
        level: number
    }
    export interface Purchase {
        userId: Types.ObjectId
        date: Date
    }
    export interface Item {
        _id: Types.ObjectId
        name: string
        description: string
        requirements: Requirements
        cost: number
        stock: number
        purchases?: Purchase[]
    }
}

export namespace ClientShopTypes {
    export interface Requirements {
        groups: string[]
        level: number
    }
    export interface Purchase {
        userId: string
        name: string
        date: Date
    }
    export interface Item {
        _id: string
        name: string
        description: string
        requirements?: Requirements
        purchases: Purchase[]
        cost: number
        stock: number
    }
}