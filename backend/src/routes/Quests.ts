import { getPermissions } from "@shared/database/Groups"
import { getQuests, getQuest as getQuestDb, addSubmission } from "@shared/database/Quests"
import { getUserFromSession } from "@shared/database/Users"
import { randomBytes } from "crypto"
import { Request, Response } from "express"
import { writeFileSync } from "fs"
import { Types } from "mongoose"
import { join } from "path"
import { IQuest } from "src/types/Database"




export const getAllVisibleQuests = async (req: Request, res: Response) => {
    const user = await getUserFromSession(req.body.session)
    
    const quests = await getQuests({ "requirements.groups": { $in: [user.groups] } })

    res.json(quests)
}

export const getQuest = async (req: Request, res: Response) => {
    const user = await getUserFromSession(req.body.session)
    const quest = await getQuestDb(req.params.id) as unknown as IQuest
    
    if (!user) return res.status(403).send()
    if (!quest) return res.status(404).send()

    if (user.level < quest.requirements.level) return res.status(403).send()

    for (const group of quest?.requirements?.groups) {        
        if (user.groups.find(el => el.toString() == group.toString())) continue
        return res.status(403).send()
    }
    
    res.json(quest)
}

export const submitQuest = async (req: Request, res: Response) => {
    const { text, files, session } = req.body
    const { id } = req.params
    if (text == null || files == null || id == null) return res.status(400).send()

    const user = await getUserFromSession(session)
    const quest = await getQuestDb(id)
    const permissions = await getPermissions(user)
    
    if (user == null || quest == null || permissions == null) return res.status(400).send()
    
    for (const group of quest.requirements.groups) {
        if (user.groups.find(e => e.toString() == group.toString())) continue
        return res.status(403).send()
    }
    

    const fileNames = []
    for (const file of files) {
        const fileName = randomBytes(16).toString("hex") + "." + file.name.split(".").at(-1)
        fileNames.push(fileName)
        writeFileSync(join(__dirname, "..", "public", "files", fileName),
            Buffer.from(file.data.split(",")[1], "base64"))
    }
    
    addSubmission(fileNames, text, session, id)
    
    res.send()
}