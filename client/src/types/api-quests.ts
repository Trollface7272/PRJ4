export interface IQuestRequirements {
    groups: number[]
    level?: number
}

export interface IQuestRewards {
    xp?: number
    coins?: number
}

export interface IQuest {
    _id: string
    name: string
    description: string
    requirements: IQuestRequirements
    rewards: IQuestRewards
}

export const EmptyQuest: IQuest = {
    _id: "",
    name: "",
    description: "",
    requirements: {
        groups: [],
        level: 0
    },
    rewards: {
        coins: 0,
        xp: 0
    }
}