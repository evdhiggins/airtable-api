export const now = () => +new Date(Date.now())

export const sleepUntil = (timestamp: number) => {
    return new Promise(res => {
        const offset = timestamp - now()
        return offset > 0 ? setTimeout(res, offset) : res()
    })
}

export default (requestsPerDuration: number = 3, duration: number = 1000) => {
    let throttleExpiration = now() + duration
    let requestsPerformed = 0

    const throttle = async <
        T extends (...args: any[]) => Promise<any>,
        A extends unknown[] = T extends (...args: infer X) => Promise<any> ? X : never,
        R = ReturnType<T>
    >(
        fn: T,
        ...args: A
    ): Promise<R> => {
        const currentTimestamp = now()
        if (currentTimestamp >= throttleExpiration) {
            throttleExpiration = now() + duration
            requestsPerformed = 0
        }
        if (requestsPerformed >= requestsPerDuration) {
            await sleepUntil(throttleExpiration)
            return throttle(fn, ...args)
        }
        requestsPerformed++
        const result = await fn(...args)
        return result
    }

    return throttle
}
