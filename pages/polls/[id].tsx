import { Layout } from "@/components/Layout"
import { LoadingAnimation } from "@/components/LoadingAnimation"
import { createAnswerStore } from "@/store/answer_store"
import { createCreatorTokenStore } from "@/store/creator_token"
import { createRedis, Option, PollData } from "@/store/redis"
import React, { FormEvent, useEffect, useState } from "react"
import styles from '@/styles/Home.module.css'

export type PollApiResponseData = {
    question: string,
    options: Option[],
    expires_timestamp: number,
}

type Props = {
    id: string,
    data: PollApiResponseData,
}

const tokenStore = createCreatorTokenStore()
const answerStore = createAnswerStore()

export default function IndexPage(props: Props) {
    const [selectedIdx, setSelectedIdx] = useState<number>(-1)
    const [answersVisible, setAnswersVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false)

    useEffect(() => {
        const tokenMap = tokenStore.get()
        if (tokenMap[props.id] !== undefined) {
            setDeleteVisible(true)
        }
        const answeredMap = answerStore.get()
        if (answeredMap[props.id] !== undefined) {
            setSelectedIdx(answeredMap[props.id])
            setAnswersVisible(true)
        }
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`/api/polls/${props.id}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedIdx })
        })
        const { success } = await res.json()
        if (!success) {
            setErrorMessage('There was a submitting your answer. Please wait and try again later.')
            setLoading(false)
            return
        }
        answerStore.append(props.id, selectedIdx)
        setLoading(false)
        setAnswersVisible(true)
    }

    const handleDelete = async () => {
        const res = await fetch(`/api/polls/${props.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenStore.get()[props.id]}`
            },
            body: JSON.stringify({ id: props.id })
        })
        if (res.status !== 200) {
            return
        }
        window.location.href = '/'
    }

    return <Layout>
        <form className={`${styles.form} darkgray-bg`} typeof="submit" action="/api/polls" method="post" onSubmit={handleSubmit}>
            <p>{props.data.question}</p>
            {props.data.options.map((o, i) => <label htmlFor={o.text} className="radio-container">
                <input
                    key={i}
                    disabled={answersVisible}
                    type="radio"
                    onChange={() => setSelectedIdx(i)} id={o.text}
                    name="answer-radio"
                />
                {o.text}
                <span className="checkmark"></span>
                {answersVisible && <p>{o.count} answers</p>}
            </label>)}
            <div>
                <input className={styles.primaryBtn} type="submit" value="Submit" disabled={answersVisible || (!answersVisible && selectedIdx === -1)} />
                <p>{errorMessage}</p>
                {deleteVisible && <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>}
            </div>
        </form>
        <LoadingAnimation visible={loading} />
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
            id,
            data: {
                question: pollData.question,
                options: pollData.options,
                expires_timestamp: pollData.expires_timestamp,
            }
        }
    }
}