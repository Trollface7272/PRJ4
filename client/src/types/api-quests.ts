export namespace Quests {
    export interface Requirements {
        groups: number[]
        level?: number
    }

    export interface Rewards {
        xp?: number
        coins?: number
    }

    export interface Quest {
        _id: string
        name: string
        description: string
        requirements: Requirements
        rewards: Rewards
    }

    export const Empty: Quest = {
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
}