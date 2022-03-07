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
    let isValid: boolean
    try {
        isValid = await Users.isSessionValid(req.cookies.session)
    } catch(err) {
        return res.status(500).send({message: "Unknown error occured"})
    }
    res.status(200).json({ isValid })
}
