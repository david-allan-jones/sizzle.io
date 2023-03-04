import { FormEvent, useState } from "react"
import { Option } from "@/components/Option"
import { calculateTtl } from "@/utils/ttl"
import { Layout } from "@/components/Layout"

export default function IndexPage() {
    const [question, setQuestion] = useState<string>('')
    const [option, setOption] = useState<string>('')
    const [savedOptions, setSavedOptions] = useState<string[]>([])
    const [expires, setExpires] = useState<Date>(new Date())

    const resetForm = () => {
        setQuestion('')
        setSavedOptions([])
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        fetch('/api/polls', {
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
        resetForm()
    }

    const handleAddOption = (e: React.MouseEvent) => {
        setSavedOptions([...savedOptions, option])
        setOption('')
    }

    const handleDateChange = (e: any) => {
        setExpires(new Date(e.target.value))
    }

    const isDisabled = !question || !savedOptions.length

    return <Layout>
        <form typeof="submit" action="/api/polls" method="post" onSubmit={handleSubmit}>
            <input
                type="text"
                value={question}
                placeholder="What is your favorite color?"
                onChange={(e) => setQuestion(e.target.value)}
            />
            {savedOptions.map((o, index) => (
                <Option
                    key={index}
                    value={o}
                    onDelete={() => {
                        setSavedOptions(current => current.filter((_, i) => i !== index))
                    }}
                />
            ))}
            <input
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
            <input type="datetime-local" onChange={handleDateChange} defaultValue={expires.toISOString().slice(0, 16)} />
            <input type="submit" disabled={isDisabled} value="Create" />
        </form>
    </Layout>
}