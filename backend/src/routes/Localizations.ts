import logger from "@shared/Logger";
import { Request, Response } from "express";
import { readdirSync, readFile, readFileSync } from "fs"
import { extname } from "path"

const dir = "./src/localizations"
const languages: any = {}
const defaultLanguage = "english"

export const getLocalization = (req: Request, res: Response) => {
    if (!req.query.language) 
        return res.sendStatus(400)
    
    res.send(languages[req.query.language.toString().toLowerCase()] || languages[defaultLanguage])
}

export const getAvailibleLocalization = (req: Request, res: Response) => {
    res.json(Object.keys(languages).map(key => {
        return {
            displayName: languages[key].language,
            requestName: key
        }
    }))
}

readdirSync(dir).filter(name => extname(name) === ".json").map(name => {
    try {
        const lang = JSON.parse(readFileSync(`${dir}/${name}`).toString())
    
        languages[name.substring(0, name.length-5).toLocaleLowerCase()] = lang
    } catch(err) {logger.err("Invalid language file -> " + name)}
})