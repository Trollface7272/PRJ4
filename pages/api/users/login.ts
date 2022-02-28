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
    res: NextApiResponse<Data|Error>
) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    if (!req.body.username || !req.body.password) return res.status(400).send({ message: "Invalid body params"})
    const valid = await Users.login(req.body.username, req.body.password)

    if (!valid.success) return res.status(404).send({ message: "User not found" })
    res.setHeader("Set-Cookie", `session=${valid.cookie}; Path=/`)
    return res.json({success: true})
}

export default handler