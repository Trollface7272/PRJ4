import { Types } from "mongoose"
export namespace ServerMessageTypes {
    export interface dbMessage {
        _id: Types.ObjectId
        to: Types.ObjectId
        from: Types.ObjectId
        text: string
        fileNames: string[]
        originalNames: string[]
    }
    export interface Message {
        _id: Types.ObjectId,
        text: string,
        fileNames: string[],
        originalNames: string[],
        to: {
            isMe: boolean,
            _id: Types.ObjectId,
            name: string
        },
        from: {
            isMe: boolean,
            _id: Types.ObjectId,
            name: string
        }
    }
}

export namespace ClientMessageTypes {
    export interface Message {
        _id: string,
        text: string,
        fileNames: string[],
        originalNames: string[],
        to: {
            isMe: boolean,
            _id: string,
            name: string
        },
        from: {
            isMe: boolean,
            _id: string,
            name: string
        }
    }
}