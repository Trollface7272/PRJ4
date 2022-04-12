import type { NextApiRequest, NextApiResponse } from 'next'
import { Users } from 'utils/database/index'
import { Types } from "mongoose"
import { ClientUserTypes } from '@database/types/users'

type Data = {
    users: ClientUserTypes.User[]
}

type Error = {
    message: string
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })

    const { id: group } = req.query

    if (!req?.cookies?.session) return res.status(400).send({ message: "Unset session" })
    if (!group) return res.status(400).send({ message: "Unset id" })

    const user = await Users.fromSession(req.cookies.session)
    
    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin && !user.permissions.teacher) return res.status(403).send({ message: "Invalid permissions" })

    const users = (await Users.getByGroup(new Types.ObjectId(group as string))).map<ClientUserTypes.User>(el => ({
        _id: el._id.toString(),
        coins: el.coins,
        level: el.level,
        name: el.name,
        permissions: el.permissions,
        username: el.username,
        xp: el.xp
    }))
    res.send({ users })
}

export default handler