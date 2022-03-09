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
    if (!req.body.newPassword || !req.body.oldPassword) return res.status(400).send({ message: "Invalid body params" })
    
    const { newPassword, oldPassword } = req.body
    const user = await Users.fromSession(req.cookies.session)

    if (newPassword === oldPassword) return res.send({ success: true })
    
    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.profile.passwordChange && !user.permissions.admin) return res.status(403).send({ message: "Insufficient permissions" })

    if (!await Users.validatePassword(req.cookies.session, newPassword)) return res.status(403).send({ message: "Invalid password" })
    await Users.changePassword(user._id, newPassword)
    return res.json({ success: true })
}

export default handler