const KEY = 'creator_token'

export function createCreatorTokenStore() {
    const get = () => {
        const current = localStorage.get(KEY) as string | undefined
        if (!current) {
            return []
        }
        return JSON.parse(current)
    }

    const append = (token: string) => {
        const current = get()
        localStorage.setItem(KEY, JSON.stringify([
            ...current,
            token
        ]))
    }

    return {
        get,
        append,
    }
}