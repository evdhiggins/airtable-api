import { parseThrottleArg, throttleStub } from '../throttle'
import { IRequestCredentials, IThrottle } from '../../types'

const makeCredentialsMock = (apiKey: string) => (({ apiKey } as unknown) as IRequestCredentials)
const throttleMock = (() => null as unknown) as IThrottle

test('Return a function', () => {
    const value = parseThrottleArg(false, makeCredentialsMock(''))
    expect(typeof value).toBe('function')
})

test('Return throttleStub if the throttleArg is `false`', () => {
    const value = parseThrottleArg(false, makeCredentialsMock(''))
    expect(value).toBe(throttleStub)
})

test('Return the given function if throttleArg is a function', () => {
    const value = parseThrottleArg(throttleMock, makeCredentialsMock(''))
    expect(throttleMock).toBe(value)
})

describe('If throttleArg is null | undefined', () => {
    test('Do not return throttleStub', () => {
        const value = parseThrottleArg(undefined, makeCredentialsMock(''))
        expect(value).not.toBe(throttleStub)
    })
    test('Return the same function when given the same api key', () => {
        const value1 = parseThrottleArg(null, makeCredentialsMock('one'))
        const value2 = parseThrottleArg(null, makeCredentialsMock('one'))
        expect(value1).toBe(value2)
    })
    test('Return different functions when given different api keys', () => {
        const value1 = parseThrottleArg(null, makeCredentialsMock('one'))
        const value2 = parseThrottleArg(null, makeCredentialsMock('two'))
        expect(value1).not.toBe(value2)
    })
})
