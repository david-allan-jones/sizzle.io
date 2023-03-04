const KEY = 'answer'

export function createAnswerStore() {
    const get = (): { [key: string]: number } => {
        const current = localStorage.getItem(KEY) as string | undefined
        if (!current) {
            return {}
        }
        return JSON.parse(current)
    }

    const append = (id: string, selectedIdx: number) => {
        const current = get()
        localStorage.setItem(KEY, JSON.stringify({
            ...current,
            [id]: selectedIdx
        }))
    }

    return {
        get,
        append,
    }
}