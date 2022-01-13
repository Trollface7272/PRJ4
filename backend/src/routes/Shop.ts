import { getShopItem, getShopItems } from "@shared/database/Shop";
import { getUserFromSession, updateCurrency } from "@shared/database/Users";
import { Request, Response } from "express";
import { Types } from "mongoose";


export const getAllVisibleItems = async (req: Request, res: Response) => {
    const { session } = req.body

    if (!session) return res.status(400).send()

    const user = await getUserFromSession(session)

    const shopItems = await getShopItems({ "requirements.groups": { $in: [user.groups] } })

    res.json(shopItems)
}

export const buyItem = async (req: Request, res: Response) => {
    const { session, id } = req.body

    if (!session || !id) return res.status(400).send()

    const user = await getUserFromSession(session)
    const shopItems = await getShopItems({ _id: new Types.ObjectId(id), "requirements.groups": { $in: [user.groups] } })
    if (shopItems.length === 0) return res.status(403).send()
    
    const shopItem = shopItems[0]
    if (shopItem.cost > user.coins) return res.status(403).send()

    updateCurrency(session, -shopItem.cost)
    //TODO: Insert data about the purchase into database
    res.json()
}
