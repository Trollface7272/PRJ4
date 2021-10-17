import { currentLanguage } from "./Globals"
import Cookies  from "js-cookie"
import { ApiUser, EmptyUser, User } from "../types/api-users"

export const getSessionCookie = (): string => {
    return Cookies.get("session") || "asdfas"
}

export const PostRequest = (url: string, data: any) => {
    return fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}

export const GetRequest = (url: string, data: any) => {
    url += "?"
    for(const key in data) url += `${key}=${data[key]}`
    
    return fetch(url, {
        method: "GET"
    })
}

let Localization: any = {}
let LoadedLanguage = ""
export let loaded = false
export const loadLocal = async () => {
    if (LoadedLanguage === currentLanguage) return

    await GetRequest("/api/local/get", {language: currentLanguage}).then(res => res.json()).then(lang => Localization = lang)
    LoadedLanguage = currentLanguage
    loaded = true
}
export const getLocal = (text: string): string => {
    return Localization[text] || text
}


let profile: User
export const getProfileFast = (): User => {
    return profile || EmptyUser
}
export const getProfileData = async (): Promise<User> => {
    if (profile) return profile
    const resp = await PostRequest("/api/users/user", {session: getSessionCookie()})
    const user = (await resp.json() as ApiUser).user
    profile = user
    return user
}