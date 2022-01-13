import { getUserFromSession } from "@shared/database/Users"
import { randomBytes } from "crypto"
import { Request, Response } from "express"
import { writeFileSync } from "fs"
import { Types } from "mongoose"
import { join } from "path"
import { onSubmit as onSubmitDb } from "../shared/database/Messages"


export const onSubmit = async (req: Request, res: Response) => {
    const { text, files, session, to } = req.body

    if (!text || !files || !session || !to) return res.status(400).send()

    const user = await getUserFromSession(session)
    if (!user) res.status(403).send()

    const fileNames = []
    for (const file of files) {
        const fileName = randomBytes(16).toString("hex") + "." + file.name.split(".").at(-1)
        fileNames.push(fileName)
        writeFileSync(join(__dirname, "..", "public", "files", fileName),
            Buffer.from(file.data.split(",")[1], "base64"))
    }

    onSubmitDb(text, fileNames, new Types.ObjectId(to), user._id)
    res.json()
}