import { ClientQuestTypes } from '@database/types/quests'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Users, Quests } from "utils/database/index"
import {Types} from "mongoose"

type Data = {
    quests: ClientQuestTypes.Quest[]
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })
    const { id: group } = req.query
    
    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })

    const user = await Users.fromSession(req.cookies.session)

    if (!user) return res.status(403).send({ message: "Invalid session" })
    if (!user.permissions.admin && !user.permissions.teacher)
        return res.status(403).send({ message: "Invalid permissions" })

    const quests = (await Quests.getByGroup(new Types.ObjectId(group as string))).map<ClientQuestTypes.Quest>(el => ({
        _id: el._id.toString(),
        description: el.description,
        name: el.name,
        rewards: el.rewards,
        submissions: el.submissions?.map<ClientQuestTypes.QuestSubmissions>(sm => ({
            files: sm.files,
            originalNames: sm.originalNames,
            submitedAt: sm.submitedAt.toString(),
            text: sm.text,
            userId: sm.userId.toString()
        }))
    }))

    res.status(200).json({ quests })
}
