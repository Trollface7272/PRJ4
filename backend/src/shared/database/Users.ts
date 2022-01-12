import { emptyUser, isDev } from "@shared/constants"
import { HashPassword } from "@shared/functions"
import { randomBytes } from "crypto"
import { Schema, model, connection, Types } from "mongoose"
import { IUser } from "src/types/Database"

const schema = new Schema<IUser>({
    _id: Types.ObjectId,
    name: String,
    username: String,
    password: String,
    groups: Array,
    sessions: Array,
    level: Number,
    xp: Number,
    coins: Number
})

const Model = model<IUser>("User", schema)


export const GetUsers = async (): Promise<IUser[]> => {
    console.log(connection.collection("users"))
    return []
}

export const isSessionValid = async (session: string): Promise<boolean> => {
    return await getUserFromSession(session) != null
}

export const getUserFromSession = async (session: string): Promise<IUser> => {
    const res = (await collection()?.findOne<IUser>({sessions: {$all: [session]}}))

    return res || (isDev && emptyUser)
}

export const addSession = async (id: Types.ObjectId) => {
    const sessionString = randomBytes(16).toString("hex")

    ;(await collection().updateOne({_id: id}, {$push: {sessions: sessionString}}))

    return sessionString
}

export const findUser = async (name: string, password: string) => {
    password = HashPassword(password)
    const res = (await collection()?.findOne<IUser>({username: name, password: password}))
    if (!res) return

    let session = await addSession(res._id)
    return session
}

const collection = () => connection.collection("users")