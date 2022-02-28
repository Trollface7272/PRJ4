import { parse as cookieParseLib } from "cookie";
import { IncomingMessage } from "http";

export namespace Cookie {
    export const parse = (req: IncomingMessage) => {
        return cookieParseLib(req ? req.headers.cookie || "" : document.cookie)
    }
}