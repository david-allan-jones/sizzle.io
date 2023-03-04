import { createRedis } from '@/store/redis';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Option } from '@/store/redis';
import { calculateTtl } from '@/utils/ttl';

export type WriteAnswerResponse = {
  success: boolean,
}

export type AnswerApiResponse = NextApiResponse<WriteAnswerResponse>

type PollStoreValue = {
  question: string,
  options: Option[],
  expires_timestamp: number,
  creator_token: string,
}

interface PollApiRequest extends NextApiRequest {
  body: {
    selectedIdx: number,
  }
}

export default async function handler(req: PollApiRequest, res: AnswerApiResponse) {
    if (req.method === 'POST') {
      const redis = createRedis()
      
      redis.on('error', err => {
        console.error(err)
        return res.status(500).end()
      })

      await redis.connect()

      const id = req.query.id as string
      const { selectedIdx } = req.body
      const value = await redis.get(id)
      if (!value) {
          return res.status(404).end()
      }
      const deserialized = JSON.parse(value) as PollStoreValue
      deserialized.options[selectedIdx].count++
      const ttl = calculateTtl(deserialized.expires_timestamp)
      await redis.set(id, JSON.stringify(deserialized), {
        EX: ttl,
      })
      await redis.disconnect()

      return res.json({
        success: true,
      })
    }
    return res.status(404).end()
  }