import { Connection as Conn, connect, connection, Schema, model } from "mongoose"
import logger from "../Logger"

var Connection: Conn

export const Connect = async () => {
    if (Connection) return
    const link = process.env.DATABASE_LINK
    if (!link) return process.exit(1)

    logger.info("Connecting to database")

    await connect(link)

    Connection = connection

    logger.info(`Connected to database => ` + connection.name)
}

