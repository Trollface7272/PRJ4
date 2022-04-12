import { Types } from "mongoose"
export namespace ServerQuestTypes {
    export interface QuestRequirements {
        groups: Types.ObjectId[]
        level: number
    }
    export interface QuestRewards {
        xp: number
        coins: number
    }
    export interface QuestSubmissions {
        type: "awaiting" | "approved" | "returned" | "failed"
        userId: Types.ObjectId
        files: string[]
        originalNames: string[]
        text: string
        submitedAt: Date
    }
    export interface Quest {
        _id: Types.ObjectId
        name: string
        description: string
        requirements: QuestRequirements
        rewards: QuestRewards
        submissions: QuestSubmissions[]
    }
}

export namespace ClientQuestTypes {
    export interface QuestRewards {
        xp: number
        coins: number
    }
    export interface QuestSubmissions {
        type: "awaiting" | "approved" | "returned" | "failed"
        userId: string
        files: string[]
        originalNames: string[]
        text: string
        submitedAt: string
    }
    export interface Quest {
        _id: string
        name: string
        description: string
        rewards: QuestRewards
        submissions?: QuestSubmissions[]
    }
}