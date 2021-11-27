export interface IQuestRequirements {
    groups: number[]
    level?: number
}

export interface IQuestRewards {
    xp?: number
    coins?: number
}

export interface IQuest {
    id: string
    name: string
    description: string
    requirements: IQuestRequirements
    rewards: IQuestRewards
}

export const EmptyQuest: IQuest = {
    id: "0",
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