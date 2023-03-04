export function calculateTtl(expires: Date): number {
    const now_in_seconds = (new Date()).getTime() / 1000
    const expires_in_seconds = expires.getTime() / 1000
    if (now_in_seconds >= expires_in_seconds) {
        return 0
    }
    return expires_in_seconds - now_in_seconds
} 