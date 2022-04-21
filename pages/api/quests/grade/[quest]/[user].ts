import type { NextApiRequest, NextApiResponse } from 'next'
import { Users, Quests } from "utils/database/index"
import {Types} from "mongoose"

type Data = {
    success: boolean
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    const { user: userId, quest: questId } = req.query
    const { action, points } = req.body
    
    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })
    if (!action) return res.status(400).send({ message: "No action provided" })

    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin && !user.permissions.teacher) return res.status(403).send({ message: "Invalid permissions" })

    const quest = await Quests.getQuestById(new Types.ObjectId(questId as string))
    if (!quest) return res.status(404).send({ message: "Quest not found" })

    const toGradeUser = await Users.fromId(new Types.ObjectId(userId as string))
    if(!toGradeUser) return res.status(404).send({ message: "Submission not found" })
    await Quests.gradeSubmission(quest._id, toGradeUser?._id, action, points)
    if (action === "graded") {
        await Users.updateCoins(toGradeUser._id, Math.round(quest.rewards.coins * points/100))
        await Users.updateXp(toGradeUser._id, Math.round(quest.rewards.xp * points/100))
    }

    return res.status(200).json({ success: true })
}
