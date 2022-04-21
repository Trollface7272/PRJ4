import type { NextApiRequest, NextApiResponse } from 'next'
import { Users, Shop } from "utils/database/index"
import { Types } from "mongoose"
import { ClientShopTypes, ServerShopTypes } from '@database/types/shop'

type Data = {
    success: boolean
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    const { item: itemId } = req.query

    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })

    const user = await Users.fromSession(req.cookies.session)
    const item = await Shop.getById(new Types.ObjectId(itemId as string))

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!item) return res.status(404).send({ message: "Invalid item" })
    if (user.coins < item.cost || item.stock <= 0)
        return res.status(403).send({ message: "Not enough coins or stock" })
    
    await Users.updateCoins(user._id, -item.cost)
    await Shop.updateStock(item._id, -1)
    await Shop.addPurchase(item._id, user._id)
    
    

    res.status(200).json({ success: true })
}
