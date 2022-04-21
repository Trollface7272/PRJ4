import { Schema, Types, model, models, Model } from "mongoose"
import { ServerMessageTypes } from "@database/types/messages"
// const schema = new Schema<ServerMessageTypes.dbMessage>({
//     fileNames: Array,
//     from: Types.ObjectId,
//     originalNames: Array,
//     text: String,
//     to: Types.ObjectId
// }, {strict: false})

//export const MessageModel = models["message"] as Model<ServerMessageTypes.dbMessage> || model("message", schema)
