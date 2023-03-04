import { createRedis, PollData } from '@/store/redis'
import { getBearerToken } from '@/utils/nextRequest'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
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
    if (req.method === 'DELETE') {
        const { id } = req.body
        const bearer_token = getBearerToken(req)
        if (!(id && bearer_token)) {
            return res.status(400).end()
        }
        const redis = await createRedis()
    
        redis.on('error', err => {
            console.error(err)
            return res.status(500).end()
        })
    
        await redis.connect()
    
        const value = await redis.get(id)
        if (!value) {
            return res.status(400).end()
        }
        const deserialized = JSON.parse(value) as { creator_token: string }
        if (bearer_token !== deserialized.creator_token) {
            return res.status(400).end()
        }
    
        await redis.del(id)
        await redis.disconnect()
    
        return res.json({
            success: true
        })
    }
    return res.status(404).end()

  }