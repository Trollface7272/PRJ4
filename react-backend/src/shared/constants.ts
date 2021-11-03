import { User } from "src/types/Database"

// Put shared constants here
export const isDev = true

export const emptyUser: User = {
    id: 0,
    name: "",
    sessions: ["asdfas"],
    username: "",
    coins: 0,
    groups: [],
    level: 0,
    xp: 0,
    permissions: {
        profile: {
            avatarChange: true,
            nameChange: true,
            passwordChange: true,
            usernameChange: true
        }
    }
}
export const paramMissingError = 'One or more of the required parameters was missing.'
