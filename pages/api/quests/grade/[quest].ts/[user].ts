import { ClientQuestTypes } from '@database/types/quests'
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
    const { user: userId, quest } = req.query
    
    if (!req?.cookies?.session) return res.status(403).send({ message: "Unset session" })

    const user = await Users.fromSession(req.cookies.session)

}
