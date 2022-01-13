import { model, Schema, Types } from "mongoose"
import { IMessage } from "src/types/Database"

const schema = new Schema<IMessage>({
    from: Types.ObjectId,
    to: Types.ObjectId,
    text: String,
    fileNames: Array
})

const Model = model<IMessage>("message", schema)

export const onSubmit = (text: string, fileNames: string[], to: Types.ObjectId, from: Types.ObjectId) => {
    const message = new Model()
    message.from = from
    message.to = to
    message.text = text
    message.fileNames = fileNames
    message.save()
}