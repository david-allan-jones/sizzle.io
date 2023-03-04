import type { NextApiRequest, NextApiResponse } from 'next'

export interface PollApiData {
  question: string,
  options: string[],
  ttl_in_seconds: number,
}

interface PollApiRequest extends NextApiRequest {
  body: PollApiData
}

type PollApiResponse = NextApiResponse<{
  success: boolean
}>

export default function handler(req: PollApiRequest, res: PollApiResponse) {
    if (req.method === 'POST') {
        return res.json({
          success: true
        })
    }
    if (req.method === 'DELETE') {
        return res.json({
          success: true
        })
    }
    return res.status(404).end()
  }