import { FormEvent, useEffect, useRef, useState } from "react"
import { Option } from "@/components/Option"
import { Layout } from "@/components/Layout"
import { WritePollResponseData } from "../api/polls"
import { createCreatorTokenStore } from "@/store/creator_token"
import { LoadingAnimation } from "@/components/LoadingAnimation"
import styles from '@/styles/Home.module.css'

export default function IndexPage() {
    const [question, setQuestion] = useState<string>('')
    const [option, setOption] = useState<string>('')
    const [savedOptions, setSavedOptions] = useState<string[]>([])
    const [expires, setExpires] = useState<Date>(new Date())
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const questionInputRef = useRef(null)
    const optionInputRef = useRef(null)

    useEffect(() => {
        questionInputRef.current.focus()
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
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
        const { success, payload } = await res.json() as WritePollResponseData
        if (!success) {
            setLoading(false)
            setErrorMessage('There was a problem creating your poll. Please wait and try again later.')
            return
        }
        const tokenStore = createCreatorTokenStore()
        tokenStore.append(payload?.id as string, payload?.creator_token as string)
        window.location.href = `/polls/${payload?.id}`
    }

    const handleAddOption = () => {
        if (option !== '') {
            setSavedOptions([...savedOptions, option])
            setOption('')
            optionInputRef.current.focus()
        }
    }

    const handleDateChange = (e: any) => {
        setExpires(new Date(e.target.value))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddOption()
        }
    }

    const isDisabled = !question || !savedOptions.length

    return <Layout>
        <form className={styles.form} typeof="submit" action="/api/polls" method="post" onSubmit={handleSubmit}>
            <p>Input your poll data</p>
            <div className={styles.grid}>
                <span className={styles.questionPrompt}>Question:</span>
                <input
                        ref={questionInputRef}
                        type="text"
                        className={`${styles.textInput} ${styles.questionInput}`}
                        value={question}
                        placeholder="What is your favorite color?"
                        onChange={(e) => setQuestion(e.target.value)}
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
                    placeholder="Option #1"
                    onChange={(e) => setOption(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <button
                    className={`${styles.secondaryBtn} ${styles.addOptionBtn}`}
                    disabled={option === ""}
                    type="button"
                    onClick={handleAddOption}
                    style={{ width: '40px', height: '40px' }}
                >
                    +
                </button>
                <span className={styles.datePrompt}>Expiration Date:</span>
                <input className={styles.dateInput} type="datetime-local" onChange={handleDateChange} defaultValue={expires.toISOString().slice(0, 16)} />
            </div>
            <input className={`${styles.primaryBtn} full-width`} type="submit" disabled={isDisabled} value="Create" />
            <p>{errorMessage}</p>
            <LoadingAnimation visible={loading} />
        </form>
    </Layout>
}