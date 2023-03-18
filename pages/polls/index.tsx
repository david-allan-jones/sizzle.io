import { FormEvent, useRef, useState } from "react"
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

    const optionInputRef = useRef(null)

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

    const handleAddOption = (e: React.MouseEvent) => {
        setSavedOptions([...savedOptions, option])
        setOption('')
        optionInputRef.current.focus()
    }

    const handleDateChange = (e: any) => {
        setExpires(new Date(e.target.value))
    }

    const isDisabled = !question || !savedOptions.length

    return <Layout>
        <form className={styles.form} typeof="submit" action="/api/polls" method="post" onSubmit={handleSubmit}>
            <p>Input your poll data</p>
            <div>
                <input
                    type="text"
                    value={question}
                    placeholder="What is your favorite color?"
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>
            {savedOptions.map((o, index) => (
                <Option
                    key={index}
                    value={o}
                    onDelete={() => {
                        setSavedOptions(current => current.filter((_, i) => i !== index))
                    }}
                />
            ))}
            <div>
                <input
                    ref={optionInputRef}
                    type="text"
                    value={option}
                    placeholder="Option #1"
                    onChange={(e) => setOption(e.target.value)}
                />
                <button
                    disabled={option === ""}
                    type="button"
                    onClick={handleAddOption}
                >
                    +
                </button>
            </div>
            <div>
                <input type="datetime-local" onChange={handleDateChange} defaultValue={expires.toISOString().slice(0, 16)} />
            </div>
            <div>
                <input className={styles.primaryBtn} type="submit" disabled={isDisabled} value="Create" />
            </div>
            <p>{errorMessage}</p>
            <LoadingAnimation visible={loading} />
        </form>
    </Layout>
}