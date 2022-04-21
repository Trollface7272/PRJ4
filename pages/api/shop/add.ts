import type { NextApiRequest, NextApiResponse } from 'next'
import { Users, Shop } from "utils/database/index"

type Data = {
    success: boolean
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    const { name, description, groups, level, stock, price } = req.body
    
    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })
    if (!name || !description || !groups || level == null || price == null || stock == null || typeof groups !== 'object') return res.status(400).send({ message: "Invalid body" })

    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin && !user.permissions.teacher) return res.status(403).send({ message: "Invalid permissions" })

    Shop.addItem(name, description, groups, level, price, stock)

    return res.status(200).json({ success: true })
}
