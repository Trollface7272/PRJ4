import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { changeName as changeNameDb, changePassword as changePasswordDb, changeUsername as changeUsernameDb, findUser, getUserFromSession, GetUsers, isSessionValid as dbIsSessionValid } from '@shared/database/Users';
import { HashPassword } from '@shared/functions';
import { getPermissions as getPermissionsDb } from '@shared/database/Groups';

const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;



export const getAllUsers = async (req: Request, res: Response) => {
    const users = (await GetUsers()).map(({ sessions, ...rest }) => rest)
    res.send(users)
}

export const isSessionValid = async (req: Request, res: Response) => {
    res.send({ code: 200, valid: await dbIsSessionValid(req.body.session) })
}

export const getUser = async (req: Request, res: Response) => {
    const user = [await getUserFromSession(req.body.session)].map(({ sessions, ...rest }) => rest)[0]

    if (!user)
        return res.sendStatus(400)

    res.send({ code: 200, user })
}

export const login = async (req: Request, res: Response) => {
    const { name, password } = req.body

    if (password == null || name == null) return res.status(BAD_REQUEST).send()

    const session = await findUser(name, password)
    if (!session) return res.send({ found: false })

    res.json({ session: session, found: true })
}

export const changeUsername = async (req: Request, res: Response) => {
    const { newUsername, session, password } = req.body

    if (!newUsername || !session || !password) return res.status(400).send()
    const user = await getUserFromSession(session)
    if (user.password !== HashPassword(password)) return res.status(403).send()
    changeUsernameDb(user._id, newUsername)
    res.json()
}

export const changeName = async (req: Request, res: Response) => {
    const { newName, session, password } = req.body

    if (!newName || !session || !password) return res.status(400).send()
    const user = await getUserFromSession(session)
    if (user.password !== HashPassword(password)) return res.status(403).send()
    changeNameDb(user._id, newName)
    res.json()
}

export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, session } = req.body

    if (!oldPassword || !session || !newPassword) return res.status(400).send()
    const user = await getUserFromSession(session)
    if (user.password !== HashPassword(oldPassword)) return res.status(403).send()
    changePasswordDb(user._id, newPassword)
    res.json()
}

export const getPermissions = async (req: Request, res: Response) => {
    const { session } = req.body
    if (!session) return res.status(400).send()
    const user = await getUserFromSession(session)

    const permissions = await getPermissionsDb(user)
    
    res.json(permissions)
}