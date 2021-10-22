export interface User {
    id: number
    username: string
    name: string
    sessions: string[]
    permissions: Permissions
}

interface Permissions {
    profile: ProfilePermissions
    
}

interface ProfilePermissions {
    usernameChange: boolean
    passwordChange: boolean
    nameChange: boolean
    avatarChange: boolean
}