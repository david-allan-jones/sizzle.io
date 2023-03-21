import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Option } from "@/components/Option"
import { Layout } from "@/components/Layout"
import { WritePollResponseData } from "../api/polls"
import { createCreatorTokenStore } from "@/store/creator_token"
import DatePicker from 'react-datepicker'
import { LoadingAnimation } from "@/components/LoadingAnimation"
import styles from '@/styles/Home.module.css'
import { OPTION_LEN_LIMIT, OPTION_LIMIT, QUESTION_LEN_LIMIT } from "@/utils/consts"

const ONE_DAY = 86400000

export default function IndexPage() {
    const [question, setQuestion] = useState<string>('')
    const [option, setOption] = useState<string>('')
    const [savedOptions, setSavedOptions] = useState<string[]>([])
    const [expires, setExpires] = useState<Date>(new Date((new Date()).getTime() + ONE_DAY))
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const questionInputRef = useRef<HTMLElement>(null)
    const optionInputRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (questionInputRef.current) {
            questionInputRef.current.focus()
        }
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (question.length === 0 || question.length > QUESTION_LEN_LIMIT) {
            setErrorMessage('Questions must be between 1-100 characters.')
            return
        }
        if (savedOptions.length < 2) {
            setErrorMessage('You need to provide at least 2 options a poll.')
            return
        }

        setLoading(true)
        const res = await fetch('/api/polls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                options: savedOptions,
                expires_timestamp: Math.floor(expires.getTime() / 1000),
            })
        })
        const { success, payload, error } = await res.json() as WritePollResponseData
        if (!success) {
            setLoading(false)
            if (error) {
                setErrorMessage(error.message)
            } else {
                setErrorMessage('There was a problem creating your poll. Please wait and try again later.')
            }
            return
        }
        const tokenStore = createCreatorTokenStore()
        tokenStore.append(payload?.id as string, payload?.creator_token as string)
        window.location.href = `/polls/${payload?.id}`
    }

    const handleQuestionChange = (e: { target: { value: string }}) => {
        setQuestion(e.target.value)
        setErrorMessage('')
    }

    const handleOptionChange = (e: { target: { value: string }}) => {
        setOption(e.target.value)
        setErrorMessage('')
    }

    const handleAddOption = () => {
        if (savedOptions.length === OPTION_LIMIT) {
            setErrorMessage('You may only enter a max of 10 options')
            return
        }
        if (option === '') {
            setErrorMessage('You may not use an empty string as an option')
            return
        }
        if (option.length > OPTION_LEN_LIMIT) {
            setErrorMessage('You may only use options that are 100 characters or less')
            return
        }
        setSavedOptions([...savedOptions, option])
        setOption('')
        if (optionInputRef.current) {
            optionInputRef.current.focus()
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddOption()
            if (optionInputRef.current) {
                optionInputRef.current.scrollIntoView()
            }
        }
    }

    return <Layout>
        <form className={`${styles.form} darkgray-bg`} typeof="submit" action="/api/polls" method="post" onSubmit={handleSubmit}>
            <p>Input your poll data</p>
            <div className={styles.grid}>
                <span className={styles.questionPrompt}>Question:</span>
                <input
                    ref={questionInputRef}
                    type="text"
                    className={`${styles.textInput} ${styles.questionInput}`}
                    value={question}
                    onChange={handleQuestionChange}
                />
                <div className={styles.savedOptions}>
                {savedOptions.map((o, index) => (
                    <Option
                        key={index}
                        value={o}
                        onDelete={() => {
                            setSavedOptions(current => current.filter((_, i) => i !== index))
                        }}
                    />
                ))}
                </div>
                <span className={styles.optionPrompt}>Option:</span>
                <input
                    ref={optionInputRef}
                    type="text"
                    className={`${styles.textInput} ${styles.optionInput}`}
                    value={option}
                    onChange={handleOptionChange}
                    onKeyDown={(e) => handleKeyDown(e as any)}
                />
                <button
                    className={`${styles.secondaryBtn} ${styles.addOptionBtn}`}
                    type="button"
                    onClick={handleAddOption}
                    style={{ width: '40px', height: '40px' }}
                >
                    +
                </button>
                <span className={styles.datePrompt}>Expiration Date:</span>
                <div className={styles.dateInput}>
                    <DatePicker selected={expires} onChange={(date: Date) => setExpires(date)} />
                </div>
            </div>
            <input className={`${styles.primaryBtn} full-width`} type="submit" value="Create" />
            <p>{errorMessage}</p>
            <LoadingAnimation visible={loading} />
        </form>
    </Layout>
}