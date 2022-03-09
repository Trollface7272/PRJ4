import { ClientUserTypes, ServerUserTypes } from '@database/types/users'
import { Types } from "mongoose"
import Users from '@database/users'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { user?: ClientUserTypes.User, message?: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    if (!req.body.id) return res.status(400).send({ message: "Invalid body params"})
    const { id } = req.body
    console.log(id);
    
    const user = await Users.fromSession(req.cookies.session)
    if (!user) return res.status(403).send({ message: "Invalid session"})
    if (!user.permissions.admin && !user.permissions.teacher) return res.status(403).send({ message: "No permissions"})
    const lookedUpUser: ServerUserTypes.User|ClientUserTypes.User|undefined = await Users.fromId(new Types.ObjectId(id))
    if (!lookedUpUser) return res.status(404).send({ message: "Not found"})
    const u = {
        _id: lookedUpUser._id.toString(),
        name: lookedUpUser.name,
        username: lookedUpUser.username,
        coins: lookedUpUser.coins,
        level: lookedUpUser.level,
        xp: lookedUpUser.xp,
        permissions: lookedUpUser.permissions
    }
    return res.json({user: u })
}