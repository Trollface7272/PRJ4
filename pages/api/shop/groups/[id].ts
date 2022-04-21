import type { NextApiRequest, NextApiResponse } from 'next'
import { Users, Shop } from "utils/database/index"
import { Types } from "mongoose"
import { ClientShopTypes, ServerShopTypes } from '@database/types/shop'

type Data = {
    items: ClientShopTypes.Item[]
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    const { id: group } = req.query

    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })

    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin && !user.permissions.teacher)
        return res.status(403).send({ message: "Invalid permissions" })

    const items = await Promise.all((await Shop.getByGroup(new Types.ObjectId(group as string))).map<Promise<ClientShopTypes.Item>>(async el => ({
        _id: el._id.toString(),
        cost: el.cost,
        description: el.description,
        name: el.name,
        stock: el.stock,
        requirements: {
            groups: el.requirements.groups.map(el => el.toString()),
            level: el.requirements.level
        },
        purchases: el.purchases ? await Promise.all<ClientShopTypes.Purchase>(el.purchases.map(async el => ({
            date: el.date,
            name: await Users.getNameFromId(el.userId),
            userId: el.userId.toString()
        }))) : []
    })))

    res.status(200).json({ items })
}
