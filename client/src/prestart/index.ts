import Cookies from "js-cookie"
const Czech = require("../localizations/Czech.json")
const English = require("../localizations/English.json")

const Languages = [Czech, English]
export const LanguageNameList = [{name: "Czech", displayName: "Česky"}, {name: "English", displayName: "English"}]

String.prototype.localize = function (this: string) {
    const lang = Cookies.get("language") || process.env.DEFAULT_LANGUAGE || "English"
    
    const langDict = Languages.find(el => el["code-name"] === lang)
    if (!langDict) {
        //TODO: Report this to server logs maybe
        console.error(`Unknown language -> ${lang}`)
        return this
    }

    const localized: undefined|string = langDict[this as keyof typeof langDict]
    if (!localized) {
        console.info(`Unrecognized word to localize -> ${this}`)
        return this
    }

    return localized
}

export {}