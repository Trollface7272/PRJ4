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
    const { name, username, groups, password } = req.body
    
    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })
    if (!name || !username || !groups || !password || typeof groups !== 'object') return res.status(400).send({ message: "Invalid body" })

    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin) return res.status(403).send({ message: "Invalid permissions" })

    Users.addUser(name, username, groups, password)

    return res.status(200).json({ success: true })
}
