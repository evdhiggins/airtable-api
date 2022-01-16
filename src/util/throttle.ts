import { IThrottle, ThrottledFn, MethodThrottleArg, TableConnectionCredentials } from '../types'

export const getNow = (): number => +new Date(Date.now())

export const sleepUntil = (timestamp: number): Promise<void> => {
    return new Promise(res => {
        const offset = timestamp - getNow()
        return offset > 0 ? setTimeout(res, offset) : res()
    })
}

const throttlesByApiKey = new Map<string, IThrottle>()

/** Return an existing throttle for a given key if it already exists, otherwise create and return a new throttle method */
export const getThrottleForKey = (key: string): IThrottle => {
    const existingThrottle = throttlesByApiKey.get(key)
    if (existingThrottle) {
        return existingThrottle
    }
    const throttle = makeThrottle(5, 1000)
    throttlesByApiKey.set(key, throttle)
    return throttle
}

/** A pass-through stub of IThrottle */
export const throttleStub = ((throttledFn: ThrottledFn, ...args: unknown[]) => throttledFn(...args)) as IThrottle

/** Return an IThrottle method for the given requestsPerDuration / duration inputs */
export const makeThrottle = (requestsPerDuration = 3, duration = 1000): IThrottle => {
    let throttleExpiration = getNow() + duration
    let requestsPerformed = 0

    const throttle = async (fn: ThrottledFn, ...args: unknown[]): Promise<unknown> => {
        const currentTimestamp = getNow()
        if (currentTimestamp >= throttleExpiration) {
            throttleExpiration = getNow() + duration
            requestsPerformed = 0
        }
        if (requestsPerformed >= requestsPerDuration) {
            await sleepUntil(throttleExpiration)
            return throttle(fn, ...args)
        }
        requestsPerformed++
        return fn(...args)
    }

    return throttle as IThrottle
}

export const parseThrottleArg = (arg: MethodThrottleArg, credentials: TableConnectionCredentials): IThrottle => {
    if (arg === undefined || arg === null) {
        return getThrottleForKey(credentials.apiKey)
    }
    if (arg === false) {
        return throttleStub
    }
    return arg
}
