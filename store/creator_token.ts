const KEY = 'creator_token'

export function createCreatorTokenStore() {
    const get = (): { [key: string]: number } => {
        const current = localStorage.getItem(KEY) as string | undefined
        if (!current) {
            return {}
        }
        return JSON.parse(current)
    }

    const append = (id: string, token: string) => {
        const current = get()
        localStorage.setItem(KEY, JSON.stringify({
            ...current,
            [id]: token,
        }))
    }

    return {
        get,
        append,
    }
}