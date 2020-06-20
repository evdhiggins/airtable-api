import { IThrottle, ThrottledFn } from '../types'

export const getNow = () => +new Date(Date.now())

export const sleepUntil = (timestamp: number) => {
    return new Promise(res => {
        const offset = timestamp - getNow()
        return offset > 0 ? setTimeout(res, offset) : res()
    })
}

export const throttleFactory = (requestsPerDuration: number = 3, duration: number = 1000) => {
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
