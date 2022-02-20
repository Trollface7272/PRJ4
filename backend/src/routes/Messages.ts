import { Users } from "@shared/database/Users"
import { randomBytes } from "crypto"
import { Request, Response } from "express"
import { writeFileSync } from "fs"
import { Types } from "mongoose"
import { join } from "path"
import { Messages } from "../shared/database/Messages"


export const onSubmit = async (req: Request, res: Response) => {
    const { text, files, session, to } = req.body

    if (!text || !files || !session || !to) return res.status(400).send()

    const user = await Users.getFromSession(session)
    if (!user) res.status(403).send()

    const fileNames = []
    const originalNames = []
    for (const file of files) {
        const fileName = randomBytes(16).toString("hex") + "." + file.name.split(".").at(-1)
        fileNames.push(fileName)
        originalNames.push(file.name)
        writeFileSync(join(__dirname, "..", "public", "files", fileName),
            Buffer.from(file.data.split(",")[1], "base64"))
    }

    Messages.onSubmit(text, fileNames, originalNames, new Types.ObjectId(to), user._id)
    res.json()
}

export const loadMessages = async (req: Request, res: Response) => {
    const { session } = req.body

    if (!session) return res.status(400).send()

    const user = await Users.getFromSession(session)
    if (!user) return res.status(400).send()

    const messages = await Messages.getAllByUserId(user._id)

    res.json(messages)
}

export const getMessage = async (req: Request, res: Response) => {
    const { session } = req.body
    const { id } = req.params

    if(!session) return res.status(400).send()

    const user = await Users.getFromSession(session)
    if (!user) return res.status(400).send()
    
    const message = await Messages.getById(new Types.ObjectId(id))
    if (!message) return res.status(404).send()

    if (message.to.toString() !== user._id.toString() && message.from.toString() !== user._id.toString()) return res.status(403).send()
    const toUser = await Users.getByUserId(message.to._id) || {_id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User"}
    const fromUser = await Users.getByUserId(message.from._id) || {_id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User"}
    res.json({
        _id: message._id,
        text: message.text,
        fileNames: message.fileNames,
        originalNames: message.originalNames,
        unread: true,
        to: {
            isMe: false,
            _id: toUser._id,
            name: toUser.name
        },
        from: {
            isMe: false,
            _id: fromUser._id,
            name: fromUser.name
        }
    })
}