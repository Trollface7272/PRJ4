import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { getUserFromSession, GetUsers, isSessionValid as dbIsSessionValid } from '@shared/Database';

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
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


/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addOneUser(req: Request, res: Response) {

}


/**
 * Update one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneUser(req: Request, res: Response) {

}


/**
 * Delete one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteOneUser(req: Request, res: Response) {

}
