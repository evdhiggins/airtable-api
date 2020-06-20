export type ThrottledFn = (...args: unknown[]) => Promise<unknown>

export interface IThrottle {
    <
        FnType extends ThrottledFn = ThrottledFn,
        ArgType extends unknown[] = Parameters<FnType>,
        RetType extends Promise<unknown> = ReturnType<FnType>
    >(
        throttledFn: FnType,
        ...args: ArgType
    ): RetType
}
