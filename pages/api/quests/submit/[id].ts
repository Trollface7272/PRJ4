import type { NextApiRequest, NextApiResponse } from 'next'
import { Quests, Users } from 'utils/database/index'
import { Types } from "mongoose"
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { randomBytes } from 'crypto'
import { dirname, join } from 'path'

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
    //Allow post only
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    
    //Missing body params
    if (!req.body?.files || !req.body?.text) return res.status(400).send({ message: "Invalid body params"})
    
    //Invalid session
    if (!req.cookies.session) return res.status(400).send({ message: "Invalid session"})
    const user = await Users.fromSession(req.cookies.session)

    //Invalid user
    if (!user) return res.status(400).send({ message: "Invalid session"})

    const id = req.query.id as string
    const quest = Quests.getQuestByIdWithUser(user, new Types.ObjectId(id))

    //Invalid quest / no permissions
    if (!quest) return res.status(404).send({ message: "Quest not found" })

    const text = req.body.text
    const files = req.body.files
    const fileNames = []
    const originalNames = []
    const publicPath = join(__dirname, "..", "..", "..", "..", "..", "..", "public", "userdata")
    const userData = join(publicPath, user._id.toString(), "files")
    if (!existsSync(userData)) {
        mkdirSync(join(publicPath, user._id.toString()))
        mkdirSync(userData)
    }
    for (const file of files) {
        const fileName = `${randomBytes(16).toString("hex")}.${file.name.split(".").at(-1)}`
        fileNames.push(fileName)
        originalNames.push(file.name)
        writeFileSync(join(userData, fileName),
            Buffer.from(file.data.split(",")[1], "base64"))
    }
    await Quests.addSubmission(new Types.ObjectId(id), user._id, fileNames, originalNames, text)

    return res.status(200).send({success: true})
}

export default handler