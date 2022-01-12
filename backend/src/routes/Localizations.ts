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

readdirSync(dir).filter(name => extname(name) === ".json").map(name => {
    const lang = readFileSync(`${dir}/${name}`)
    
    languages[name.substring(0, name.length-5).toLocaleLowerCase()] = JSON.parse(lang.toString())
})