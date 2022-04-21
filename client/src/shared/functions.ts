import { Logger } from "./Globals"
import Cookies  from "js-cookie"

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
    Logger.debug(`GET request -> ${url}`)
    url += "?"
    for(const key in data) url += `${key}=${data[key]}`
    
    return fetch(url, {
        method: "GET"
    })
}

export const swrFetcher = (url: string, cookie: string) => PostRequest(url, {session: cookie}).then(res => res.json())//fetch(url, {method: "POST", body: JSON.stringify({session: cookie})}).then(r => r.json())

export const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = () => {
            resolve((reader.result as string))
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}