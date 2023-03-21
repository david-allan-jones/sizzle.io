import { createRedis } from '@/store/redis';
import { generateRandomBase64String } from '@/utils/base64';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Option } from '@/store/redis';
import { calculateTtl } from '@/utils/ttl';
import { MAX_POLL_TTL_IN_DAYS, OPTION_LEN_LIMIT, OPTION_LIMIT, QUESTION_LEN_LIMIT } from '@/utils/consts';

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
  },
  error?: {
    message: string
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
      console.log(req.body)
      if (typeof req.body.question !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            message: '"question" must be a string'
          }
        })
      }
      if (req.body.question.length > QUESTION_LEN_LIMIT) {
        return res.status(400).json({
          success: false,
          error: {
            message: `"question" must be between 1-${QUESTION_LEN_LIMIT} characters`
          }
        })
      }
      if (req.body.options.length > OPTION_LIMIT) {
        return res.status(400).json({
          success: false,
          error: {
            message: `"options" must have between 2-${OPTION_LIMIT} strings`
          }
        })
      }
      for (let i = 0; i < req.body.options.length; i++) {
        if (req.body.options[i].length > OPTION_LEN_LIMIT) {
          return res.status(400).json({
            success: false,
            error: {
              message: `"options" strings must be between 1-${OPTION_LEN_LIMIT} characters`
            }
          })
        }
      }
      if (typeof req.body.expires_timestamp !== 'number') {
        return res.status(400).json({
          success: false,
          error: {
            message: '"expires_timestamp" must be a unix timestamp'
          }
        })
      }
      const NOW_IN_SECONDS = (new Date()).getTime() / 1000
      if  (((req.body.expires_timestamp - NOW_IN_SECONDS) / 86400) > MAX_POLL_TTL_IN_DAYS) {
        return res.status(400).json({
          success: false,
          error: {
            message: `"expires_timestamp" can be a max of ${MAX_POLL_TTL_IN_DAYS} days`
          }
        })
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