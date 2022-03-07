import { connection, Types } from "mongoose"
import { Connect, Users } from "."
import { MessageModel } from "./models/message"
import { ServerMessageTypes } from "./types/messages"
import { ServerUserTypes } from "./types/users"


class Messages {
    private static messagesCluster = async () => {await Connect(); return connection.collection("quests")}
    public static async getAllMessages(user: ServerUserTypes.User): Promise<ServerMessageTypes.Message[]> {
        const cluster = await this.messagesCluster()
        let out: any[] = []
        for await (const doc of cluster.find<ServerMessageTypes.dbMessage>({ to: user._id })) {
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
    public static async getMessageByIdWithUser(user: ServerUserTypes.User, id: Types.ObjectId): Promise<ServerMessageTypes.Message|undefined> {
        const cluster = await this.messagesCluster()
        const message = await cluster.findOne<ServerMessageTypes.dbMessage>({ _id: id, $or: [{ to: user._id }, { from: user._id }] })
        if (!message) return
        const toUser = await Users.fromId(message.to) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }
        const fromUser = await Users.fromId(message.from) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }

        return {
            _id: message._id,
            text: message.text,
            fileNames: message.fileNames,
            originalNames: message.originalNames,
            to: {
                isMe: false,
                _id: toUser._id as Types.ObjectId,
                name: toUser.name
            },
            from: {
                isMe: false,
                _id: fromUser._id as Types.ObjectId,
                name: fromUser.name
            }
        }
    }
    public static async addMessage(user: ServerUserTypes.User, to: Types.ObjectId,files: string[], originalFiles: string[], text: string) {
        const obj = new MessageModel()
        obj.to = to
        obj.fileNames = files
        obj.originalNames = originalFiles
        obj.from = user._id
        obj.text= text
        await obj.save()
    }
}

export default Messages