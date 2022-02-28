import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server"
import { ENDPOINTS } from "../utils/requests"
const Validate: NextMiddleware = async (req: NextRequest, ev: NextFetchEvent) => {
    if (req.url.includes("/api")) return NextResponse.next()
    const response = (await (await fetch(new URL(ENDPOINTS.IS_SESSION_VALID, req.url).toString(), {headers: req.headers, method: "POST"})).json())//await Users.isSessionValid(session)
    const isValid = response.isValid
    
    if (req.url.includes("/login")) {
        if (isValid) {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        } else {
            return NextResponse.next()
        }
    } else {
        if (isValid) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }
}

export default Validate