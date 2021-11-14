import { getQuests, getUserFromSession } from "@shared/Database"
import { Request, Response } from "express"




export const getAllVisibleQuests = async (req: Request, res: Response) => {
    const user = await getUserFromSession(req.body.session)
    const quests = await getQuests({"requirements.groups": {$in: [user.groups]}})
    
    res.json(quests)
}