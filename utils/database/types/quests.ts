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
        userId: Types.ObjectId
        files: string[]
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
        userId: Types.ObjectId
        files: string[]
        text: string
        submitedAt: Date
    }
    export interface Quest {
        _id: string
        name: string
        description: string
        rewards: QuestRewards
        submissions?: QuestSubmissions[]
    }
}