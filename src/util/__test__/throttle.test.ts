import { makeThrottle, getNow, sleepUntil } from '../throttle'
import { IThrottle } from '../../types'

let NOW = 0

// create mocks
const nowMock = jest.fn(() => NOW)
jest.useFakeTimers('legacy')
global.Date.now = nowMock

beforeEach(() => {
    jest.clearAllTimers()
    jest.clearAllMocks()
    NOW = 0
})

describe(getNow.name, () => {
    test('Call Date.now()', () => {
        getNow()
        expect(nowMock.mock.calls.length).toBe(1)
    })
    test('Return the current timestamp from Date.now', () => {
        const value1 = 0
        NOW = value1
        const result1 = getNow()

        const value2 = 150000
        NOW = value2
        const result2 = getNow()

        expect(result1).toBe(value1)
        expect(result2).toBe(value2)
    })
})

describe(sleepUntil.name, () => {
    describe('If the current timestamp is less than the target timestamp', () => {
        test('Call setTimeout', () => {
            // tslint:disable-next-line:no-floating-promises
            sleepUntil(NOW + 1000)
            expect(setTimeout).toHaveBeenCalledTimes(1)
        })
        test('Call setTimeout for a duration equal to the target duration - NOW', () => {
            NOW = 0
            const targetTimestamp = 1234
            // tslint:disable-next-line:no-floating-promises
            sleepUntil(NOW + targetTimestamp)
            expect(setTimeout).toBeCalledWith(expect.any(Function), targetTimestamp)
        })
    })
    describe('If the current timestamp is greater than the target timestamp', () => {
        test(`Don't call setTimeout`, async () => {
            const targetTimestamp = 1000
            NOW = 2000
            await sleepUntil(targetTimestamp)
            expect(setTimeout).not.toHaveBeenCalled()
        })
    })
    describe('If the current timestamp is equal to the target timestamp', () => {
        test(`Don't call setTimeout`, async () => {
            const targetTimestamp = 1000
            NOW = 1000
            await sleepUntil(targetTimestamp)
            expect(setTimeout).not.toHaveBeenCalled()
        })
    })
})

describe('makeThrottle', () => {
    test('Return a function', () => {
        const result = makeThrottle()
        expect(typeof result).toBe('function')
    })
})

describe('throttle', () => {
    const callOrder = { order: 0 }
    const throttledFn = jest.fn(async () => {
        callOrder.order++
        return callOrder.order
    })

    beforeEach(() => {
        callOrder.order = 0
    })

    test('Call the passed throttled function', async () => {
        const throttle = makeThrottle()
        await throttle(throttledFn)
        expect(throttledFn).toHaveBeenCalled()
    })

    test('Call the passed throttled function with all received arguments', async () => {
        const throttle = makeThrottle()
        const arg1 = 'arg1'
        const arg2 = 2
        await throttle(throttledFn, arg1, arg2)
        expect(throttledFn).toHaveBeenCalledWith(arg1, arg2)
    })

    test('Call the throttled functions in the correct order', async () => {
        const throttle = makeThrottle(4, 1000)
        const proms = [
            throttle(throttledFn),
            throttle(throttledFn),
            throttle(throttledFn),
            throttle(throttledFn),
            throttle(throttledFn),
            throttle(throttledFn),
            throttle(throttledFn),
        ]
        jest.advanceTimersByTime(1000)
        NOW += 1000

        const results = await Promise.all(proms)

        results.forEach((result, i) => {
            expect(result).toBe(i + 1)
        })
    })

    describe('When a throttle is created with a duration of 5 seconds and 3 calls per duration', () => {
        let throttle: IThrottle
        beforeEach(() => {
            throttle = makeThrottle(3, 5000)
        })
        describe('When called 3x', () => {
            test('Call the throttled fn each time', async () => {
                await throttle(throttledFn)
                expect(throttledFn).toHaveBeenCalledTimes(1)
                await throttle(throttledFn)
                expect(throttledFn).toHaveBeenCalledTimes(2)
                await throttle(throttledFn)
                expect(throttledFn).toHaveBeenCalledTimes(3)
            })
            test("Don't call setTimeout", async () => {
                await throttle(throttledFn)
                await throttle(throttledFn)
                await throttle(throttledFn)
                expect(setTimeout).not.toHaveBeenCalled()
            })
        })
        describe('When called 4 times at the same time', () => {
            test('Only call the throttled fn the fourth time after 5 seconds have passed', async () => {
                const proms = [
                    throttle(throttledFn),
                    throttle(throttledFn),
                    throttle(throttledFn),
                    throttle(throttledFn),
                ]
                expect(throttledFn).toHaveBeenCalledTimes(3)
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all(proms)
                expect(throttledFn).toHaveBeenCalledTimes(4)
            })
            test('call setTimeout once', async () => {
                const proms = [
                    throttle(throttledFn),
                    throttle(throttledFn),
                    throttle(throttledFn),
                    throttle(throttledFn),
                ]
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all(proms)
                expect(setTimeout).toHaveBeenCalledTimes(1)
            })
        })
        describe('When called 9 times without ever exceeding the rate limit', () => {
            test('Call throttled function 9 times', async () => {
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                expect(throttledFn).toHaveBeenCalledTimes(9)
            })
            test('Never call setTimeout', async () => {
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                await Promise.all([throttle(throttledFn), throttle(throttledFn), throttle(throttledFn)])
                jest.advanceTimersByTime(5000)
                NOW += 5000
                expect(setTimeout).not.toHaveBeenCalled()
            })
        })
    })
})
