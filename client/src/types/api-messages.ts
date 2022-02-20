export namespace Messages {
    export interface Author {
        _id: string
        name: string
        isMe: boolean
    }

    export interface Sender {
        _id: string
        name: string
        isMe: boolean
    }

    export interface Message {
        _id: string
        text: string
        fileNames: string[]
        originalNames: string[]
        from: Author
        to: Sender
    }
}