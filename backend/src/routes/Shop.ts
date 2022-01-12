import { getShopItems } from "@shared/database/Shop";
import { getUserFromSession } from "@shared/database/Users";
import { Request, Response } from "express";


export const getAllVisibleItems = async (req: Request, res: Response) => {
    const { session } = req.body

    if (!session) return res.status(400).send()

    const user = await getUserFromSession(session)
    
    const quests = await getShopItems({ "requirements.groups": { $in: [user.groups] } })

    res.json(quests)
}


