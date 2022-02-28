import { connection, Types } from "mongoose"
import { Users } from "."
import { ServerMessageTypes } from "./types/messages"
import { ServerUserTypes } from "./types/users"

class Messages {
    private static messagesCluster = () => connection.collection("quests")
    public static async getAllMessages(user: ServerUserTypes.User): Promise<ServerMessageTypes.Message[]> {
        let out: any[] = []
        for await (const doc of this.messagesCluster().find<ServerMessageTypes.dbMessage>({ to: user._id })) {
            const toUser = await Users.fromId(doc.to) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }
            const fromUser = await Users.fromId(doc.from) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }

            out.push({
                _id: doc._id,
                text: doc.text,
                fileNames: doc.fileNames,
                originalNames: doc.originalNames,
                to: {
                    isMe: false,
                    _id: toUser._id,
                    name: toUser.name
                },
                from: {
                    isMe: false,
                    _id: fromUser._id,
                    name: fromUser.name
                }
            })
        }
        return out
    }
}

export default Messages