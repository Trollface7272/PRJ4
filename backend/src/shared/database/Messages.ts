import { connection, model, Schema, Types } from "mongoose"
import { IMessage } from "src/types/Database"
import { Users } from "./Users"

const schema = new Schema<IMessage>({
    from: Types.ObjectId,
    to: Types.ObjectId,
    text: String,
    fileNames: Array,
    originalNames: Array
})

const Model = model<IMessage>("message", schema)
export namespace Messages {
    export const onSubmit = (text: string, fileNames: string[], originalNames: string[], to: Types.ObjectId, from: Types.ObjectId) => {
        const message = new Model()
        message.from = from
        message.to = to
        message.text = text
        message.fileNames = fileNames
        message.originalNames = originalNames
        message.save()
    }

    export const getAllByUserId = async (id: Types.ObjectId) => {
        let out: any[] = []
        for await (const doc of collection().find<IMessage>({ to: id })) {
            const toUser = await Users.getByUserId(doc.to) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }
            const fromUser = await Users.getByUserId(doc.from) || { _id: new Types.ObjectId("111111111111111111111111"), name: "Deleted User" }

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

    export const getById = async (id: Types.ObjectId) => {
        return await collection().findOne<IMessage>({ _id: id })
    }

    export const getUnreadCountByUserId = async (id: Types.ObjectId) => {
        const count = await collection().find({ _id: id, unread: true }).count()
        return count || 0
    }

}

const collection = () => connection.collection("messages")