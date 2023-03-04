import { createClient } from "redis";

export type Option = {
    text: string,
    count: number,
}

export type PollData = {
    id?: string,
    question: string,
    options: Option[],
    expires_timestamp: number, 
    creator_token: string,
}

export function createRedis() {
    const redis = createClient({
        url: process.env.NODE_REDIS_URL,
        password: process.env.NODE_REDIS_PASSWORD,
    })
    return redis
}