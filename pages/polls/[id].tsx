import { Layout } from "@/components/Layout"
import { LoadingSpinner } from "@/components/LoadingAnimation"
import AnswerList from "@/components/polls/AnswerList"
import { createAnswerStore } from "@/store/answer_store"
import { createCreatorTokenStore } from "@/store/creator_token"
import { createRedis, Option, PollData } from "@/store/redis"
import React, { FormEvent, useEffect, useState } from "react"
import styles from '@/styles/Home.module.css'
import { MailIcon } from "@/components/icons/MailIcon"
import { FacebookIcon } from "@/components/icons/Facebook"
import { TwitterIcon } from "@/components/icons/TwitterIcon"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import ResultChart from "@/components/polls/ResultChart"

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

    const { t } = useTranslation('common')
    const router = useRouter()

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
    }, [
        props.id,
        setDeleteVisible,
        setSelectedIdx,
        setAnswersVisible
    ])

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
            setErrorMessage(t('common.answerSubmitError').toString())
            setLoading(false)
            return
        }
        answerStore.append(props.id, selectedIdx)
        setLoading(false)
        window.location.reload()
    }

    const handleDelete = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
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
        router.push('/')
    }

    return <Layout>
        <form
            className={`${styles.form} darkgray-bg`}
            typeof="submit"
            action="/api/polls"
            method="post"
            onSubmit={handleSubmit}
        >
            <p style={{ borderBottom: '1px solid white' }}>{props.data.question}</p>
            <div>
                {!answersVisible && <AnswerList options={props.data.options} onIndexChange={setSelectedIdx}/>}
                {answersVisible && <ResultChart options={props.data.options} />}  
            </div>
            <div className={styles.pollAnswerInputs}>
                {!answersVisible && <input
                    className={styles.primaryBtn}
                    type="submit"
                    value={t('common.submitButtonLabel').toString()}
                    disabled={selectedIdx === -1}
                />}
                {deleteVisible && <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                >
                    {t('common.deleteButtonLabel').toString()}
                </button>}
            </div>
            <div className={styles.shareLinksContainer}>
                <p>Share:</p>
                <MailIcon />
                <FacebookIcon />
                <TwitterIcon />
            </div>
            <p>{errorMessage}</p>
        </form>
        <div className={styles.horizontalCenter}>
            {loading && <LoadingSpinner />}
        </div>
    </Layout>
}

export const getServerSideProps = async (
    context: {
        params: { id: string },
        locale: string
    }
) => {
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
            ...(await serverSideTranslations(context.locale, [
                'common',
            ])),
            id,
            data: {
                question: pollData.question,
                options: pollData.options,
                expires_timestamp: pollData.expires_timestamp,
            }
        }
    }
}
