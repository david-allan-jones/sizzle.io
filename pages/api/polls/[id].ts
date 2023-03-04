import { PollApiResponseData } from '@/pages/polls/[id]'
import { createRedis, PollData } from '@/store/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

type GetResponse = NextApiResponse<PollApiResponseData>

export default async function handler(req: NextApiRequest, res: GetResponse) {
    if (req.method !== 'GET') {
        return res.status(404).end()
    }

    const id = req.query.id as string
    if (!id) {
        return res.status(400).end()
    }
    const redis = createRedis()
    redis.on('error', (err) => {
        console.error(err)
        return res.status(500).end()
    })

    await redis.connect()
    const value = await redis.get(id)
    if (!value) {
        return res.status(404).end()
    }
    await redis.disconnect()

    const pollData = JSON.parse(value) as PollData
    return res.json({
        question: pollData.question,
        options: pollData.options,
        expires_timestamp: pollData.expires_timestamp,
    })
  }