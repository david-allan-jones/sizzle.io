import { createRedis } from '@/store/redis';
import { generateRandomBase64String } from '@/utils/base64';
import { getBearerToken } from '@/utils/nextRequest';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Option } from '@/store/redis';
import { calculateTtl } from '@/utils/ttl';

export interface PollApiData {
  id?: string
  question: string,
  options: string[],
  expires_timestamp: number,
}

export type WritePollResponseData = {
  success: boolean,
  payload?: {
    id: string,
    creator_token: string,
  }
}

export type PollApiResponse = NextApiResponse<WritePollResponseData>

type PollStoreValue = {
  question: string,
  options: Option[],
  expires_timestamp: number,
  creator_token: string,
}

interface PollApiRequest extends NextApiRequest {
  body: {
    id?: string,
    question: string,
    options: string[],
    expires_timestamp: number,
  }
}

const createId = () => generateRandomBase64String(16)

export default async function handler(req: PollApiRequest, res: PollApiResponse) {
    if (req.method === 'POST') {
      if (typeof req.body.question !== 'string') {
        return res.status(400).end()
      }
      if (req.body.options.length >= 10) {
        return res.status(400).end()
      }
      if (typeof req.body.expires_timestamp !== 'number') {
        return res.status(400).end()
      }

      const redis = createRedis()
      
      redis.on('error', err => {
        console.error(err)
        return res.status(500).end()
      })

      await redis.connect()

      let id = createId()
      let unique = false
      while (!unique) {
        const value = await redis.get(id)
        unique = value === null
      }

      const creator_token = generateRandomBase64String(16)
      const value: PollStoreValue = {
        question: req.body.question,
        options: req.body.options.map(o => ({
          text: o,
          count: 0
        })),
        expires_timestamp: Math.floor(req.body.expires_timestamp),
        creator_token,
      }
      const ttl = calculateTtl(value.expires_timestamp)
      await redis.set(id, JSON.stringify(value), {
        EX: ttl,
      })
      await redis.disconnect()

      return res.json({
        success: true,
        payload: {
          id,
          creator_token,
        }
      })
    }
    return res.status(404).end()
  }