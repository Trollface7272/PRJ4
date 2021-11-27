import { currentLanguage, Logger } from "./Globals"
import Cookies  from "js-cookie"
import { ApiUser, EmptyUser, User } from "../types/api-users"
import { IQuest } from "../types/api-quests"

export const getSessionCookie = (): string => {
    return Cookies.get("session") || "asdfas"
}

export const PostRequest = (url: string, data: any) => {
    Logger.debug(`POST request -> ${url}`)
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
    Logger.debug(user)
    profile = user
    return user
}

let Quests: IQuest[]
export const GetQuests = async () => {
    if (!Quests) await FetchQuests()
    return Quests
}

const FetchQuests = async () => {
    let quests = await (await PostRequest("/api/quests/load", {
        session: getSessionCookie()
    })).json()
    Logger.debug(quests)
    Quests = [...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests, ...quests]    

}

export const GetQuestById = async (id: string) => {
    if (!Quests) await FetchQuests()
    return Quests.find(el => el.id == id)
}