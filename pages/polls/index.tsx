import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Option } from "@/components/Option"
import { Layout } from "@/components/Layout"
import { WritePollResponseData } from "../api/polls"
import { createCreatorTokenStore } from "@/store/creator_token"
import DatePicker from 'react-datepicker'
import { LoadingSpinner } from "@/components/LoadingAnimation"
import styles from '@/styles/Home.module.css'
import { OPTION_LEN_LIMIT, OPTION_LIMIT, QUESTION_LEN_LIMIT } from "@/utils/consts"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const ONE_DAY = 86400000

export default function IndexPage() {
    const [question, setQuestion] = useState<string>('')
    const [option, setOption] = useState<string>('')
    const [savedOptions, setSavedOptions] = useState<string[]>([])
    const [expires, setExpires] = useState<Date>(new Date((new Date()).getTime() + ONE_DAY))
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const questionInputRef = useRef<any>(null)
    const optionInputRef = useRef<any>(null)

    const { t } = useTranslation('common')

    useEffect(() => {
        if (questionInputRef.current) {
            questionInputRef.current.focus()
        }
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (question.length === 0 || question.length > QUESTION_LEN_LIMIT) {
            setErrorMessage(t('common.questionLengthError').toString())
            return
        }
        if (savedOptions.length < 2) {
            setErrorMessage(t('common.notEnoughOptionsError').toString())
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
                setErrorMessage(t('common.genericPostError').toString())
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
            setErrorMessage(t('common.maxOptionsError').toString())
            return
        }
        if (option === '') {
            setErrorMessage(t('common.noEmptyStringOptionError').toString())
            return
        }
        if (option.length > OPTION_LEN_LIMIT) {
            setErrorMessage(t('common.optionLengthError').toString())
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
            <p>{t('common.inputPollData')}</p>
            <div className={styles.grid}>
                <span className={styles.questionPrompt}>{t('common.questionLabel')}</span>
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
                <span className={styles.optionPrompt}>{t('common.optionLabel')}</span>
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
                <span className={styles.datePrompt}>{t('common.dateLabel')}</span>
                <div className={styles.dateInput}>
                    <DatePicker selected={expires} onChange={(date: Date) => setExpires(date)} />
                </div>
            </div>
            <input
                className={`${styles.primaryBtn} full-width`}
                type="submit"
                value={t('common.createButtonLabel').toString()}
            />
            <p>{errorMessage}</p>
        </form>
        <div className={styles.horizontalCenter}>
            {loading && <LoadingSpinner />}
        </div>
    </Layout>
}

export async function getStaticProps(context: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
            ])),
        }
    }
}