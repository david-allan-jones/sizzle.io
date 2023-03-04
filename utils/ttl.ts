export function calculateTtl(expires_in_seconds: number): number {
    const now_in_seconds = Math.floor((new Date()).getTime() / 1000)
    if (now_in_seconds >= expires_in_seconds) {
        return 0
    }
    return expires_in_seconds - now_in_seconds
} 