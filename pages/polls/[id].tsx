import { Layout } from "@/components/Layout"
import { createRedis, Option, PollData } from "@/store/redis"

export type PollApiResponseData = {
    question: string,
    options: Option[],
    expires_timestamp: number,
}

export default function IndexPage(props: { data: PollApiResponseData }) {
    console.log('props', props.data)
    return <Layout>
        <p>{props.data.question}</p>
        <ul>
        {props.data.options.map((o, i) => <li key={i}>
            {`${o.text} (${o.count})`}
        </li>)}
        </ul>
        <p>{props.data.expires_timestamp}</p>
    </Layout>
}

export const getServerSideProps = async (context: { params: { id: string }}) => {
    const id = context.params.id
    
    const redis = createRedis()
    redis.on('error', (err) => {
        console.error(err)
    })
    await redis.connect()

    const value = await redis.get(id)
    if (!value) return
    await redis.disconnect()

    const pollData = JSON.parse(value) as PollData
    return {
        props: {
            data: {
                question: pollData.question,
                options: pollData.options,
                expires_timestamp: pollData.expires_timestamp,
            }
        }
    }
}