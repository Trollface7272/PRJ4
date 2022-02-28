import { connect, connection } from "mongoose"
import { logger } from "../logger"
export { default as Users } from "./users"
export { default as Quests } from "./quests"
export { default as Messages } from "./messages"
export { default as Shop } from "./shop"

export const Connect = async () => {
    if (connection && (connection.readyState === 1 || connection.readyState === 2)) return
    const dbUrl = process.env.DB_URL as string
    logger.log(`Connecting to database`)  
    await connect(dbUrl, {keepAlive: true})
    logger.log(`Connected to database`)
}
Connect()