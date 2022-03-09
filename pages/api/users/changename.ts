import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import { Users } from 'utils/database/index'

type Data = {
    success: boolean
}

type Error = {
    message: string
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    if (!req.body.newName || !req.body.password) return res.status(400).send({ message: "Invalid body params" })
    
    const { newName, password } = req.body
    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (newName === user.username) return res.send({ success: true })
    if (!user.permissions.profile.nameChange && !user.permissions.admin) return res.status(403).send({ message: "Insufficient permissions" })

    if (!await Users.validatePassword(req.cookies.session, password)) return res.status(403).send({message: "Invalid password"})
    await Users.changeName(user._id, newName)
    return res.json({ success: true })
}

export default handler