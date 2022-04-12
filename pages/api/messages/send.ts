import { randomBytes } from 'crypto'
import { Types } from "mongoose"
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'
import { Messages, Users } from 'utils/database/index'

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
    //Allow post only
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })

    //Missing body params
    if (!req.body?.files || !req.body?.text || !req.body?.to) return res.status(400).send({ message: "Invalid body params" })
    const { to, files, text } = req.body
    //Invalid session
    if (!req.cookies.session) return res.status(400).send({ message: "Invalid session" })
    const user = await Users.fromSession(req.cookies.session)

    //Invalid user
    if (!user) return res.status(400).send({ message: "Invalid session" })
    const toUser = await Users.fromId(to)
    //TODO: uncomment this later
    //if (!toUser || toUser._id.toString() === user._id.toString()) return res.status(404).send({ message: "User not foun" })

    const fileNames = []
    const originalNames = []
    const dataFolder = join(process.env.PUBLIC_FOLDER_PATH as string, "users", user.name, "messages")
    if (!existsSync(dataFolder))
        mkdirSync(dataFolder, { recursive: true })

    for (const file of files) {
        const fileName = `${randomBytes(16).toString("hex")}.${file.name.split(".").at(-1)}`
        fileNames.push(fileName)
        originalNames.push(file.name)
        writeFileSync(join(dataFolder, fileName),
            Buffer.from(file.data.split(",")[1], "base64"))
    }

    Messages.addMessage(user, toUser?._id as Types.ObjectId || new Types.ObjectId("111111111111111111111111"), fileNames, originalNames, text)

    return res.status(200).send({ success: true })
}

export default handler