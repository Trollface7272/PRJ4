import type { NextApiRequest, NextApiResponse } from 'next'
import { Users } from "utils/database/index"

type Data = {
    isValid: boolean
}
type Err = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data|Err>) {
    if (req.method !== "POST") return res.status(400).send({ message: 'Only POST requests allowed' })   
    res.status(200).json({ isValid: await Users.isSessionValid(req.cookies.session) })
}
