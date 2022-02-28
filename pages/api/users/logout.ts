import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = req.cookies.session
    if (session)
    res.setHeader("Set-Cookie", `session=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    res.redirect(302, "/login")
}