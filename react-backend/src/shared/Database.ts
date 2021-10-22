import { User } from "src/types/Database"
import { Connection as Conn, connect, connection, Schema, model } from "mongoose"
import logger from "./Logger"
import { DatabaseOptions } from "./SecretConstants"
import { emptyUser, isDev } from "./constants"
var Connection: Conn

const schema = new Schema<User>({
    id: Number,
    name: String,
    sessions: Array
})

const Model = model<User>("User", schema)

export const Connect = async () => {
    if (Connection) return

    logger.info("Connecting to database")

    await connect(DatabaseOptions.link)

    Connection = connection

    logger.info(`Connected to database => ` + connection.name)
}


export const GetUsers = async (): Promise<User[]> => {
    console.log(Connection.collection("users"))
    return []
}

export const isSessionValid = async (session: string): Promise<boolean> => {
    return await getUserFromSession(session) != null
}

export const getUserFromSession = async (session: string): Promise<User> => {
    const res = (await Connection?.collection("users")?.findOne({sessions: {$all: [session]}})) as User

    return res || (isDev && emptyUser)
}