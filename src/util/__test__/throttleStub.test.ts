import { throttleStub } from '../throttle'

test('Call the given function with the given arguments', () => {
    const fn = jest.fn()
    const args = [1, 2, 3]
    throttleStub(fn, ...args)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(...args)
})
