import type { NextApiRequest, NextApiResponse } from 'next'
import { PollApiData } from './index'

interface PollData extends PollApiData {
    id: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<PollData>) {
    if (req.method === 'GET') {
        const id = req.query.id as string
        if (!id) {
            return res.status(500).end()
        }
        return res.json({
            id,
            question: 'What is your favorite color?',
            options: [
                'blue',
                'red',
                'yellow',
                'green',
            ],
            ttl_in_seconds: 60 * 60 //1 hour
        })
    }
    return res.status(404).end()
  }