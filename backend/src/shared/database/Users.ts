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
    return []
}

export const isSessionValid = async (session: string): Promise<boolean> => {
    return await getUserFromSession(session) != null
}

export const getUserFromSession = async (session: string): Promise<IUser> => {
    const res = (await collection()?.findOne<IUser>({ sessions: { $all: [session] } }))

    return res || (isDev && emptyUser)
}

export const addSession = async (id: Types.ObjectId) => {
    const sessionString = randomBytes(16).toString("hex")

        ; (await collection().updateOne({ _id: id }, { $push: { sessions: sessionString } }))

    return sessionString
}

export const findUser = async (name: string, password: string) => {
    password = HashPassword(password)
    const res = (await collection()?.findOne<IUser>({ username: name, password: password }))
    if (!res) return

    let session = await addSession(res._id)
    return session
}

export const updateCurrency = async (session: string, amount: number) => {
    collection().updateOne({ sessions: { $all: [session] } }, { $inc: { coins: amount } })
}

export const changeUsername = (id: Types.ObjectId, newUsername: string) => {
    collection().updateOne({ _id: id }, { $set: { username: newUsername } })
}
export const changeName = (id: Types.ObjectId, newName: string) => {
    collection().updateOne({ _id: id }, { $set: { name: newName } })
}
export const changePassword = (id: Types.ObjectId, newPassword: string) => {
    collection().updateOne({ _id: id }, { $set: { password: newPassword } })
}
export const getAllNames = async () => {
    const out = []
    //@ts-ignore
    for await (const doc of collection().find<IUser>({})) {
        out.push({_id: doc._id, name: doc.name})
    }
    return out
}

const collection = () => connection.collection("users")