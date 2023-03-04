import type { NextApiRequest } from 'next'

export function getBearerToken(req: NextApiRequest) {
    const value = req.headers.authorization
    if (!value) return
    return value.slice(7)
}