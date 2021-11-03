export interface User {
    id: number
    username: string
    name: string
    sessions: string[]
    groups: number[]
    permissions: UserPermissions
    level: number
    xp: number
    coins: number
}

export interface UserPermissions {
    profile: ProfilePermissions
    
}

export interface ProfilePermissions {
    usernameChange: boolean
    passwordChange: boolean
    nameChange: boolean
    avatarChange: boolean
}

export interface QuestRequirements {
    groups: number[]
    level: number
}

export interface QuestRewards {
    xp: number
    coins: number
}
export interface Quest {
    id: number
    name: string
    description: string
    requirements: QuestRequirements
    rewards: QuestRewards
}