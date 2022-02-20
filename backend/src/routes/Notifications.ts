import { Messages } from "@shared/database/Messages"
import { Users } from "@shared/database/Users"
import { Request, Response } from "express"


export const getNewNotifications = async (req: Request, res: Response) => {
    const { session } = req.body
    if (!session) return res.status(400).json()

    const user = await Users.getFromSession(session)
    if (!user) res.status(403).json()

    const data = {
        messages: Messages.getUnreadCountByUserId(user._id)
    }
    res.json(data)
}