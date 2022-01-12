import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { findUser, getUserFromSession, GetUsers, isSessionValid as dbIsSessionValid } from '@shared/database/Users';

const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = StatusCodes;



export const getAllUsers = async (req: Request, res: Response) => {
    const users = (await GetUsers()).map(({sessions, ...rest}) => rest)
    res.send(users)
}

export const isSessionValid = async (req: Request, res: Response) => {
    res.send({code: 200, valid: await dbIsSessionValid(req.body.session)})
}

export const getUser = async (req: Request, res: Response) => {
    const user = [await getUserFromSession(req.body.session)].map(({sessions, ...rest}) => rest)[0]
    
    if (!user) 
        return res.sendStatus(400)
    
    res.send({code: 200, user})
}

export const login = async (req: Request, res: Response) => {
    const {name, password} = req.body

    if (password == null || name == null) return res.status(BAD_REQUEST).send()

    const session = await findUser(name, password)
    if (!session) return res.send({found: false})

    res.json({session: session, found: true})
}